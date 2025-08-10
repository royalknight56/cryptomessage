import { redisManager } from "../db/redis";
import { TopicSocket } from "../lib/topic";
import { TopicEnum } from "../types/topic-enum";

export class UserService {
  constructor(private topicSocket: TopicSocket) {}

  async getOnlineUsers() {
    const onlineUsers = await redisManager.getOnlineUsers();
    return onlineUsers;
  }

  async addOnlineUser(userId: string) {
    console.log("addOnlineUser", userId);
    await redisManager.addOnlineUser(userId);
    this.topicSocket.emitGlobal(TopicEnum.ONLINE_USER, {
      onlineUsers: await this.getOnlineUsers(),
    });
  }

  async removeOnlineUser(userId: string) {
    await redisManager.removeOnlineUser(userId);
    this.topicSocket.emitGlobal(TopicEnum.ONLINE_USER, {
      onlineUsers: await this.getOnlineUsers(),
    });
  }
}
