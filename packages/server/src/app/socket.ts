import { Socket } from "socket.io";
import { verifyToken } from "../utils/auth";
import { GameSocketMap } from "../sockets/game";
import { UserSocketMap } from "../sockets/user";
import { TopicSocket } from "../lib/topic";
import { MessageSocketMap } from "../sockets/action-message";
import { ActionGroupMap } from "../sockets/action-group";

export function handleSocketConnection(socket: Socket) {
  console.log("连接:", socket.id);
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) {
    socket.emit("error", { message: "未提供token，请先登录" });
    socket.disconnect();
    return;
  }
  const cookiePairs = cookies.split(";").map((pair) => pair.trim());
  const tokenCookie = cookiePairs.find((pair) => pair.startsWith("token="));
  const token = tokenCookie?.split("=")[1];

  const topicSocket = new TopicSocket();
  if (!token) {
    socket.emit("error", { message: "未提供token，请先登录" });
    socket.disconnect();
    return;
  } else {
    const payload = verifyToken(token as string);
    if (!payload) {
      socket.emit("error", { message: "token无效，请重新登录" });
      socket.disconnect();
      return;
    }
    socket.data.user = payload;
    topicSocket.setUser(socket.data.user);
  }

  topicSocket.listenSocket(socket);

  topicSocket.listenAction(GameSocketMap);
  topicSocket.listenAction(UserSocketMap);
  topicSocket.listenAction(ActionGroupMap);
  topicSocket.listenAction(MessageSocketMap);
}
