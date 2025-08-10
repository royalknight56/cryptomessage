import { TopicEnum } from "../types/topic-enum";
import { SocketMap } from "../types/socket-map";
import { ActionPayload } from "@idleworld/types";

export const MessageSocketMap: SocketMap = {
  action_message_send: (
    topicSocket,
    action: ActionPayload<{ message: string }>,
  ) => {
    topicSocket.actionRes(action, {
      id: 1,
      message: action.payload.message,
    });
    topicSocket.emitGlobal(TopicEnum.MESSAGE, {
      id: 1,
      message: action.payload.message,
    });
  },

  action_message_add_user: (
    topicSocket,
    action: ActionPayload<{ uids: string[] }>,
  ) => {
    topicSocket.emitTo(TopicEnum.MESSAGE, action.payload.uids, {
      id: 1,
      message: "add user",
    });
  },

  action_message_send_public_key: (
    topicSocket,
    action: ActionPayload<{ publicKey: string; uids: string[] }>,
  ) => {
    topicSocket.emitTo(TopicEnum.MESSAGE, action.payload.uids, {
      id: 1,
      publicKey: action.payload.publicKey,
      message: "send public key",
    });
  },

  action_message_send_to_user: (
    topicSocket,
    action: ActionPayload<{ message: string; uids: string[] }>,
  ) => {
    topicSocket.emitTo(TopicEnum.MESSAGE, action.payload.uids, {
      id: 1,
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
