import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { PostWithEnsembleDTO } from "@shared/types";
import { useState, useEffect } from "react";
import { getPostById } from "../../api/postApi";
import GenreTags from "../../components/general-components/GenreTags";
import styles from "./Posts.module.css";
import JoinButton from "../../components/Button/JoinButton";
import { useUser } from "../../context/UserContext";
import Button from "../../components/Button/Button";
import { FaTrash } from "react-icons/fa";
import { deletePost } from "../../api/postApi";
import { useNotification } from "../../context/NotificationContext";
import LoadingRing from "../../components/LoadingRing/LoadingRing";

export const Route = createFileRoute("/posts/$postId")({
  component: () => (

      <PostInfo />

  ),
});

const levelText: Record<number, string> = {
  1: "Passer til en musiker der har spillet under 1 år og kan spille efter simple/forsimplede noder.",
  2: "Passer til en musiker der har spillet 1-2 år og kan spille efter simple/forsimplede noder.",
  3: "Passer til en musiker der har spillet 2-4 år og kan spille efter lettere komplekse noder.",
  4: "Passer til en musiker der har spillet 4-6 år og kan spille efter lettere komplekse noder.",
  5: "Passer til en musiker der har spillet 6-10 år og kan spille efter komplekse noder.",
  6: "Passer til en musiker der har spillet over 10 år og kan spille efter meget komplekse noder.",
};

function PostInfo() {
  const { postId } = useParams({
    from: "/posts/$postId",
    strict: true,
  }) as { postId: string };
  const [post, setPost] = useState<PostWithEnsembleDTO | null>(null);
  const [loading, setLoading] = useState(!post);
  const navigate = useNavigate();
  const { user } = useUser();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!post) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const data = await getPostById(postId);
          setPost(data);
        } catch (err) {
          addNotification("error", "Kunne ikke hente opslag detaljer.");
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [post, postId]);

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      addNotification("success", "Opslag slettet.");
      navigate({ to: "/profile" });
    } catch (error) {
      addNotification("error", "Kunne ikke slette opslag.");
    }
  };

  if (!post) return <div>Opslag ikke fundet.</div>;

  const formattedDate = post.createdAt
    ? new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(post.createdAt))
    : null;

  const isCreator = user && post?.ensemble?.creator === user._id;
  const isMember = user && post?.ensemble?.member_ids?.includes(user._id);
  return (
    <main>
      <div className={styles.content}>
      {loading && <LoadingRing size="large" />}  
        <div className={styles.heading}>
          <h2>{post.title}</h2>
          {formattedDate && <p>Opslag oprettet {formattedDate}</p>}
        </div>
        <div className={styles.request}>
          <div
            className={styles.ensemble}
            onClick={() => navigate({ to: `/ensembles/${post.ensemble._id}` })}
          >
            {post.ensemble.imageUrl && (
              <div className={styles.image}>
                <img
                  src={post.ensemble.imageUrl}
                  alt="ensemble-image"
                  loading="lazy"
                />
              </div>
            )}

            <div className={styles.container}>
              <h4 className={styles.title}>{post.ensemble?.name}</h4>
              <div className={styles.info}>
                <p className={styles.city}>{post.location?.city}</p>
                <p>{post.ensemble?.number_of_musicians}</p>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            {!isMember && !isCreator && (
              <JoinButton ensembleId={post.ensemble._id} />
            )}
            {isCreator && (
              <Button
                color="white-slim"
                text="Slet opslag"
                children={<FaTrash />}
                onClick={() => handleDeletePost(post._id)}
              />
            )}
          </div>
        </div>
        <div>
          <label>Beskrivelse</label>
          <p>{post.description}</p>
        </div>
        <div>
          <label>Minimumsniveau</label>
          <div className={styles.levelContainer}>
            <div>
              <h4 className={styles.level}>Niveau {post.instrument?.level}</h4>
              <p>{levelText[post.instrument.level]}</p>
            </div>
          </div>
        </div>

        <div>
          <label>Genrer</label>
          <GenreTags genres={post.instrument?.genres || []} />
        </div>
      </div>
    </main>
  );
}
