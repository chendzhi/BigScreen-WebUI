<template>
  <div ref="mobileTable" class="inte-mobile-table">
    <div class="thead">
      <div class="tr">
        <div class="th">
          <div class="th-con">名称</div>
        </div>
        <div class="th">
          <div class="th-con">内容不更新账号数</div>
        </div>
        <div class="th">
          <div class="th-con">互动回应差个数</div>
        </div>
        <div class="th">
          <div class="th-con">错敏词个数</div>
        </div>
      </div>
    </div>
    <div class="tbody" style="height: 217px;">
      <div class="tr" v-for="item in data" :key="item.id">
        <div class="td">
          <div class="td-con">{{item.name}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.content_not_update_num | thousandth}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.interact_num | thousandth}}</div>
        </div>
        <div class="td">
          <div class="td-con">{{item.serious_word_num | thousandth}}</div>
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
      flex-basis: 120px;
      text-align: left;
    }
    .th:nth-child(2) {
      flex-basis: 140px;
      text-align: right;
    }
    .th:nth-child(3) {
      flex-basis: 140px;
      text-align: right;
    }
    .th:nth-child(4) {
      flex-basis: 150px;
      text-align: right;
    }
  }
  .tbody .tr {
    .td:nth-child(1) {
      flex-basis: 120px;
      text-align: left;
    }
    .td:nth-child(2) {
      flex-basis: 140px;
      text-align: right;
    }
    .td:nth-child(3) {
      flex-basis: 140px;
      text-align: right;
    }
    .td:nth-child(4) {
      flex-basis: 140px;
      text-align: right;
    }
  }
}
</style>
