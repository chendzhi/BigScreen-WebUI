<template>
  <div ref="chart" class="chart-columnChart"></div>
</template>
<script>

import { stackedColumn } from "../echartsConfig/columnChart"
import echarts from "echarts"
import _ from 'lodash' 

export default {
  props: {
    chartData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      chart:null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.initChart();
        }
      },
    },
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        this.chart.setOption(stackedColumn)
      })
    },
    onWinResize: _.throttle(function () {
      this.chart.resize()
    }, 200)
  },
  mounted () {
    this.chart = echarts.init(this.$refs.chart);
    window.addEventListener('resize', this.onWinResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
};
</script>

<style scoped>
.chart-columnChart {
  width: 100%;
  height: 100%;
}
</style>