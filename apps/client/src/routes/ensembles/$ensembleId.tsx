import { useEffect, useState } from "react";
import {
  createFileRoute,
  useParams,
  useLocation,
} from "@tanstack/react-router";
import { getEnsembleById } from "../../api/ensembleApi";
import { getUserById } from "../../api/userApi";
import { acceptJoinRequest, cancelJoinRequest } from "../../api/joinRequestApi";
import { Ensemble, User } from "@shared/types";
import { JoinRequest } from "@shared/types";
import styles from "./Ensembles.module.css";
import Button from "../../components/Button/Button";

export const Route = createFileRoute("/ensembles/$ensembleId")({
  component: EnsembleInfo,
});

declare module "@tanstack/react-router" {
  interface HistoryState {
    ensemble: Ensemble;
  }
}

interface UserDataMapping {
  [userId: string]: User;
}

function EnsembleInfo() {
  const { ensembleId } = useParams({
    from: "/ensembles/$ensembleId",
    strict: true,
  }) as { ensembleId: string };

  const location = useLocation();
  const ensembleFromState = location.state?.ensemble as Ensemble | undefined;

  const [ensemble, setEnsemble] = useState<Ensemble | null>(
    ensembleFromState || null
  );
  const [userData, setUserData] = useState<UserDataMapping>({});
  const [memberData, setMemberData] = useState<UserDataMapping>({});
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(!ensemble);
  const [error, setError] = useState<string | null>(null);

  // Fallback fetching if the ensemble is not passed via state
  useEffect(() => {
    if (!ensemble) {
      const fetchEnsemble = async () => {
        setLoading(true);
        try {
          const data = await getEnsembleById(ensembleId);
          setEnsemble(data);
        } catch (err) {
          console.error("Failed to fetch ensemble:", err);
          setError("Failed to fetch ensemble details.");
        } finally {
          setLoading(false);
        }
      };

      fetchEnsemble();
    }
  }, [ensemble, ensembleId]);

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

  // Fetch member data
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

  // Handle accept join request
  const handleAccept = async (userId: string) => {
    if (!ensemble) return;

    try {
      await acceptJoinRequest(ensemble._id, userId);

      // Refresh ensemble data after accepting
      const refreshedEnsemble = await getEnsembleById(ensemble._id);
      setEnsemble(refreshedEnsemble);
    } catch (error) {
      console.error("Error accepting join request:", error);
    }
  };

  // Handle decline join request
  const handleDecline = async (userId: string) => {
    if (!ensemble) return;

    try {
      await cancelJoinRequest(ensemble._id, userId);

      // Refresh ensemble data after declining
      const refreshedEnsemble = await getEnsembleById(ensemble._id);
      setEnsemble(refreshedEnsemble);
    } catch (error) {
      console.error("Error declining join request:", error);
    }
  };

  if (loading) return <div>Loading ensemble...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ensemble) return <div>Ensemble not found</div>;

  return (
    <main>
      {ensemble.imageUrl && (
        <img
          src={ensemble.imageUrl}
          alt={ensemble.name}
          className={styles.img}
        />
      )}
      <section>
        <h2>{ensemble.name}</h2>
        <p>
          {ensemble.location.city} {ensemble.location.postCode}
        </p>
        <label>Beskrivelse</label>
        <p>{ensemble.description}</p>
        <label>Antal aktive musikere</label>
        <p>{ensemble.number_of_musicians}</p>
        <label>Øvefrekvens</label>
        <p>{ensemble.practice_frequency}</p>
        <label>Ensemblet spiller</label>
        <p>{ensemble.type}</p>
        <label>Genres</label>
        <p>{ensemble.genres.join(", ")}</p>
        <label>Kontaktperson</label>
        <div>
          {/* add creator name, link to their profile */}
          <p>creator</p>
          <Button color="white-slim" text="Vis profil" />
        </div>
        {ensemble.homepageUrl && (
          <Button
            color="white"
            text="Besøg hjemmeside"
            link={ensemble.homepageUrl}
          />
        )}
      </section>
      <section>
        <h3>Requests to Join</h3>
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
        <h3>Members</h3>
        {ensemble.member_ids?.map((id: string) => (
          <p key={id}>{memberData[id]?.name || "Loading..."}</p>
        ))}
        <p>members card</p>
      </section>
      <section>
        <h3>Posts</h3>
        <p>posts card</p>
      </section>
    </main>
  );
}

export default EnsembleInfo;
