import styles from "./PostCard.module.css";
import { PostWithEnsembleDTO } from "@shared/types";
import { useNavigate } from "@tanstack/react-router";

interface PostCardProps {
  post: PostWithEnsembleDTO;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

  const navigate = useNavigate();
    function truncateText(text: string | undefined, maxLength: number) {
        if (!text) return "No title available";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      }
  return (
    <div className={styles.postCard} onClick={() =>
      navigate({
        to: `/posts/${post._id}`,
        params: { postId: post._id }, 
      })
    }>
      <div className={styles.headingContainer}>
        {post.ensemble.imageUrl && (
          <div className={styles.image}>
            <img
              src={post.ensemble.imageUrl}
              alt="ensemble-image"
              loading="lazy"
            />
          </div>
        )}
        <div className={styles.heading}>
          <h4 className={styles.name}>{post.ensemble.name}</h4>
          <div className={styles.info}>
            <p className={styles.city}>{post.location?.city}</p>
            <p>{post.ensemble.number_of_musicians}</p>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <h4 className={styles.title}>{truncateText(post.title, 100)}</h4>
      </div>
      <div className={styles.instrument}>
        <p className={styles.instrumentName}>{post.instrument.name}</p>
        <p className={styles.level}>
          Erfaring <span>{post.instrument.level}</span>
        </p>
      </div>
    </div>
  );
};

export default PostCard;
