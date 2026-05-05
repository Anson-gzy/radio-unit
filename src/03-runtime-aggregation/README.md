# Runtime Aggregation

这一层对应图里的 `context window` 组装盒子。当前项目已经有对应落点：

1. 系统提示词：`prompts/dj-persona.md`
2. 用户语料：`../01-external-context/user/*`
3. 环境注入：`/api/health` 返回的 provider 状态
4. 已检索记忆：`state/` 目录预留
5. 用户输入 / 工具结果：`/api/radio-turn`、Apple Music 查询、TTS 结果
6. 执行轨迹：服务端请求日志和后续调度预留
