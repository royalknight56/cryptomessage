export enum BattleStatus {
  PENDING = "pending",
  STARTED = "started",
  ENDED = "ended",
  FAILED = "failed",
}

export enum BattleType {
  PVP = "pvp",
  PVE = "pve",
}

export enum BattleResult {
  WIN = "win",
  LOSE = "lose",
  DRAW = "draw",
}

export interface Battle {
  id: string;
  type: BattleType;
  fromUserId: string;
  toUserId: string;
  status: BattleStatus;
  startTime: number;
  updateTime: number;
  endTime: number;
  rounds: BattleRound[];
  result: BattleResult;
}

export interface BattleRound {
  fromUserId: string;
  toUserId: string;
  skill: string;
  damage: number;
}
