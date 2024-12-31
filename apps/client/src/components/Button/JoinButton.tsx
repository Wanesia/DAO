import React, { useState, useEffect } from "react";
import { sendJoinRequest, cancelJoinRequest, checkJoinRequestStatus, fetchUserId } from "../../api/joinRequestApi";
import { useNotification } from "../../context/NotificationContext";
import styles from "./JoinButton.module.css"
interface JoinButtonProps {
  ensembleId: string;
}

const JoinButton: React.FC<JoinButtonProps> = ({ ensembleId }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [joinRequestStatus, setJoinRequestStatus] = useState<'JOIN' | 'WAITING' | 'NONE'>('JOIN');
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await fetchUserId();
        setUserId(userId);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const checkInitialStatus = async () => {
      if (userId) {
        try {
          const joinRequests = await checkJoinRequestStatus(ensembleId);
          
          // Find if current user has a pending request
          const userRequest = joinRequests.find(
            (req: any) => req.userId === userId && req.status === 'PENDING'
          );

          setJoinRequestStatus(userRequest ? 'WAITING' : 'JOIN');
        } catch (error) {
          console.error('Failed to check initial status', error);
        }
      }
    };

    checkInitialStatus();
  }, [userId, ensembleId]);

  const handleClick = async () => {

    if (!userId) {
      console.error("Missing userId");
      return;
    }

    setLoading(true);

    try {
        if (joinRequestStatus === 'WAITING') {
          // Cancel existing request
          await cancelJoinRequest(ensembleId, userId);
          setJoinRequestStatus('JOIN');
          addNotification("success", "Din anmodning er annulleret.");
        } else {
          // Send new join request
          await sendJoinRequest(ensembleId, userId);
          setJoinRequestStatus('WAITING');
          addNotification("success", "Din anmodning er sendt.");
        }
      } catch (error) {
        addNotification("error", "Fejl under anmodning. Prøv igen.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <button  disabled={loading || !userId}
    className={`${styles.button} ${joinRequestStatus === 'WAITING' ? styles.cancel : styles.join}`}
    onClick={handleClick}
    >
      {loading
        ? "Behandler..."
        : joinRequestStatus === "WAITING"
        ? "Annuller anmodning"
        : "Anmod om medlemskab"}
    </button>   
  );
};

export default JoinButton;
