import echarts from "echarts";
//set data 测试数据非真实
const source = [
  '数据云',
  '案件',
  '特种\n设备',
  '无证\n无照',
  '抽查\n检查',
  '价格\n监管',
  '注册',
  '进口菲\n特监管',
  '许可',
  '舆情',
  '信用',
  '列异',
  '医疗器\n械监管',
  '办公\n数据',
  '六个双',
  '年报',
  '标准化\n监管',
  '投诉\n举报',
  '食品日\n常监管',
  '计量日\n常监管',
  '国家\n市级',
  '国家\n市级',
  '区级',
  '国家\n市级',
  '局自建',
  '国家\n市级',
  '局自建',
  '国家\n市级',
  '社会\n第三方',
  '区级',
  '国家\n市级',
  '局自建',
  '局自建',
  '区级',
  '国家\n市级',
  '局自建',
  '国家\n市级',
  '局自建',
  '局自建'
]

let listdata = [];

source.map((v, k) => {
  if (k > 0 && k <= 19) {
      listdata.push({
          name: v,
          category: 1,
          symbolSize: 80
      });
  } else if (k > 19) {
      listdata.push({
          value: v,
          category: 2,
          symbolSize: 60
      });
  } else {
      listdata.push({
          name: v,
          category: 0,
          symbolSize: 100,
          draggable: true
      })
  }
});
listdata.splice(6, 1, {
  name: '注册',
  category: 1,
  symbolSize: 80,
  label: {
      formatter: '{b}',
      fontSize: 16,
      color: '#d86824'
  },
  itemStyle: {
      color: {
          type: 'radial',
          r: 0.9,
          colorStops: [{
              offset: 0,
              color: '#0c1746'
          }, {
              offset: 1,
              color: '#d86824'
          }]
      },
      borderColor: '#d86824',
      borderWidth: 1
  }
});
listdata.splice(25, 1, {
  value: '国家\n市级',
  category: 2,
  symbolSize: 60,
  label: {
      formatter: '{c}',
      fontSize: 14,
      color: '#d86824'
  },
  itemStyle: {
      color: {
          type: 'radial',
          r: 0.9,
          colorStops: [{
              offset: 0,
              color: '#0c1746'
          }, {
              offset: 1,
              color: '#d86824'
          }]
      },
      borderColor: '#d86824',
      borderWidth: 1
  }
});
//console.log(listdata)

export const graphConfig = {
  tooltip: {
      show: false
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [{
      type: 'graph',
      layout: 'force', // circular | force | none
      circular: {
          rotateLabel: true
      },
      force: {
          repulsion: 300, //斥力,值越大则斥力越大
          gravity: 0, //重力
          edgeLength: [0, 0],
          layoutAnimation: true, //默认动态为true
      },
      symbol: 'circle', // 节点标记类型
      symbolSize: 70,
      focusNodeAdjacency: true, // 鼠标经过节点是否突出显示
      edgeSymbol: ['circle', 'none'],
      edgeSymbolSize: [0, 0],
      edgeLabel: {
          show: false
      },
      roam: true, // 是否开启鼠标平移
      draggable: true, // 节点是否可拖拽
      label: {
          normal: {
              show: true,
              position: 'inside',
              textStyle: {
                  fontSize: 14,
                  color: '#54f7ff'
              },
          }
      },
      lineStyle: {
          normal: {
              opacity: .7,
              color: '#54f7ff',
              width: 2,
              curveness: 0
          }
      },
      itemStyle: {
          opacity: .7,
          normal: {
              color: {
                  type: 'radial',
                  r: 0.9,
                  colorStops: [{
                      offset: 0,
                      color: '#0c1746'
                  }, {
                      offset: 1,
                      color: '#54f7ff'
                  }]
              },
              borderColor: '#54f7ff',
              borderWidth: 1
          }
      },
      categories: [{ // 节点分类
          name: 'root',
          label: {
              formatter: '{b}',
              fontSize: 20,
              color: '#ffec19'
          },
          itemStyle: {
              color: {
                  type: 'radial',
                  r: 0.9,
                  colorStops: [{
                      offset: 0,
                      color: '#0c1746'
                  }, {
                      offset: 1,
                      color: '#ffec19'
                  }]
              },
              borderColor: '#ffec19',
              borderWidth: 1
          }
      }, {
          name: 'child',
          label: {
              formatter: '{b}',
              fontSize: 16,
              color: '#54f7ff'
          },
          itemStyle: {
              color: {
                  type: 'radial',
                  r: 0.9,
                  colorStops: [{
                      offset: 0,
                      color: '#0c1746'
                  }, {
                      offset: 1,
                      color: '#54f7ff'
                  }]
              },
              borderColor: '#54f7ff',
              borderWidth: 1
          }
      }, {
          name: 'grandson',
          label: {
              formatter: '{c}',
              fontSize: 12,
              color: '#69a1ff'
          },
          itemStyle: {
              color: {
                  type: 'radial',
                  r: 0.9,
                  colorStops: [{
                      offset: 0,
                      color: '#0c1746'
                  }, {
                      offset: 1,
                      color: '#69a1ff'
                  }]
              },
              borderColor: '#69a1ff',
              borderWidth: 1
          }
      }],
      data: listdata, // 数据
      links: [{ // 节点间关系数据 - 数字表示源节点的索引
          source: 0,
          target: 1
      }, {
          source: 0,
          target: 2
      }, {
          source: 0,
          target: 3
      }, {
          source: 0,
          target: 4
      }, {
          source: 0,
          target: 5
      }, {
          source: 0,
          target: 6

      }, {
          source: 0,
          target: 7
      }, {
          source: 0,
          target: 8

      }, {
          source: 0,
          target: 9
      }, {
          source: 0,
          target: 10
      }, {
          source: 0,
          target: 11
      }, {
          source: 0,
          target: 12
      }, {
          source: 0,
          target: 13
      }, {
          source: 0,
          target: 14
      }, {
          source: 0,
          target: 15
      }, {
          source: 0,
          target: 16
      }, {
          source: 0,
          target: 17
      }, {
          source: 0,
          target: 18
      }, {
          source: 0,
          target: 19
      }, {
          source: 1,
          target: 20,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 2,
          target: 21,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 3,
          target: 22,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 4,
          target: 23,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 5,
          target: 24,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 6,
          target: 25,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 7,
          target: 26,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 8,
          target: 27,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 9,
          target: 28,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 10,
          target: 29,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 11,
          target: 30,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 12,
          target: 31,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 13,
          target: 32,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 14,
          target: 33,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 15,
          target: 34
      }, {
          source: 16,
          target: 35,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 17,
          target: 36,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 18,
          target: 37,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }
      }, {
          source: 19,
          target: 38,
          lineStyle: {
              normal: {
                  color: '#69a1ff'
              }
          }

      }]
  }]
};