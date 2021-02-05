<template>
  <ul class="inte-mobile-nav">
    <li
      v-for="item in tabs"
      :key="item.key"
      :class="{'on': item.isOn}"
      @click="onTabChange(item)">
      {{item.name}}
    </li>
  </ul>
</template>

<script>
import settings from '@/settings'

export default {
  name: 'inte-mobile-nav',
  data() {
    return {
      tabs: [
        {key: 'base', name: '基本情况', path: `/${settings.product.integration.code}/mobile/base`, isOn: false},
        {key: 'transmit', name: '政声传递', path: `/${settings.product.integration.code}/mobile/transmit`, isOn: false},
        {key: 'question-analysis', name: '问题分析', path: `/${settings.product.integration.code}/mobile/question-analysis`, isOn: false},
        {key: 'hot-article', name: '热门文章', path: `/${settings.product.integration.code}/mobile/hot-article`, isOn: false}
      ]
    }
  },
  watch: {
    $route(to,from){
      this.tabStateUpdate()
    }
  },
  methods: {
    tabStateUpdate() {
      let curpath = this.$route.path
      this.tabs.forEach(item => {
        if (item.path === curpath) {
          item.isOn = true
        } else {
          item.isOn = false
        }
      })
    },
    onTabChange(tab) {
      if (tab.path === this.$route.path) {return}
      this.$router.push(tab.path)
    }
  },
  created() {
    this.tabStateUpdate()
  }
}
</script>

<style lang="scss" scoped>
.inte-mobile-nav {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  overflow: auto;
  li {
    flex: 0 0 auto;
    color: #bac9e9;
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background-color: rgba(54,151,255,.4);
    border-radius: 15px;
    &.on {
      color: #fff;
      font-weight: bold;
      background-color: rgba(54,151,255,1);
    }
  }
}
</style>
