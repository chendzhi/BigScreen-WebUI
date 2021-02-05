<template>
  <div ref="mobileTable" class="inte-mobile-table">
    <div class="thead">
      <div class="tr">
        <div class="th">
          <div class="th-con">微信名称</div>
        </div>
        <div class="th">
          <div class="th-con">标题</div>
        </div>
        <div class="th">
          <div class="th-con">点赞量</div>
        </div>
        <div class="th">
          <div class="th-con">发布时间</div>
        </div>
      </div>
    </div>
    <div class="tbody" style="height: 217px;">
      <div class="tr" v-for="item in data" :key="item.id">
        <div class="td">
          <el-tooltip
            placement="top"
            trigger="hover"
            :enterable="false"
            :content="item.name">
            <div class="td-con inte-elips">{{item.name}}</div>
          </el-tooltip>
        </div>
        <div class="td">
          <el-tooltip
            placement="top"
            trigger="hover"
            :enterable="false"
            :content="item.article_title">
            <div class="td-con inte-elips">{{item.article_title}}</div>
          </el-tooltip>
        </div>
        <div class="td">
          <div class="td-con">{{item.amount | thousandth}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.release_time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-list_like-rank',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
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
  .thead .tr {
    .th:nth-child(1) {
      width: 140px;
      flex-basis: 140px;
      text-align: left;
    }
    .th:nth-child(2) {
      width: 180px;
      flex-basis: 180px;
      text-align: center;
    }
    .th:nth-child(3) {
      width: 140px;
      flex-basis: 140px;
      text-align: center;
    }
    .th:nth-child(4) {
      width: 190px;
      flex-basis: 190px;
      text-align: center;
    }
  }
  .tbody .tr {
    .td:nth-child(1) {
      width: 140px;
      flex-basis: 140px;
      text-align: left;
    }
    .td:nth-child(2) {
      width: 180px;
      flex-basis: 180px;
      text-align: left;
    }
    .td:nth-child(3) {
      width: 140px;
      flex-basis: 140px;
      text-align: right;
    }
    .td:nth-child(4) {
      width: 180px;
      flex-basis: 180px;
      text-align: right;
    }
  }
}
</style>
