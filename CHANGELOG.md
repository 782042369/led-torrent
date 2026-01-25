## [1.8.1](https://github.com/782042369/led-torrent/compare/v1.8.0...v1.8.1) (2026-01-25)

## [1.1.1](https://github.com/782042369/led-torrent/compare/v1.1.0...v1.1.1) (2026-01-25)


### Bug Fixes

* **release:** 移除 Unicode 属性依赖使用通用正则 ([0c3d2d7](https://github.com/782042369/led-torrent/commit/0c3d2d7c019160172ad7a158ba1c5161f66d213a))

# [1.1.0](https://github.com/782042369/led-torrent/compare/v1.0.0...v1.1.0) (2026-01-25)


### Bug Fixes

* **release:** 修正正则表达式以正确匹配 emoji commit 格式 ([0920f93](https://github.com/782042369/led-torrent/commit/0920f9315405d4ddb3bd073fa124e9d8174208fd))
* **release:** 配置 semantic-release 支持 emoji commit 格式 ([d60f067](https://github.com/782042369/led-torrent/commit/d60f0675c979ed2b55de89b3adab2de804609da4))


### Features

* **adapters:** 实现站点适配器层 ([81c278c](https://github.com/782042369/led-torrent/commit/81c278cf3584e103f2a504d0089539d0c9b7ae4e))
* **concurrency:** 实现站点领取并发控制系统 ([c837b18](https://github.com/782042369/led-torrent/commit/c837b1862e158b4665870299db7e4abc73d87043))
* **main:** 实现弃种功能完整逻辑 ([55957a8](https://github.com/782042369/led-torrent/commit/55957a822d51de24908bef4da3acf3f3ed3b68ce))
* **pter:** 支持 userdetails.php URL 并修复403错误 ([8e10736](https://github.com/782042369/led-torrent/commit/8e10736be52f9666864e63d5fabbcef33e6592b0))
* **services:** 实现业务服务层 ([e4f7547](https://github.com/782042369/led-torrent/commit/e4f75479c1402b6c86f753698e9a57ff1a8f4fea))
* **types:** 重构并增强类型系统 ([efd16b4](https://github.com/782042369/led-torrent/commit/efd16b4ed59f8bb765ea66f4dd1307c96a807142))

# 1.0.0 (2026-01-24)


### Features

* 0.6升级 优化前端代码逻辑。 ([7f4de40](https://github.com/782042369/led-torrent/commit/7f4de4008a0d6f024aad30849638b330c21a68fd))
* 0.8 增加一键弃种操作逻辑。 ([d595824](https://github.com/782042369/led-torrent/commit/d595824912c75f6bc2f8d6a0c4f4c7057f9a3bfb))
* 1.3 支持春天领种。 ([2de1081](https://github.com/782042369/led-torrent/commit/2de108150c7f18898d95fa6a715c3e923fd3821e))
* getusertorrentlistajax 相关接口增加。 ([78b25dc](https://github.com/782042369/led-torrent/commit/78b25dce6600884f92d28680b1ca662f594e42bd))
* **userscript:** 升级版本至1.7并优化请求处理 ([554ca9e](https://github.com/782042369/led-torrent/commit/554ca9e81199fbcaca9b38c823fed5cb36655b62))
* **utils:** 添加type参数支持并重构API请求 ([3c1139e](https://github.com/782042369/led-torrent/commit/3c1139e0fb665e915d70d83d31015908952ec70b))
* 一键领种。 ([475ac3f](https://github.com/782042369/led-torrent/commit/475ac3fad385ddc7d81648a504a89f0037dfe634))
* 优化代码。 ([8c6b030](https://github.com/782042369/led-torrent/commit/8c6b030bb21fada45b0b1697e896ddc5e34ce37d))
* 修改 logo ([8d994c8](https://github.com/782042369/led-torrent/commit/8d994c879c3efd895d40390d6668e5c62b17b582))
* 修改描述。 ([41f2894](https://github.com/782042369/led-torrent/commit/41f2894685e7c81006ee5f774765d4ef6efcacfd))
* 修改文案。 ([0558fb3](https://github.com/782042369/led-torrent/commit/0558fb3cb826768617ec30af69d27279159c7c50))
* 修改目录结构和icon ([713bdc6](https://github.com/782042369/led-torrent/commit/713bdc62b437f0c6f63c49d09443d19c00744333))
* 修改脚本构件cli。 ([f2ef3ae](https://github.com/782042369/led-torrent/commit/f2ef3ae7af0b56812044a3d2583f41b193e89e8c))
* 修改领取种子代码逻辑，支持杏坛。 ([013ccf3](https://github.com/782042369/led-torrent/commit/013ccf35a04ff2494b26a987bd3d87e8d5a86062))
* 兼容网站冗余种子导致的领取显示异常。 ([a4eb006](https://github.com/782042369/led-torrent/commit/a4eb006fb2dfc91b33d479ea585dbc669ea86e2a))
* 增加繁体字支持。 ([54bb79f](https://github.com/782042369/led-torrent/commit/54bb79f2288ca9256c8cdf9995edc96cd8ad1dda))
* 增加领取提示。 ([b2652a5](https://github.com/782042369/led-torrent/commit/b2652a5f402c51e669d247f57b9517fd5e91072f))
* 替换插件图片地址 ([4d0e125](https://github.com/782042369/led-torrent/commit/4d0e12528cb02d75fc0688826c9b64f6d0843183))
* 构建 0.5 ([64f7243](https://github.com/782042369/led-torrent/commit/64f7243885fda739ca41b07ef809abf77158939a))
* 构建 1.0 ，支持猫站认领。 ([a244612](https://github.com/782042369/led-torrent/commit/a244612293f337824055c18c673bc79924a5838b))
* 添加详细的JSDoc注释和功能描述 ([885708d](https://github.com/782042369/led-torrent/commit/885708d019e7ba93d078ee27c1fea3d8d032253f))
* 猫站支持一键认领。 ([6df5321](https://github.com/782042369/led-torrent/commit/6df5321b731f700d84960ca24c5a0dfb3280b73c))
* 移除多余打印代码。 ([1efeac8](https://github.com/782042369/led-torrent/commit/1efeac8f20f8462fdb73132cdc21ba20bf5ca3b4))
* 美化按钮样式。 ([8a81029](https://github.com/782042369/led-torrent/commit/8a8102911cf847e610ba4b10431a257fa1b8a46a))
* 逻辑抽取优化。 ([5acd952](https://github.com/782042369/led-torrent/commit/5acd952a999e5cb98bd1999aafb0a60b6be9b3bc))
