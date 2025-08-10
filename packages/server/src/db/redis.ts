import { createClient, RedisClientType } from "redis";
import { UserEntity } from "@idleworld/types";

// docker run -d --name redis -p 6379:6379 redis
class RedisManager {
  private client: RedisClientType;
  private connected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.log("Redis客户端错误:", err);
    });

    this.client.on("connect", () => {
      console.log("已连接到Redis");
      this.connected = true;
    });

    this.client.on("disconnect", () => {
      console.log("Redis连接已断开");
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect();
    }
  }

  async createUser(user: UserEntity): Promise<void> {
    await this.client.set(`user:${user.userId}`, JSON.stringify(user));
    await this.client.set(`email:${user.email.toLowerCase()}`, user.userId);
    await this.client.set(
      `username:${user.username.toLowerCase()}`,
      user.userId,
    );
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    const user = await this.client.get(`user:${userId}`);
    return user ? JSON.parse(user) : null;
  }

  async setUser(userId: string, user: UserEntity): Promise<void> {
    await this.client.set(`user:${userId}`, JSON.stringify(user));
  }

  async getUserIdByEmail(email: string): Promise<string | null> {
    return await this.client.get(`email:${email.toLowerCase()}`);
  }

  async getUserIdByUsername(username: string): Promise<string | null> {
    return await this.client.get(`username:${username.toLowerCase()}`);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const userId = await this.getUserIdByEmail(email);
    if (userId) {
      const user = await this.client.get(`user:${userId}`);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    const userId = await this.getUserIdByUsername(username);
    if (userId) {
      const user = await this.client.get(`user:${userId}`);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  async addOnlineUser(userId: string) {
    await this.client.sAdd("online_users", userId);
  }

  async removeOnlineUser(userId: string) {
    await this.client.sRem("online_users", userId);
  }

  async getOnlineUsers(): Promise<string[]> {
    return await this.client.sMembers("online_users");
  }
}

export const redisManager = new RedisManager();
