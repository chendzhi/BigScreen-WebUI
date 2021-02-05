<template>
  <div>
    <div class="module-wrap">
      <basic-situation is-mobile></basic-situation>
    </div>
    <div class="module-wrap">
      <resource-distribute is-mobile></resource-distribute>
    </div>
    <div class="module-wrap">
      <lately-update is-mobile></lately-update>
    </div>
  </div>
</template>

<script>
import BasicSituation from '../../components/module/basic-situation' // 基本概况
import ResourceDistribute from '../../components/module/resource-distribute' // 资源分布
import LatelyUpdate from '../../components/module/lately-update' // 近日更新
export default {
  name: 'Inte_Mobile_Base',
  components: {
    BasicSituation,
    ResourceDistribute,
    LatelyUpdate
  }
}
</script>

<style lang="scss" scoped>
.module-wrap {
  margin-bottom: 8px;
  height: 235px;
}
</style>
