"use client";
import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost, updatePost, selectPostById, selectAllPosts } from "@/redux/slices/postSlice";
import styles from "./page.module.css";
import { useState } from "react";

// Define interfaces for better type safety
interface Post {
  id: number;
  title: string;
  description: string;
}

export default function Posts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const posts = useSelector(selectAllPosts);
  const dispatch = useDispatch();

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    dispatch(addPost({
      title: title.trim(),
      description: description.trim(),
    }));

    setTitle("");
    setDescription("");
  };

  const handleRemovePost = (postId: number) => {
    dispatch(deletePost({ id: postId }));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleEdit = (post: Post) => {
    setEditMode(true);
    setEditPostId(post.id);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editTitle.trim() || !editDescription.trim() || !editPostId) return;

    dispatch(updatePost({
      id: editPostId,
      title: editTitle.trim(),
      description: editDescription.trim(),
    }));

    setEditMode(false);
    setEditPostId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleSelectPost = (postId: number) => {
    const post = posts.find(post => post.id === postId);
    setSelectedPost(post || null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
  };

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={editMode ? handleUpdatePost : handleAddPost}>
        <p className={styles.formTitle}>{editMode ? "Edit Post" : "Add New Post"}</p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Title"
            value={editMode ? editTitle : title}
            onChange={(e) => handleInputChange(e, editMode ? setEditTitle : setTitle)}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <textarea
            placeholder="Description"
            value={editMode ? editDescription : description}
            className={styles.input}
            onChange={(e) => handleInputChange(e, editMode ? setEditDescription : setDescription)}
            required
          ></textarea>
        </div>
        <button className={styles.submit} type="submit">
          {editMode ? "Update Post" : "Add New Post"}
        </button>
        {editMode && (
          <button 
            className={styles.submit} 
            type="button" 
            onClick={() => {
              setEditMode(false);
              setEditPostId(null);
              setEditTitle("");
              setEditDescription("");
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h1 className={styles.heading}>Posts</h1>
      
      {selectedPost && (
        <div className={styles.selectedPost}>
          <h2>Post Details</h2>
          <p><strong>Title:</strong> {selectedPost.title}</p>
          <p><strong>Description:</strong> {selectedPost.description}</p>
          <button 
            className={styles.editButton}
            onClick={() => setSelectedPost(null)}
          >
            Close Details
          </button>
        </div>
      )}

      <div className={styles.postsContainer}>
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <div key={post.id} className={styles.post}>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.description}>{post.description}</p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemovePost(post.id)}
                >
                  Delete
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button
                  className={styles.viewButton}
                  onClick={() => handleSelectPost(post.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noPosts}>No posts found.</p>
        )}
      </div>
    </div>
  );
}