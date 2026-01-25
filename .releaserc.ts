/* eslint-disable regexp/no-useless-quantifier */
/* eslint-disable regexp/no-super-linear-backtracking */
export default {
  // 这里改成你自己的仓库地址
  repositoryUrl: 'https://github.com/782042369/led-torrent.git',
  branches: ['main'], // 指定在哪个分支下要执行发布操作
  plugins: [
    // 1. 解析 commit 信息，配置支持 emoji 前缀
    [
      '@semantic-release/commit-analyzer',
      {
        // 配置解析规则，支持带 emoji 的 commit message
        parserOpts: {
          // 匹配格式：emoji + type(scope): subject
          // 使用 [\s\S]*? 匹配 emoji（任意非贪婪字符），而不是依赖 \p{Emoji}
          headerPattern: /^([\s\S]*?)\s*(\w+)(?:\(([^)]*)\))?:\s*(.*)$/,
          headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', '不兼容变更'],
          revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
          revertCorrespondence: ['header', 'hash'],
        },
        // 定义哪些类型触发 release
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'chore', release: 'patch' },
        ],
      },
    ],
    // 2. 生成发布信息
    [
      '@semantic-release/release-notes-generator',
      {
        // 同样配置解析规则
        parserOpts: {
          headerPattern: /^([\s\S]*?)\s*(\w+)(?:\(([^)]*)\))?:\s*(.*)$/,
          headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', '不兼容变更'],
        },
        // 配置提交类型映射
        types: [
          { type: 'feat', section: '✨ 新功能' },
          { type: 'fix', section: '🐛 Bug 修复' },
          { type: 'perf', section: '⚡ 性能优化' },
          { type: 'refactor', section: '♻️ 代码重构' },
          { type: 'chore', section: '🚧 构建/工具' },
          { type: 'style', section: '💄 代码风格', hidden: true },
        ],
      },
    ],
    // 3. 把发布日志写入该文件
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // 5. 将变更发布到 GitHub Release
    '@semantic-release/github',
    // 6. 前面说到日志记录和版本号是新增修改的，需要 push 回 Git
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
      },
    ],
  ],
}
