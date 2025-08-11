import { ActionPayload, User } from "@idleworld/types";
import { Socket } from "socket.io";
import { UserService } from "../services/user-service";

export class TopicSocket {
  public static playerMap: Map<string, TopicSocket> = new Map();

  private subscribeMap: Map<string, (data: unknown) => void> = new Map();
  private actionMap: Map<
    string,
    (topicSocket: TopicSocket, data: ActionPayload<never>) => void
  > = new Map();
  public user: User | null = null;
  private socket: Socket | null = null;
  public userService: UserService = new UserService(this);

  constructor() {}

  listenSocket(socket: Socket) {
    this.socket = socket;

    socket.on("subscribe_topic", (topic: string) => {
      socket.emit("subscribe_topic", {
        topic: topic,
        success: true,
      });

      this.subscribe(topic, (payload) => {
        socket.emit(topic, {
          topic: topic,
          payload: payload,
          success: true,
        });
      });
    });
    socket.on("unsubscribe_topic", (data: { topic: string }) => {
      this.unsubscribe(data.topic);
      socket.emit("unsubscribe_topic", {
        topic: data.topic,
        success: true,
      });
    });

    socket.on("action", (data: ActionPayload<never>) => {
      this.actionMap.get(data.action)?.(this, data);
    });

    socket.on("disconnect", () => {
      this.userService.removeOnlineUser(this.user?.userId as string);
    });
  }

  setUser(user: User | null) {
    this.user = user;
    TopicSocket.playerMap.set(this.user?.userId as string, this);
    this.userService.addOnlineUser(this.user?.userId as string);
  }

  listenAction(
    actionMap: Record<
      string,
      (topicSocket: TopicSocket, data: ActionPayload<never>) => void
    >,
  ) {
    Object.entries(actionMap).forEach(([key, value]) => {
      this.actionMap.set(key, value);
    });
  }

  actionRes(action: ActionPayload<unknown>, payload: unknown) {
    this.socket?.emit("action", {
      action: action.action,
      payload: payload,
      uid: action.uid,
    });
  }

  subscribe(topic: string, callback: (data: unknown) => void) {
    if (this.subscribeMap.has(topic)) {
      return;
    }
    this.subscribeMap.set(topic, callback);
  }

  unsubscribe(topic: string) {
    this.subscribeMap.delete(topic);
  }

  emit(topic: string, data: unknown) {
    if (!this.subscribeMap.has(topic)) {
      return;
    }
    this.subscribeMap.get(topic)?.(data);
  }

  emitGlobal(topic: string, data: unknown) {
    TopicSocket.playerMap.forEach((player) => {
      player.socket?.emit(topic, {
        topic: topic,
        payload: data,
        success: true,
      });
    });
  }
  emitTo(topic: string, uids: string[], data: unknown) {
    for (const uid of uids) {
      const player = TopicSocket.playerMap.get(uid);

      if (player) {
        // console.log("player", player.socket);
        player.socket?.emit(topic, {
          topic: topic,
          payload: data,
        });
      }
    }
  }
}
