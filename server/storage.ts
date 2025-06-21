import { leads, emotionalCheckins, type Lead, type InsertLead, type Checkin, type InsertCheckin, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods for compatibility
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  updateLeadStage(id: number, stage: string, position: number): Promise<Lead | undefined>;
  
  // Checkin methods
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  getTodaysCheckin(): Promise<Checkin | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private checkins: Map<number, Checkin>;
  private currentId: number;
  private currentLeadId: number;
  private currentCheckinId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.checkins = new Map();
    this.currentId = 1;
    this.currentLeadId = 1;
    this.currentCheckinId = 1;
    
    // Initialize with sample leads
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleLeads: InsertLead[] = [
      {
        name: "John",
        stage: "lust",
        lastContact: new Date("2025-06-05T23:17:51"),
        lastMessage: "Hey, feel free to join the run anytime. I've decided to move on - I think you were right that we're not a match. Enjoy your trip!",
        emotionalROI: 45,
        aiSuggestion: "Consider moving to DEAD stage - conversation indicates mutual decision to end romantic pursuit.",
        position: 0,
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Ed",
        stage: "lust",
        lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lastMessage: "Thanks for the movie recommendation!",
        emotionalROI: 35,
        aiSuggestion: "Create anticipation - suggest watching it together this weekend.",
        position: 1,
        profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Felix",
        stage: "labor",
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastMessage: "I've been really busy with work lately",
        emotionalROI: 58,
        aiSuggestion: "Focus on building trust. Send thoughtful messages without expecting immediate responses.",
        position: 0,
        profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "James",
        stage: "loyal",
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lastMessage: "Can't wait to see you this weekend!",
        emotionalROI: 92,
        aiSuggestion: "Plan meaningful experiences together. Focus on deepening emotional connection.",
        position: 0,
        profilePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Tim",
        stage: "dead",
        lastContact: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastMessage: "I think we should just be friends",
        emotionalROI: 0,
        aiSuggestion: "Focus energy on active leads. Archive for learning purposes.",
        position: 0,
        profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      }
    ];

    sampleLeads.forEach(lead => {
      this.createLead(lead);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => {
      if (a.stage !== b.stage) {
        const stageOrder = ['loyal', 'labor', 'lust', 'dead'];
        return stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
      }
      return a.position - b.position;
    });
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = { ...insertLead, id };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...updates };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }

  async updateLeadStage(id: number, stage: string, position: number): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, stage, position };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Checkin methods
  async createCheckin(insertCheckin: InsertCheckin): Promise<Checkin> {
    const id = this.currentCheckinId++;
    const checkin: Checkin = { ...insertCheckin, id };
    this.checkins.set(id, checkin);
    return checkin;
  }

  async getTodaysCheckin(): Promise<Checkin | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.checkins.values()).find(
      checkin => checkin.date >= today && checkin.date < tomorrow
    );
  }
}

export const storage = new MemStorage();
