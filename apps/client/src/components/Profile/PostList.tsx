import React, { useState, useEffect } from "react";
import { getPostsByUser } from "../../api/postApi";
import { useNavigate } from "@tanstack/react-router";
import { PostWithEnsembleDTO } from "@shared/types";
import PostCard from "../PostCard/PostCard";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostWithEnsembleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const postsByUser = await getPostsByUser();
        setPosts(postsByUser);
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setError(
          err instanceof Error ? err.message : "Failed to load posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (posts.length === 0) return <p>No posts found</p>;

  return (
      <ul className="gridLarge">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() =>
              navigate({
                to: `/posts/${post._id}`,
                search: { id: post._id }
          
              })
            }
          >
            <div className="gridItemLarge">
              <PostCard post={post} />
            </div>
          </div>
        ))}
      </ul>
  );
};

export default PostList;
