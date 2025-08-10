# 客户端代码结构说明

## 📁 文件结构

```
src/
├── components/                 # Vue组件
│   ├── GameMain.vue           # 主游戏组件
│   ├── GameHeader.vue         # 游戏顶部信息栏
│   ├── BuildingsPanel.vue     # 建筑面板
│   ├── TechnologyPanel.vue    # 科技面板
│   ├── PlanetsPanel.vue       # 星球面板
│   ├── OfflineRewardsModal.vue # 离线收益弹窗
│   ├── LoginForm.vue          # 登录表单
│   ├── RegisterForm.vue       # 注册表单
│   └── AdminPanel.vue         # 管理面板
├── composables/               # 组合式函数
│   ├── useAuth.ts            # 认证逻辑
│   └── useGame.ts            # 游戏逻辑
├── utils/                     # 工具函数
│   └── gameUtils.ts          # 游戏相关工具函数
└── App.vue                   # 根组件(简化版)
```

## 🔧 重构说明

### 原来的问题
- `App.vue` 文件过大（1169行）
- 所有逻辑混合在一个文件中
- 难以维护和扩展

### 重构后的优势

#### 1. **模块化组件**
每个面板都是独立的组件，职责单一：
- `GameHeader.vue` - 顶部信息显示
- `BuildingsPanel.vue` - 建筑管理
- `TechnologyPanel.vue` - 科技研发
- `PlanetsPanel.vue` - 星球管理

#### 2. **组合式函数**
- `useAuth.ts` - 用户认证状态管理
- `useGame.ts` - 游戏状态和业务逻辑

#### 3. **工具函数**
- `gameUtils.ts` - 通用的游戏工具函数（图标、名称、格式化等）

#### 4. **简化的App.vue**
现在只有约100行，专注于：
- 应用状态管理（auth/game）
- 组件间通信
- 路由逻辑

## 🚀 使用方式

### 组件通信
```vue
<!-- 父组件向子组件传递数据 -->
<BuildingsPanel
  :player="gameState.player"
  :game-config="gameState.gameConfig"
  @upgrade-building="upgradeBuilding"
/>

<!-- 子组件向父组件发送事件 -->
$emit('upgrade-building', buildingId)
```

### 状态管理
```typescript
// 使用游戏组合式函数
const {
  gameState,
  upgradeBuilding,
  canUpgradeBuilding
} = useGame()
```

### 工具函数
```typescript
import { getResourceIcon, formatCost } from '../utils/gameUtils'

// 使用工具函数
const icon = getResourceIcon('ore') // ⛏️
const cost = formatCost({ ore: 100, energy: 50 }) // ⛏️100 ⚡50
```

## 📋 维护指南

### 添加新功能
1. **新面板** - 在 `components/` 目录创建新组件
2. **新逻辑** - 在 `composables/` 中扩展或新增组合式函数
3. **新工具** - 在 `utils/` 中添加通用函数

### 修改现有功能
1. **界面修改** - 直接修改对应组件
2. **逻辑修改** - 修改对应的组合式函数
3. **样式修改** - 每个组件都有独立的scoped样式

### 类型安全
- 所有组件都使用TypeScript
- Props和Emits都有明确的类型定义
- 组合式函数提供类型推导

## 🎯 最佳实践

1. **单一职责** - 每个组件只负责一个功能
2. **props down, events up** - 数据向下传递，事件向上传递
3. **组合式函数** - 复用逻辑使用composables
4. **工具函数** - 纯函数放在utils中
5. **类型安全** - 充分利用TypeScript的类型检查 