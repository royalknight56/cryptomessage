import { ActionPayload } from "@idleworld/types";
import type { TopicSocket } from "../lib/topic";

export type SocketMap = Record<
  string,
  (topicSocket: TopicSocket, data: ActionPayload<never>) => void
>;
