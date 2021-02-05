<template>
  <div>
    <div class="module-wrap">
      <daily-monitor is-mobile></daily-monitor>
    </div>
    <div class="module-wrap">
      <frequency-error-word is-mobile></frequency-error-word>
    </div>
    <div class="module-wrap" style="height: auto;">
      <real-time-question is-mobile></real-time-question>
    </div>
  </div>
</template>

<script>
import DailyMonitor from '../../components/module/daily-monitor' // 日常监测
import FrequencyErrorWord from '../../components/module/frequency-error-word' // 高频错词
import RealTimeQuestion from '../../components/module/real-time-question' // 实时问题
export default {
  name: 'Inte_Mobile_QuestionAnalysis',
  components: {
    DailyMonitor,
    FrequencyErrorWord,
    RealTimeQuestion
  }
}
</script>

<style lang="scss" scoped>
.module-wrap {
  margin-bottom: 8px;
  height: 235px;
}
</style>
