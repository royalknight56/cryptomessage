import { SocketMap } from "../types/socket-map";

export const GameSocketMap: SocketMap = {
  subscribe_topic: (topicSocket, action) => {
    console.log(action);
  },
  unsubscribe_topic: (topicSocket, data) => {
    console.log(data);
  },
};
