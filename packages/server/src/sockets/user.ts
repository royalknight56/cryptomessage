import { SocketMap } from "../types/socket-map";
import { TopicEnum } from "../types/topic-enum";

export const UserSocketMap: SocketMap = {
  join_game: (topicSocket, action) => {
    try {
      if (!topicSocket.user) {
        topicSocket.actionRes(action, {
          message: "用户ID缺失，请先登录",
        });
        return;
      }
      topicSocket.actionRes(action, {
        message: "加入游戏成功",
        user: topicSocket.user,
      });
    } catch (error) {
      console.error("加入游戏错误:", error);
      topicSocket.actionRes(action, {
        message: "服务器错误",
      });
    }
  },
  action_get_online_user: async (topicSocket, action) => {
    topicSocket.emit(TopicEnum.ONLINE_USER, {
      onlineUsers: await topicSocket.userService.getOnlineUsers(),
    });
  },
};
