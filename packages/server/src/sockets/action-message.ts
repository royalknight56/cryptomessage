import { TopicEnum } from "../types/topic-enum";
import { SocketMap } from "../types/socket-map";
import { ActionPayload } from "@idleworld/types";

export const MessageSocketMap: SocketMap = {
  action_message_send: (
    topicSocket,
    action: ActionPayload<{ message: string; to: string }>,
  ) => {
    topicSocket.actionRes(action, {
      id: 1,
      message: action.payload.message,
    });
    topicSocket.emitTo(TopicEnum.MESSAGE, [action.payload.to], {
      id: 1,
      from: topicSocket.user?.userId as string,
      to: action.payload.to,
      message: action.payload.message,
    });
  },

  action_message_add_user: (
    topicSocket,
    action: ActionPayload<{ uid: string }>,
  ) => {
    topicSocket.emitTo(TopicEnum.ADD_USER, [action.payload.uid], {
      id: 1,
      from: topicSocket.user?.userId as string,
      to: action.payload.uid,
      message: "add user",
    });
  },

  action_message_send_public_key: (
    topicSocket,
    action: ActionPayload<{ publicKey: string; uid: string }>,
  ) => {
    topicSocket.emitTo(TopicEnum.PUBLIC_KEY, [action.payload.uid], {
      publicKey: action.payload.publicKey,
      from: topicSocket.user?.userId as string,
      to: action.payload.uid,
    });
  },

  action_message_send_to_user: (
    topicSocket,
    action: ActionPayload<{ message: string; to: string }>,
  ) => {
    topicSocket.actionRes(action, {
      id: 1,
      message: action.payload.message,
    });
    topicSocket.emitTo(TopicEnum.MESSAGE, [action.payload.to], {
      id: 1,
      from: topicSocket.user?.userId as string,
      to: action.payload.to,
      message: action.payload.message,
    });
  },
  // action_group_message_send: (
  //   topicSocket,
  //   action: ActionPayload<{ message: string }>,
  // ) => {
  //   const group = group.find((g) =>
  //     g.members.includes(topicSocket.user?.userId as string),
  //   );
  //   topicSocket.actionRes(action, {
  //     id: 1,
  //     message: action.payload.message,
  //   });
  // },
};
