import { ActionPayload } from "@idleworld/types";
import { SocketMap } from "../types/socket-map";
import { TopicEnum } from "../types/topic-enum";
const group = [
  {
    id: "1",
    name: "group1",
    description: "group1",
    members: [] as string[],
  },
];
export const ActionGroupMap: SocketMap = {
  action_group_join: (
    topicSocket,
    action: ActionPayload<{
      groupId: string;
    }>,
  ) => {
    topicSocket.actionRes(action, {
      group: group,
    });
    // 先判断是否已经加入了
    const hasJoined = group.some((g) =>
      g.members.includes(topicSocket.user?.userId as string),
    );
    // 如果已经加入了，则直接返回
    if (hasJoined) {
      return;
    }

    const findUnFinishedGroup = group.find((g) => g.members.length < 3);
    if (findUnFinishedGroup) {
      findUnFinishedGroup.members.push(topicSocket.user?.userId as string);
    } else {
      group.push({
        id: "2",
        name: "group2",
        description: "group2",
        members: [topicSocket.user?.userId as string],
      });
    }
    topicSocket.emitTo(
      TopicEnum.GROUP,
      Array.from(
        new Set([
          ...(findUnFinishedGroup?.members || []),
          topicSocket.user?.userId as string,
        ]),
      ),
      {
        group: group,
      },
    );
  },
  action_group_leave: (
    topicSocket,
    action: ActionPayload<{
      groupId: string;
    }>,
  ) => {
    topicSocket.actionRes(action, {
      group: group,
    });
    const findGroup = group.find((g) =>
      g.members.includes(topicSocket.user?.userId as string),
    );
    if (findGroup) {
      findGroup.members = findGroup.members.filter(
        (m) => m !== (topicSocket.user?.userId as string),
      );
    }
    topicSocket.emitTo(
      TopicEnum.GROUP,
      Array.from(new Set([...(findGroup?.members || [])])),
      {
        group: group,
      },
    );
    topicSocket.emitTo(TopicEnum.GROUP, [topicSocket.user?.userId as string], {
      group: [],
    });
  },
};
