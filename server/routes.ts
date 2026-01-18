import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth";
import { GoogleGenAI } from "@google/genai";

// Initialize AI for blog generation
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Blog Routes - Protected
  app.get(api.posts.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const posts = await storage.getPosts(userId);
    res.json(posts);
  });

  app.get(api.posts.get.path, isAuthenticated, async (req, res) => {
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Not found" });
    // Verify ownership
    if (post.userId !== (req.user as any).claims.sub) return res.status(403).json({ message: "Forbidden" });
    res.json(post);
  });

  app.post(api.posts.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(userId, input);
      res.status(201).json(post);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.posts.update.path, isAuthenticated, async (req, res) => {
    try {
      // Verify ownership first
      const userId = (req.user as any).claims.sub;
      const existing = await storage.getPost(Number(req.params.id));
      if (!existing) return res.status(404).json({ message: "Not found" });
      if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      const input = api.posts.update.input.parse(req.body);
      const updated = await storage.updatePost(Number(req.params.id), input);
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.posts.delete.path, isAuthenticated, async (req, res) => {
      const userId = (req.user as any).claims.sub;
      const existing = await storage.getPost(Number(req.params.id));
      if (!existing) return res.status(404).json({ message: "Not found" });
      if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });

      await storage.deletePost(Number(req.params.id));
      res.status(204).send();
  });

  // AI Generation Endpoint
  app.post(api.posts.generate.path, isAuthenticated, async (req, res) => {
      const { topic, tone } = req.body;
      const prompt = `Write a blog post about "${topic}". Tone: ${tone || 'professional'}. Return JSON with "title" and "content" fields. Content should be in Markdown.`;
      
      try {
          const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
          });
          
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) throw new Error("No response from AI");
          
          const json = JSON.parse(text);
          res.json(json);
      } catch (e) {
          console.error(e);
          res.status(500).json({ message: "Failed to generate post" });
      }
  });

  return httpServer;
}
