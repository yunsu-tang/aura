import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCheckinSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Failed to create lead" });
      }
    }
  });

  // Update lead stage (for drag and drop)
  app.patch("/api/leads/:id/stage", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stage, position } = req.body;
      
      if (!stage || typeof position !== 'number') {
        return res.status(400).json({ message: "Stage and position are required" });
      }

      const updatedLead = await storage.updateLeadStage(id, stage, position);
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead stage:", error);
      res.status(500).json({ message: "Failed to update lead stage" });
    }
  });

  // Update lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedLead = await storage.updateLead(id, updates);
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  // Create emotional check-in
  app.post("/api/checkins", async (req, res) => {
    try {
      const validatedData = insertCheckinSchema.parse(req.body);
      const checkin = await storage.createCheckin(validatedData);
      res.status(201).json(checkin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid checkin data", errors: error.errors });
      } else {
        console.error("Error creating checkin:", error);
        res.status(500).json({ message: "Failed to create checkin" });
      }
    }
  });

  // Get today's check-in
  app.get("/api/checkins/today", async (req, res) => {
    try {
      const checkin = await storage.getTodaysCheckin();
      res.json(checkin || null);
    } catch (error) {
      console.error("Error fetching today's checkin:", error);
      res.status(500).json({ message: "Failed to fetch today's checkin" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
