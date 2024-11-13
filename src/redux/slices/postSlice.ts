import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: number;
  title: string;
  description: string;
}

const initialState: Post[] = [
  { id: 1, title: "Post 1", description: "Description of Post 1" },
  { id: 2, title: "Post 2", description: "Description of Post 2" },
  { id: 3, title: "Post 3", description: "Description of Post 3" },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (
      state,
      action: PayloadAction<{ title: string; description: string }>
    ) => {
      const { title, description } = action.payload;
      const newPostId = state.length > 0 
        ? Math.max(...state.map(post => post.id)) + 1 
        : 1;
      
      state.push({
        id: newPostId,
        title,
        description,
      });
    },
    
    updatePost: (
      state,
      action: PayloadAction<{ id: number; title: string; description: string }>
    ) => {
      const { id, title, description } = action.payload;
      const existingPost = state.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.description = description;
      }
    },
    
    deletePost: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      return state.filter(post => post.id !== id);
    },
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;

export const selectAllPosts = (state: { posts: Post[] }) => state.posts;

export const selectPostById = (state: { posts: Post[] }, postId: number) =>
  state.posts.find(post => post.id === postId);

export default postsSlice.reducer;