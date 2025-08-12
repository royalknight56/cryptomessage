import type { ActionPayload, User, UserBag } from "@idleworld/types";
import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";

const actionMap = new Map<string, (payload: unknown) => void>();

export const useGameStore = defineStore("game", {
  state: () => ({
    player: null as User | null,
    gameConfig: null,
    gameData: null,
    socket: null as Socket | null,
    bag: null as UserBag | null,
  }),
  actions: {
    wsAction<T>(action: string, payload: unknown) {
      const uid = Math.random().toString(36).substring(2, 15) + Date.now();
      const promise = new Promise<T>((resolve) => {
        actionMap.set(uid, (payload) => {
          actionMap.delete(uid);
          resolve(payload as T);
        });
      });
      this.socket?.emit("action", {
        action: action,
        payload: payload,
        uid: uid,
      } as ActionPayload<unknown>);

      return promise;
    },
    joinGame(callback: () => void) {
      // 核心游戏状态
      const socket = io(import.meta.env.VITE_APP_WS_BASE_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });

      this.socket = socket;

      socket.on("connect", () => {
        callback();
      });
      socket.on("action", (data) => {
        actionMap.get(data.uid)?.(data.payload);
      });

      socket.connect();
    },
    subscribeTopic(topic: string, callback: (data: never) => void) {
      this.socket?.emit("subscribe_topic", topic);
      this.socket?.on(topic, (data) => {
        callback(data as never);
      });
    },
    unsubscribeTopic(topic: string) {
      this.socket?.emit("unsubscribe_topic", topic);
      this.socket?.off(topic);
    },
    setPlayer(player: User) {
      this.player = player;
    },
    setBag(bag: UserBag) {
      this.bag = bag;
    },
  },
});
