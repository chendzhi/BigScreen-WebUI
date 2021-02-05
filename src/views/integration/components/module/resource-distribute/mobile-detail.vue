<template>
  <div class="inte-mobile-subpg">
    <div class="inte-mobile-subpg-head">
      <div class="inte-mobile-subpg-head_back" @click="onBack">
        <i class="el-icon-arrow-left"></i>
      </div>
      <h3 class="inte-mobile-subpg-head_title">资源分布详情</h3>
    </div>
    <div class="main-wrap">
      <div ref="mobileTable" class="inte-mobile-table">
        <div class="thead">
          <div class="tr">
            <div class="th">
              <div class="th-con">名称</div>
            </div>
            <div class="th">
              <div class="th-con">网站(万)</div>
            </div>
            <div class="th">
              <div class="th-con">新媒体(万)</div>
            </div>
            <div class="th">
              <div class="th-con">总量(万)</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="item in data" :key="item.id">
            <div class="td">
              <div class="td-con inte-elips">
              <el-tooltip
                placement="top"
                :content="item.name">
                <span>{{item.name}}</span>
              </el-tooltip>
              </div>
            </div>
            <div class="td">
              <div class="td-con">{{ item.website | unitNumFmt({isThousandth: true}) }}</div>
            </div>
            <div class="td">
              <div class="td-con">{{ item.amount-item.website | unitNumFmt({isThousandth: true}) }}</div>
            </div>
            <div class="td">
              <div class="td-con">{{ item.amount | unitNumFmt({isThousandth: true}) }}</div>
            </div>
          </div>
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
    onBack() {
      this.$emit('on-back')
      new Number().toFixed()
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
.inte-mobile-subpg {
  position: relative;
  .main-wrap {
    position: absolute;
    top: 45px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 22px 12px;
    overflow: auto;
    .inte-mobile-table {
      .thead {
        position: sticky;
        top: -24px;
      }
      .thead .tr {
        .th:nth-child(1) {
          width: 25%;
          flex-basis: 25%;
          text-align: center;
        }
        .th:nth-child(2) {
          width: 25%;
          flex-basis: 25%;
          text-align: center;
        }
        .th:nth-child(3) {
          width: 25%;
          flex-basis: 25%;
          text-align: center;
        }
        .th:nth-child(4) {
          width: 25%;
          flex-basis: 25%;
          text-align: center;
        }
      }
      .tbody .tr {
        .td:nth-child(1) {
          width: 25%;
          flex-basis: 25%;
          text-align: left;
        }
        .td:nth-child(2) {
          width: 25%;
          flex-basis: 25%;
          text-align: right;
        }
        .td:nth-child(3) {
          width: 25%;
          flex-basis: 25%;
          text-align: right;
        }
        .td:nth-child(4) {
          width: 25%;
          flex-basis: 25%;
          text-align: right;
        }
      }
    }
  }
}

</style>
