<template>
  <div ref="mobileTable" class="inte-mobile-table">
    <div class="thead">
      <div class="tr">
        <div class="th">
          <div class="th-con">名称</div>
        </div>
        <div class="th">
          <div class="th-con">网站传播数量</div>
        </div>
        <div class="th">
          <div class="th-con">新媒体传播数量</div>
        </div>
        <div class="th">
          <div class="th-con">传播率</div>
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="item in data" :key="item.id">
        <div class="td">
          <div class="td-con">{{item.name}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.website_number}}/{{item.website_total}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.media_number}}/{{item.media_total}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.ex_ratio}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        data.forEach(item => {
          let ratio = (item.website_number + item.media_number) / (item.website_total + item.media_total)
          item.ex_ratio = `${(ratio*100).toFixed(1)}%`
        })
      }
    }
  },
  methods: {
    onBack() {
      this.$emit('on-back')
    },
    mobileTableInit() {
      let tbody = this.$refs.mobileTable.querySelector('.tbody')
      let thead = this.$refs.mobileTable.querySelector('.thead')
      tbody.onscroll = function(e) {
        thead.scrollLeft = e.target.scrollLeft
      }
      this.$once('hook:beforeDestroy', () => {
        tbody.onscroll = null
      })
    }
  },
  mounted() {
    this.mobileTableInit()
  }
}
</script>

<style lang="scss" scoped>
.inte-mobile-table {
  .thead {
    position: sticky;
    top: -3px;
  }
  .thead .tr {
    .th:nth-child(1) {
      width: 160px;
      flex-basis: 160px;
      text-align: left;
    }
    .th:nth-child(2) {
      width: 120px;
      flex-basis: 120px;
      text-align: center;
    }
    .th:nth-child(3) {
      width: 120px;
      flex-basis: 120px;
      text-align: center;
    }
    .th:nth-child(4) {
      width: 120px;
      flex-basis: 120px;
      text-align: center;
    }
  }
  .tbody .tr {
    .td:nth-child(1) {
      width: 160px;
      flex-basis: 160px;
      text-align: left;
    }
    .td:nth-child(2) {
      width: 120px;
      flex-basis: 120px;
      text-align: right;
    }
    .td:nth-child(3) {
      width: 120px;
      flex-basis: 120px;
      text-align: right;
    }
    .td:nth-child(4) {
      width: 120px;
      flex-basis: 120px;
      text-align: right;
    }
  }
}
</style>
