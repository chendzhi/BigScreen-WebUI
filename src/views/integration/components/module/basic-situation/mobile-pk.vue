<template>
  <div class="inte-mobile-subpg">
    <div class="inte-mobile-subpg-head">
      <div class="inte-mobile-subpg-head_back" @click="onBack">
        <i class="el-icon-arrow-left"></i>
      </div>
      <h3 class="inte-mobile-subpg-head_title">基本概况对比</h3>
    </div>
    <div class="main-wrap">
      <div class="inte-mobile-table">
        <div class="thead">
          <div class="tr">
            <div class="th">
              <div class="th-con">名称</div>
            </div>
            <div class="th">
              <div class="th-con">政府网站数</div>
            </div>
            <div class="th">
              <div class="th-con">政务新媒体数</div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="item in data" :key="item.id">
            <div class="td">
              <div class="td-con">{{item.name}}</div>
            </div>
            <div class="td">
              <div class="td-con">{{item.website | thousandth}}</div>
            </div>
            <div class="td">
              <div class="td-con">{{item.media | thousandth}}</div>
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
    }
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
          width: 36%;
          text-align: center;
        }
        .th:nth-child(2) {
          width: 32%;
          text-align: center;
        }
        .th:nth-child(3) {
          width: 32%;
          text-align: center;
        }
      }
      .tbody .tr {
        .td:nth-child(1) {
          width: 36%;
          text-align: left;
        }
        .td:nth-child(2) {
          width: 32%;
          text-align: right;
        }
        .td:nth-child(3) {
          width: 32%;
          text-align: right;
        }
      }
    }
  }
}

</style>
