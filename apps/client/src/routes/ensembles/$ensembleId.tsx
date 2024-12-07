import { useEffect, useState } from "react";
import {
  createFileRoute,
  useParams,
  useLocation,
} from "@tanstack/react-router";
import { getEnsembleById, deleteEnsemble } from "../../api/ensembleApi";
import { getUserById } from "../../api/userApi";
import { acceptJoinRequest, cancelJoinRequest } from "../../api/joinRequestApi";
import { Ensemble } from "@shared/types";
import { JoinRequest } from "@shared/types";
import styles from "./Ensembles.module.css";
import Button from "../../components/Button/Button";
import GenreTags from "../../components/general-components/GenreTags";
import UserCard from "../../components/UserCard/UserCard";
import { UserProfile } from "@shared/userProfile";
import { UserProvider, useUser } from "../../context/UserContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ensembles/$ensembleId")({
  component: () => (
    <UserProvider>
      <EnsembleInfo />
    </UserProvider>
  ),
});

declare module "@tanstack/react-router" {
  interface HistoryState {
    ensemble: Ensemble;
  }
}

interface UserDataMapping {
  [userId: string]: UserProfile;
}

function EnsembleInfo() {
  const { ensembleId } = useParams({
    from: "/ensembles/$ensembleId",
    strict: true,
  }) as { ensembleId: string };
  const navigate = useNavigate();

  const location = useLocation();
  const ensembleFromState = location.state?.ensemble as Ensemble | undefined;
  const { user } = useUser();

  const [ensemble, setEnsemble] = useState<Ensemble | null>(
    ensembleFromState || null
  );
  const [userData, setUserData] = useState<UserDataMapping>({});
  const [memberData, setMemberData] = useState<UserDataMapping>({});
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(!ensemble);
  const [error, setError] = useState<string | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);

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

  const handleDeleteEnsemble = async (id: string) => {
    try {
      console.log("delete ensemble", id);
      await deleteEnsemble(id);
      navigate({ to: "/profile" })
    } catch (error) {
      console.error("Error deleting ensemble:", error);
    }
  };

  if (loading) return <div>Loading ensemble...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ensemble) return <div>Ensemble not found</div>;

  const isCreator = user?.email === memberData[ensemble.creator]?.email;
  return (
    <main>
      {ensemble.imageUrl && (
        <img
          src={ensemble.imageUrl}
          alt={ensemble.name}
          className={styles.img}
        />
      )}
      <div className={styles.ensemblePage}>
      <section className={styles.ensembleSection}>
        <div className={styles.heading}>
          <h2>{ensemble.name}</h2>
          {ensemble.homepageUrl && (
            <Button
              color="white"
              text="Besøg hjemmeside"
              link={ensemble.homepageUrl}
            />
          )}
        </div>

        <p className={styles.info}>
          {ensemble.location.city} {ensemble.location.postCode}
        </p>
        {/* edit buttons */}
        {isCreator && (
          <>
            <div className={styles.buttons}>
              <Button color="white-slim" text="Rediger info" />
              <Button
                color="white-slim"
                text="Slet ensemble"
                children={<FaTrash />}
                onClick={() => handleDeleteEnsemble(ensemble._id)}
              />
            </div>
            {/* requests */}
            <section className={styles.requests}>
              <h3>Requests to Join</h3>
              {joinRequests.length > 0 ? (
                joinRequests.map((request: JoinRequest) => (
                  <div key={request._id}>
                    <p>
                      {`${userData[request.userId]?.name || "Loading..."} wants to join ${ensemble.name}`}
                    </p>
                    <button onClick={() => handleAccept(request.userId)}>
                      Accept
                    </button>
                    <button onClick={() => handleDecline(request.userId)}>
                      Decline
                    </button>
                  </div>
                ))
              ) : (
                <p>No requests at the moment</p>
              )}
            </section>
          </>
        )}
        {/* general info */}
        <label>Beskrivelse</label>
        <p className={styles.info}>{ensemble.description}</p>
        <label>Antal aktive musikere</label>
        <p className={styles.info}>{ensemble.number_of_musicians}</p>
        <label>Øvefrekvens</label>
        <p className={styles.info}>{ensemble.practice_frequency}</p>
        <label>Ensemblet spiller</label>
        <p className={styles.info}>{ensemble.type}</p>
        <label>Genres</label>
        <div className={styles.info}>
          <GenreTags genres={ensemble.genres} />
        </div>
        {!isCreator && (
          <>
            <label>Kontaktperson</label>
            <div>
              {memberData[ensemble.creator] ? (
                <div className={styles.creator}>
                  <p className={styles.info}>
                    {memberData[ensemble.creator].name}{" "}
                    {memberData[ensemble.creator].surname}
                  </p>
                  <Button color="extra-small" text="Vis profil" />
                </div>
              ) : (
                <p>Loading creator information...</p>
              )}
            </div>
          </>
        )}
      </section>
      {/* posts */}
      <section className={styles.ensembleSection}>
        <h3>Posts</h3>
        <p>posts card</p>
      </section>
      {/* members */}
      <section className={styles.ensembleSection}>
        <div className={styles.membersHeading}>
          <h3>Members</h3>
          {ensemble.member_ids && ensemble.member_ids.length > 8 && (
            <Button
              color="extra-small"
              text={showAllMembers ? "Vis mindre" : "Vis Alle"}
              onClick={() => setShowAllMembers((prev) => !prev)}
            />
          )}
        </div>

        <div className="gridSmall">
          {ensemble.member_ids
            ?.slice(0, showAllMembers ? undefined : 8)
            .map((id: string) => {
              const member = memberData[id];
              return member ? (
                <div className="gridItemSmall" key={id}>
                  <UserCard user={member} size="small" />
                </div>
              ) : (
                <p key={id}>Loading...</p>
              );
            })}
        </div>
      </section>
      </div>
    </main>
  );
}

export default EnsembleInfo;
