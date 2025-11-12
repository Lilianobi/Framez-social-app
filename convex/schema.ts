import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    caption: v.string(),
    imageUrl: v.optional(v.string()),
    likes: v.array(v.string()),  
    createdAt: v.number(),
  }),
});
