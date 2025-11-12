import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new post
export const create = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    caption: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      ...args,
      likes: [],            // always start with empty array
      createdAt: Date.now(),
    });
  },
});

// List posts, newest first
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});
