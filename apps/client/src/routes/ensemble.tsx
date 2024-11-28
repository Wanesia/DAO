import { useEffect, useState } from "react";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { getUserById } from "../api/userApi";
import { acceptJoinRequest, cancelJoinRequest } from "../api/joinRequestApi";
import { getEnsembleById } from "../api/ensembleApi";
import { JoinRequestStatus } from "@shared/enums";
import { User } from "@shared/types";

// Extend the Router State type to include ensemble
declare module "@tanstack/react-router" {
  interface HistoryState {
    ensemble: Ensemble;
  }
}

interface Ensemble {
  _id: string;
  name: string;
  member_ids?: string[];
  joinRequests?: JoinRequest[];
}

interface JoinRequest {
  userId: string;
  status: JoinRequestStatus;
  _id: string;
}

interface UserDataMapping {
  [userId: string]: User;
}

export const Route = createFileRoute("/ensemble")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const [ensemble, setEnsemble] = useState<Ensemble | null>(location.state?.ensemble || null);
  const [userData, setUserData] = useState<UserDataMapping>({});
  const [memberData, setMemberData] = useState<UserDataMapping>({});
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  // Fetch updated ensemble data
  const refreshEnsembleData = async () => {
    if (!ensemble) return;

    try {
      const updatedEnsemble = await getEnsembleById(ensemble._id);
      setEnsemble(updatedEnsemble);
    } catch (error) {
      console.error("Failed to refresh ensemble data:", error);
    }
  };

  // Fetch users for join requests
  useEffect(() => {
    const requests = ensemble?.joinRequests ?? [];

    if (!requests.length) {
      setUserData({});
      setJoinRequests([]);
      return;
    }

    const fetchJoinRequestUsers = async () => {
      try {
        const userPromises = requests.map(async (request: JoinRequest) => {
          const user = await getUserById(request.userId);
          return { userId: request.userId, user };
        });

        const userData = await Promise.all(userPromises);
        setUserData(
          userData.reduce((acc: UserDataMapping, { userId, user }) => {
            acc[userId] = user;
            return acc;
          }, {})
        );

        setJoinRequests(requests);
      } catch (error) {
        console.error("Failed to fetch join request users:", error);
        setUserData({});
        setJoinRequests([]);
      }
    };

    fetchJoinRequestUsers();
  }, [ensemble?.joinRequests]);

  useEffect(() => {
    const memberIds = ensemble?.member_ids ?? [];

    if (!memberIds.length) {
      setMemberData({});
      return;
    }

    const fetchMembers = async () => {
      try {
        const memberPromises = memberIds.map(async (id: string) => {
          const user = await getUserById(id);
          return { id, user };
        });

        const memberData = await Promise.all(memberPromises);
        setMemberData(
          memberData.reduce((acc: UserDataMapping, { id, user }) => {
            acc[id] = user;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching member data:", error);
        setMemberData({});
      }
    };

    fetchMembers();
  }, [ensemble?.member_ids]);

  const handleAccept = async (userId: string) => {
    if (!ensemble) return;

    try {
      await acceptJoinRequest(ensemble._id, userId);

      // Refresh ensemble data immediately after accepting
      await refreshEnsembleData();
    } catch (error) {
      console.error("Error accepting join request:", error);
    }
  };

  const handleDecline = async (userId: string) => {
    if (!ensemble) return;

    try {
      await cancelJoinRequest(ensemble._id, userId);

      // Refresh ensemble data immediately after declining
      await refreshEnsembleData();
    } catch (error) {
      console.error("Error declining join request:", error);
    }
  };

  // Early return if no ensemble
  if (!ensemble) {
    return <p>No ensemble found.</p>;
  }

  return (
    <div>
      <section>
        <h1>Requests to Join</h1>
        {joinRequests.map((request: JoinRequest) => (
          <div key={request._id}>
            <p>
              {`${userData[request.userId]?.name || "Loading..."} wants to join ${ensemble.name}`}
            </p>
            <button onClick={() => handleAccept(request.userId)}>Accept</button>
            <button onClick={() => handleDecline(request.userId)}>
              Decline
            </button>
          </div>
        ))}
      </section>

      <section>
        <h1>Members</h1>
        {ensemble.member_ids?.map((id: string) => (
          <p key={id}>{memberData[id]?.name || "Loading..."}</p>
        ))}
      </section>
    </div>
  );
}

export default RouteComponent;
