import { Socket } from "socket.io";
import { TopicSocket } from "../lib/topic";

export const handleStartSocket = (socket: Socket, topicSocket: TopicSocket) => {
  setInterval(() => {
    topicSocket.emit("gold_update", {
      gold: Math.floor(Math.random() * 100),
    });
  }, 1000);
};
