<template>
  <div class="field">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="grid">
          <div
            class="item"
            :class="[
              [0, 3, 4, 6, 7].includes(i) ? 'item1' : '',
              [5].includes(i) ? 'item2' : ''
            ]"
            v-for="(ele, i) in getList.left"
            :key="ele.name"
          >
            <div
              class="flex center bg"
              :style="`backgroundImage: url('${ele.img}')`"
            >
              <div>
                <p class="ellipsis name">{{ ele.name }}</p>
                <p class="name">{{ ele.value }}</p>
              </div>
            </div>
          </div>
          <!-- <div class="item item-2"></div>
          <div class="item item-3"></div>
          <div class="item item-4 item1"></div>
          <div class="item item-5 item1"></div>
          <div class="item item-6 item2"></div>
          <div class="item item-7 item1"></div>
          <div class="item item-8 item1"></div> -->
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="grid">
          <div
            class="item"
            :class="[[6, 8, 10, 11].includes(i) ? 'item1' : '']"
            v-for="(ele, i) in getList.right"
            :key="ele.name"
          >
            <div
              class="flex center bg"
              :style="`backgroundImage: url('${ele.img}')`"
            >
              <div>
                <p class="ellipsis name">{{ ele.name }}</p>
                <p class="name">{{ ele.value }}</p>
              </div>
            </div>
          </div>
          <!-- <div class="item item-9"></div>
          <div class="item item-10"></div>
          <div class="item item-11"></div>
          <div class="item item-12"></div>
          <div class="item item-13"></div>
          <div class="item item-14"></div>
          <div class="item item-15 item1"></div>
          <div class="item item-16"></div>
          <div class="item item-17 item1"></div>
          <div class="item item-18"></div>
          <div class="item item-19 item1"></div>
          <div class="item item-20 item1"></div> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "field",
  data() {
    return {
      left: [
        {
          name: "国土资源/能源",
          value: 0,
          img: require("./img/l-1.png")
        },
        {
          name: "军事/国防",
          value: 0,
          img: require("./img/l-2.png")
        },
        {
          name: "综合政务",
          value: 0,
          img: require("./img/l-3.png")
        },
        {
          name: "旅游/服务业",
          value: 0,
          img: require("./img/l-4.png")
        },
        {
          name: "气象/水文/测绘/地震",
          value: 0,
          img: require("./img/l-5.png")
        },
        {
          name: "城乡建设/环境保护",
          value: 0,
          img: require("./img/l-6.png")
        },
        {
          name: "科技/教育",
          value: 0,
          img: require("./img/l-7.png")
        },
        {
          name: "劳动/人事",
          value: 0,
          img: require("./img/l-8.png")
        }
      ],
      right: [
        {
          name: "农业/水利",
          value: 0,
          img: require("./img/r-1.png")
        },
        {
          name: "政法/监察",
          value: 0,
          img: require("./img/r-2.png")
        },
        {
          name: "财政",
          value: 0,
          img: require("./img/r-3.png")
        },
        {
          name: "对外事务",
          value: 0,
          img: require("./img/r-4.png")
        },

        {
          name: "商业/贸易",
          value: 0,
          img: require("./img/r-5.png")
        },
        {
          name: "综合政党",
          value: 0,
          img: require("./img/r-6.png")
        },
        {
          name: "工业/交通/邮政",
          value: 0,
          img: require("./img/r-7.png")
        },

        {
          name: "信息产业",
          value: 0,
          img: require("./img/r-8.png")
        },
        {
          name: "文化/卫生/体育",
          value: 0,
          img: require("./img/r-9.png")
        },
        {
          name: "经济管理",
          value: 0,
          img: require("./img/r-10.png")
        },

        {
          name: "民政/社区",
          value: 0,
          img: require("./img/r-11.png")
        },
        {
          name: "文秘/行政",
          value: 0,
          img: require("./img/r-12.png")
        }
      ]
    };
  },
  props: {
    setData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    getList() {
      let left = this.left;
      let right = this.right;
      if (!this.setData || !this.setData.length) {
        return {
          left,
          right
        };
      }
      left.forEach(ele => {
        let item = this.setData.find(item => item.name === ele.name);
        ele.value = (item && item.value) || 0;
      });
      right.forEach(ele => {
        let item = this.setData.find(item => item.name === ele.name);
        ele.value = (item && item.value) || 0;
      });
      return {
        left,
        right
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.field {
  width: 100%;
  height: 100%;
  .el-row {
    width: 100%;
    height: 100%;
  }
  .el-col {
    height: 100%;
    @media (max-width: 992.98px) {
      height: 50%;
    }
  }
  .grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
  }
  .item {
    padding: 2px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
    @media (max-width: 1366.98px) {
      font-size: 12px;
      line-height: 18px;
    }
    .bg {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      & > div {
        width: 88%;
      }
    }
  }
  .item1 {
    grid-column-start: span 2;
  }
  .item2 {
    grid-column-start: span 2;
    grid-row-start: span 2;
  }

  .item-1 {
    background: rgba(255, 1, 185, 0.9);
  }
  .item-2 {
    background: rgba(255, 1, 185, 0.85);
  }
  .item-3 {
    background: rgba(255, 1, 185, 0.8);
  }
  .item-4 {
    background: rgba(255, 1, 185, 0.75);
  }
  .item-5 {
    background: rgba(255, 1, 185, 0.7);
  }
  .item-6 {
    background: rgba(255, 1, 185, 0.6);
  }
  .item-7 {
    background: rgba(255, 1, 185, 0.65);
  }
  .item-8 {
    background: rgba(25, 1, 185, 0.25);
  }
  .item-9 {
    background: rgba(255, 224, 15, 0.75);
  }
  .item-10 {
    background: rgba(255, 224, 15, 0.45);
  }
  .item-11 {
    background: rgba(255, 225, 185, 0.45);
  }
  .item-12 {
    background: rgba(25, 255, 15, 0.45);
  }
  .item-13 {
    background: rgba(235, 13, 189, 0.25);
  }
  .item-14 {
    background: rgba(25, 1, 185, 0.15);
  }
  .item-15 {
    background: rgba(155, 1, 185, 0.45);
  }
  .item-16 {
    background: rgba(255, 127, 185, 0.45);
  }
  .item-17 {
    background: rgba(255, 1, 18, 0.5);
  }
  .item-18 {
    background: rgba(255, 1, 14, 0.15);
  }
  .item-19 {
    background: rgba(255, 195, 185, 0.9);
  }
  .item-20 {
    background: rgba(255, 155, 185, 0.45);
  }
}
</style>
