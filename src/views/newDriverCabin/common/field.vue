<template>
  <div ref="treemap" class="chart-field"></div>
</template>
<script>
import echarts from "echarts"
import _ from 'lodash'
export default {
  props: {
    treemapData: {
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
    treemapData: {
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
        this.chart.setOption({
          color: ["#079bdc", "#2267d6", "#feb063"],
          series: [
            {
              type: "treemap",
              height: '100%',
              width: '100%',
              label: {
                show: true,
                formatter: function (params) {
                  let data = params.data;
                  return data.name + "\n" + data.value;
                },
              },
              roam: false, //是否开启拖拽漫游（移动和缩放）
              nodeClick: false, //点击节点后的行为,false无反应
              breadcrumb: {
                show: false,
              },
              itemStyle: {
                gapWidth: 5,
                borderColor: 'transparent'
              },
              data: this.treemapData,
            },
          ],
        })
      })
    },
    onWinResize: _.throttle(function () {
      this.chart.resize()
    }, 200)
  },
  mounted () {
    this.chart = echarts.init(this.$refs.treemap);
    window.addEventListener('resize', this.onWinResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWinResize)
  }
};
</script>

<style scoped>
.chart-field {
  width: 100%;
  height: 100%;
}
</style>
