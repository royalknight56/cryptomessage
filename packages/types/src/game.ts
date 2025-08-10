export interface GameVersion {
  id: string;
  name: string;
  description: string;
  version: string;
  billboard: string;
}

export type ItemType = "armor" | "consumable" | "material" | "other";

/** 物品原型 */
export interface ItemPrototype {
  id: string;
  name: string;
  description: string;
  maxCount: number;
  type: ItemType;
  icon: string;
  quality: number;
  level: number;
  rarity: number;
  armorPosition?: ArmorTypeEnum;
  properties: Record<string, number>;
}

/** 物品唯一id */
export type ItemUniqueId = string;

export interface BagItemUniqueProperty {
  count: number;
  properties: Record<string, number>;
  createdAt: number;
  uniqueId: ItemUniqueId;
  equipped?: boolean;
}

/** 背包物品 */
export type BagItem = ItemPrototype & BagItemUniqueProperty;

/** 背包物品位置 */
export type BagItemPosition = number;

/** 用户背包
 * 包含位置信息
 * 最大容量
 */
export interface UserBag {
  items: Record<BagItemPosition, BagItem | null>;
  maxCapacity: number;
}

/** 装备位置 */
export enum ArmorTypeEnum {
  WEAPON = "weapon",
  HELMET = "helmet",
  CHEST = "chest",
  LEGS = "legs",
  HANDS = "hands",
  FEET = "feet",
}
/** 用户装备 */
export type UserArmor = Record<ArmorTypeEnum, ItemUniqueId>;
