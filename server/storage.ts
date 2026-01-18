import { posts, type Post, type InsertPost } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Posts
  getPosts(userId: string): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(userId: string, post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(userId: string, insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values({ ...insertPost, userId })
      .returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    const [updated] = await db
        .update(posts)
        .set(updates)
        .where(eq(posts.id, id))
        .returning();
    return updated;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }
}

export const storage = new DatabaseStorage();
