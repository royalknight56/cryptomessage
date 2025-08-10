# @idlegalaxy/types

IdleGalaxy 游戏的共享类型定义包。

## 概述

这个包包含了客户端和服务器端共享的 TypeScript 类型定义，确保整个应用的类型一致性。

## 包含的类型

### 游戏类型 (`game.ts`)
- 资源管理相关类型
- 舰船和组件类型
- 战斗系统类型
- 玩家和游戏配置类型
- 物品和背包系统类型

### 认证类型 (`auth.ts`)
- 用户认证相关类型
- JWT 和会话管理类型

## 使用方法

### 安装依赖
```bash
# 在 client 或 server 包中
pnpm add @idlegalaxy/types
```

### 导入类型
```typescript
// 导入游戏类型
import { Player, Ship, Resources, BattleState } from '@idlegalaxy/types';

// 导入认证类型
import { User, AuthResponse, LoginRequest } from '@idlegalaxy/types';
```

## 开发

### 构建
```bash
pnpm build
```

### 监听模式
```bash
pnpm dev
```

## 类型一致性保证

### 1. 枚举 vs 联合类型
我们统一使用 `enum` 而不是联合类型，这样可以：
- 提供更好的 IDE 支持
- 避免拼写错误
- 便于重构

### 2. 可选属性处理
对于客户端和服务器端可能不同的属性，我们使用可选属性 (`?`) 来处理。

### 3. 版本管理
所有类型变更都应该：
- 保持向后兼容
- 在重大变更时更新版本号
- 在 CHANGELOG 中记录变更

## 迁移指南

如果从本地类型定义迁移到共享类型包：

1. 运行迁移脚本：
```bash
node scripts/migrate-types.js
```

2. 安装依赖：
```bash
pnpm install
```

3. 构建类型包：
```bash
pnpm -C packages/types build
```

4. 删除旧的类型文件
5. 测试应用 