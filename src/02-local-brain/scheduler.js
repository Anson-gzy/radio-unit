export function getSchedulerSnapshot() {
  return {
    enabled: false,
    jobs: [],
    note: '调度层结构已预留，当前版本还没有接入定时任务和状态数据库。',
  };
}
