[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **types**

---

# types 模块

## 模块职责

`types/` 模块负责 LED Torrent 项目的所有 TypeScript 类型定义。该模块使用 TypeScript 的 `namespace` 和 `type` 功能，为 API 响应、数据结构提供强类型支持，提升代码的可维护性和开发体验。

---

## 目录结构

```
types/
├── api.d.ts              # API 相关类型定义
└── index.d.ts            # 通用类型定义
```

---

## 类型定义详解

### 1. 通用类型 (`index.d.ts`)

#### TorrentDataIdsType

**定义**：

```typescript
export type TorrentDataIdsType = string[]
```

**用途**：

- 表示种子 ID 的数组类型
- 用于批量领种/弃种操作
- 作为函数参数传递种子列表

**使用场景**：

```typescript
// 加载可认领的种子
const allData: TorrentDataIdsType = []

// 传递给领种函数
await handleLedTorrent(allData, button, msglist, 'addClaim')
```

---

### 2. API 类型 (`api.d.ts`)

#### PTAPI 命名空间

**定义**：

```typescript
namespace PTAPI {
  interface TorrentList {
    data?: {
      id: string
    }[]
    meta?: {
      to: number
      total: number
    }
  }

  interface LedTorrentDetails {
    msg: string | 'OK'
    ret: -1 | 0
  }
}
```

#### LedTorrentDetails 接口

**用途**：领种/弃种操作的 API 响应类型

**字段说明**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `msg` | `string \| 'OK'` | 操作结果消息 |
| `ret` | `-1 \| 0` | 返回码（0 成功，-1 失败） |

**使用示例**：

```typescript
const result = await getNPHPLedTorrent(id, 'addClaim')
if (result.ret === 0) {
  console.log(result.msg) // 'OK'
}
else {
  console.error(result.msg) // 错误信息
}
```

#### TorrentList 接口

**用途**：种子列表的 API 响应类型（预留）

**字段说明**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Array<{ id: string }>` | 种子数据列表 |
| `meta` | `{ to: number, total: number }` | 分页元信息 |

**注意**：该类型当前未被使用，为未来扩展预留。

---

## 对外接口

### 导出类型

```typescript
// 从 index.d.ts 导出
export type TorrentDataIdsType

// 从 api.d.ts 导出（通过 namespace）
namespace PTAPI {
  interface TorrentList
  interface LedTorrentDetails
}
```

---

## 关键依赖与配置

### 依赖关系

```
types/
├── api.d.ts          # 独立，无依赖
└── index.d.ts        # 独立，无依赖
```

### tsconfig.json 配置

**路径别名**：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**使用方式**：

```typescript
// 在其他文件中导入
import type { TorrentDataIdsType } from '@/types'
import type { PTAPI } from '@/types/api'
```

---

## 类型使用示例

### 示例 1：函数参数类型标注

```typescript
import type { TorrentDataIdsType } from '@/types'

async function handleLedTorrent(
  arr: TorrentDataIdsType,
  button: HTMLButtonElement,
  json: { [key in string]: number },
  type: 'removeClaim' | 'addClaim'
) {
  // arr 的类型为 string[]
  // 可以安全地使用数组方法
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]) // 类型为 string
  }
}
```

### 示例 2：API 响应类型标注

```typescript
import type { PTAPI } from '@/types/api'

async function getNPHPLedTorrent(
  id: string,
  type: 'removeClaim' | 'addClaim'
): Promise<PTAPI.LedTorrentDetails> {
  // ... 实现代码
  return { msg: 'OK', ret: 0 }
}

// 使用时获得类型提示
const result: PTAPI.LedTorrentDetails = await getNPHPLedTorrent('123', 'addClaim')
console.log(result.msg) // IDE 知道这是 string 类型
```

### 示例 3：类型推断

```typescript
import type { TorrentDataIdsType } from '@/types'

const allData: TorrentDataIdsType = []
const ledlist: string[] = []

// 类型推断确保类型安全
allData.push('123') // ✓ 正确
allData.push(456) // ✗ TypeScript 错误
```

---

## 测试与质量

### 当前状态

- **无专门的类型测试**
- 依赖 TypeScript 编译时检查
- 使用 `strict: true` 严格模式

### 类型检查

运行以下命令进行类型检查：

```bash
npx tsc --noEmit
```

### 建议

1. **增强类型定义**
   - 为更多函数添加返回类型
   - 使用枚举替代魔法字符串
   - 添加更严格的类型约束

2. **类型文档**
   - 使用 JSDoc 为复杂类型添加注释
   - 创建类型使用示例

---

## 常见问题 (FAQ)

### Q1: 为什么使用 namespace 而不是 export interface？

**答案**：

- `namespace PTAPI` 将相关类型组织在一起
- 避免全局命名空间污染
- 与现有代码结构保持一致
- 可以通过 `PTAPI.LedTorrentDetails` 清晰地表达类型归属

### Q2: 如何添加新的 API 类型？

**步骤**：

1. 在 `types/api.d.ts` 中添加类型定义：

   ```typescript
   namespace PTAPI {
     interface NewApiResponse {
       data: any
       status: number
     }
   }
   ```

2. 在 `types/api.d.ts` 顶部添加 JSDoc 注释：

   ```typescript
   /**
    * 新 API 响应类型
    */
   interface NewApiResponse { ... }
   ```

3. 在使用处导入：

   ```typescript
   import type { PTAPI } from '@/types/api'

   async function myApi(): Promise<PTAPI.NewApiResponse> { ... }
   ```

### Q3: TorrentDataIdsType 为什么不直接使用 string[]？

**答案**：

- 提供语义化类型名称
- 便于未来扩展（如添加约束或方法）
- 提高代码可读性
- 统一项目中的类型使用

**对比**：

```typescript
// 不推荐
async function load(ids: string[]) { ... }

// 推荐
async function load(ids: TorrentDataIdsType) { ... }
```

---

## 相关文件清单

### 类型定义文件

- `types/api.d.ts` - 25 行
- `types/index.d.ts` - 3 行

**总计**：28 行代码

---

## 最佳实践

### 1. 类型导入

**推荐**：

```typescript
// 使用 type 关键字导入
import type { TorrentDataIdsType } from '@/types'
```

**不推荐**：

```typescript
// 混合值导入
import { TorrentDataIdsType } from '@/types'
```

### 2. 类型导出

**推荐**：

```typescript
// 在 types/index.d.ts 中集中导出
export type { TorrentDataIdsType }
```

### 3. 类型注释

**推荐**：

```typescript
/**
 * 领种操作响应
 * @property msg - 操作结果消息
 * @property ret - 返回码（0 成功，-1 失败）
 */
interface LedTorrentDetails {
  msg: string | 'OK'
  ret: -1 | 0
}
```

---

## 变更记录

### 2026-01-14

- 初始化 types 模块文档
- 完成类型定义详解
- 补充使用示例和最佳实践
