# LED Torrent API 接口文档

> 为 PT 站点提供一键领种/弃种功能的完整 API 文档

---

## 📖 目录

- [HTTP 请求 API](#http-请求-api)
- [PT 站点 API](#pt-站点-api)

---

## HTTP 请求 API

### `request<T>(url, options?): Promise<T>`

统一的 HTTP 请求函数，用于发送 GET/POST 请求。

#### 参数

```typescript
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  params?: Record<string, any>
}
```

#### 返回

`Promise<T>` - 响应数据

#### 特性

- 支持 GET/POST 请求
- 超时控制（默认 100 秒）
- 自动处理查询参数
- 特殊响应处理（文本/JSON）

---

## PT 站点 API

### 通用站点 API

#### `getNPHPLedTorrent(id, type)`

执行认领或弃种操作。

**参数**：

- `id: string` - 种子 ID
- `type: 'removeClaim' | 'addClaim'` - 操作类型

**返回**：`Promise<PTAPI.LedTorrentDetails>`

```typescript
interface LedTorrentDetails {
  msg: string | 'OK' // 操作结果消息
  ret: -1 | 0 // 返回码
}
```

---

#### `getNPHPUsertorrentlistajax(params)`

获取用户做种列表。

**参数**：

```typescript
{
  page: number
  userid: string
  type: 'seeding'
}
```

**返回**：`Promise<string>` (HTML 文本)

---

#### `getNPHPUsertorrentHistory(params)`

获取用户历史领种记录。

**参数**：

```typescript
{
  page: number
  uid: string
}
```

**返回**：`Promise<string>` (HTML 文本)

---

### 猫站 API

#### `getNPHPPterUsertorrentlistajax(params)`

获取猫站用户做种列表。

**参数**：

```typescript
{
  page: number
  userid: string
  type: 'seeding'
}
```

**返回**：`Promise<string>` (HTML 文本)

---

#### `getNPHPPterLedTorrent(id)`

猫站认领种子。

**参数**：

- `id: string` - 种子 ID

**返回**：`Promise<boolean>` (成功/失败)

---

### 春天站 API

#### `getSSDLedTorrent(id)`

春天站认领种子。

**参数**：

- `id: string` - 种子 ID

**返回**：`Promise<PTAPI.LedTorrentDetails>`

---

### 学校站 API

#### `getSchLedTorrent(id)`

学校站认领种子。

**参数**：

- `id: string` - 种子 ID

**返回**：`Promise<PTAPI.LedTorrentDetails>`

---

## 🔧 类型定义

### `PTAPI.LedTorrentDetails`

```typescript
namespace PTAPI {
  interface LedTorrentDetails {
    msg: string | 'OK'
    ret: -1 | 0
  }
}
```

### `TorrentDataIdsType`

```typescript
type TorrentDataIdsType = string[]
```

---

**最后更新时间**：2026-01-14

**维护者**：yanghongxuan (waibuzheng)
