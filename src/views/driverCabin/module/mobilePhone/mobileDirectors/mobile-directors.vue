<template>
  <div class="main">
    <!-- 头部 -->
    <top></top>
    <div class="innerDirector">
      <div class="dirHeader">
        <el-select v-model="value" @change="currentSel">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <p>
          省政府共召开<span>{{ amount }}</span
          >次常务会
        </p>
      </div>
      <div class="hfWord">
        <p>高频词</p>
        <div class="word">
          <ul>
            <li v-for="(item, index) in hfWordList" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="outerDirector">
      <div class="selectbox">
        <p>外省常务会</p>
        <div class="year">
          <span
            v-for="(item, index) in year"
            :key="index"
            @click="changeYear(item)"
            :class="{ on: item == yearItem }"
            >{{ item }}</span
          >
        </div>
        <div class="province">
          <ul>
            <li
              v-for="(item, index) in showProvince"
              :organCode="item.organCode"
              :key="index"
              @click="changeProvince(item.organCode)"
              :class="{ on: item.organCode == provinceCode }"
            >
              {{ item.shortName }}
            </li>
          </ul>
        </div>
        <div class="hfWords">
          <tag-cloud :data="hotTag" @clickTag="clickTagItem"></tag-cloud>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import tagCloud from 'v-tag-cloud'
import axios from 'axios'
import top from "../../components/top.vue";
Vue.use(tagCloud)
export default {
  components: {
    top,
  },
  data(){
        return {
            options:[
                {
                    value:2021,
                    label:'2021年'
                },
                {
                    value:2020,
                    label:'2020年'
                }
            ],
            value: 2020,
            yearItem:2021,
            provinceCode:'110000',
            year:[2021,2020],
            hfWordList:[],
            amount:0,
            allProvince:[],
            hotTag:[],
            allOraginData:{},
            params:{
              url:'http://103.203.219.146/scssspt/api/screen/screen/queryData',
              tn:'19',
              functionName:'省-常务会高频词19',
              queryParam:'is_use=1,is_del=0,organ_code=510000,year=2020',
              orderParam:'amount=desc',
              attribute:'510000',
              resultsFormat:''
            },
            showProvince:[]
        }
    },
    created(){
        //本省常务会高频词
        this.getData(1);
        //本省全年常务会次数
        this.params.tn = '18';
        this.params.functionName = '开常务会次数18';
        this.params.queryParam = 'year=' + this.value;
        this.params.orderParam = '';
        this.getData(2);
        //全部省份
        this.getAllProvince();
    },
    methods:{
        changeYear(item){
          this.yearItem = item;
          this.getAllProvince();
        },
        changeProvince(oraginCode){
            let that = this;
            for (const key in this.allOraginData) {
                if (Object.hasOwnProperty.call(this.allOraginData, key)) {
                    if(key == oraginCode){
                        this.provinceCode=oraginCode;
                        this.hotTag = [];
                        this.allOraginData[key].forEach(function(val,idx){
                            that.hotTag.push({name:val.word})
                        })
                    }
                }
            }
        },
        clickTagItem(tag){

        },
        getAllProvince(){
          let params = {
              code:510000,
              functionName:'省/市名称1',
              type:1
          };
          let that = this;
          let url = 'http://103.203.219.146/scssspt/api/screen/screen/querySubOrganByType';
          axios.get(url,{params})
          .then((msg)=>{
            let data = msg.data;
            that.allProvince = [];
            data.forEach(function(val,idx){
                that.allProvince.push({shortName:val.shortName,organCode:val.organCode})
            })
          })
          .then(()=>{
            that.getOuterData();
          })
        },
        currentSel(selVal){
            this.value = selVal;
            this.params.tn = '19';
            this.params.functionName = '省-常务会高频词19';
            this.params.queryParam = 'is_use=1,is_del=0,organ_code=510000,year=' + this.value;
            this.params.orderParam = 'amount=desc';
            this.params.attribute = '510000';
            this.params.resultsFormat = '';
            this.getData(1)
            
            this.params.tn = '18';
            this.params.functionName = '开常务会次数18';
            this.params.queryParam = 'year=' + this.value;
            this.params.orderParam = '';
            this.params.resultsFormat = '';
            this.getData(2)
        },
        getOuterData(){
          this.params.tn = '19';
          this.params.functionName = '外省-常务会高频词19';
          this.params.queryParam = 'parent_code=bm0100,top=20,queryType=1,year=' + this.yearItem;
          this.params.orderParam = 'amount=desc';
          this.params.attribute = '510000';
          this.params.resultsFormat = 'organ_code';
          this.getData(3);
        },
        getData(type){
            let that = this;
            let url = 'http://103.203.219.146/scssspt/api/screen/screen/queryData';
            let params = {
              ds: 2,
              tn: `${this.params.tn}`,
              functionName: `${this.params.functionName}`,
              queryParam: `${this.params.queryParam}`,
              orderParam: `${this.params.orderParam}`,
              attribute: `${this.params.attribute}`,
              resultsFormat: `${this.params.resultsFormat}`,
            }
            axios.get(url,{params})
            .then(function(msg){
                if(type == 1){ //常务会高频词
                    let dataList = msg.data;
                    that.hfWordList = [];
                    dataList.forEach(function(val,idx){
                        that.hfWordList.push(val.word)
                    })
                    that.reserveArr();
                }else if(type == 2){//年度常务会次数
                    that.amount = msg.data[0].amount;
                }else if(type == 3){//省
                  that.hotTag = [];
                  that.allOraginData = msg.data;
                  for (const iterator in msg.data) {
                      if(iterator == that.provinceCode){
                          msg.data[iterator].forEach(function(val,idx){
                              that.hotTag.push({name:val.word})
                          })
                      }
                  }
                  that.showProvince = [];
                  that.allProvince.forEach(function(value,index){
                    for (const iterator in msg.data) {
                      if(iterator == value.organCode){
                        that.showProvince.push(value)
                      }
                    }
                  })
                }
            })
        },
        reserveArr(){
          return this.hfWordList.reverse();
        }
    }
}

fnResize();
window.onresize = function () {
  fnResize();
}
function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 414) * 16 + 'px';
}
</script>

<style lang="scss" scoped>
$icon1: "~@/assets/images/mobilePhone/cwhbg.png";

@function px2rem($px) {
  @return $px/16 + rem;
}

$designWidth: 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

.main {
  background: linear-gradient(to bottom, #d5edfe, #fff);
}
.dirHeader {
  padding: 0 px2rem(20);
  width: 100%;
  height: px2rem(60);
  border-radius: 5px;
  background: linear-gradient(to bottom, #5ca9c1, #346d98);
}
.dirHeader > * {
  display: inline-block;
  margin: px2rem(14) px2rem(10);
  vertical-align: middle;
  float: left;
}
.dirHeader .el-select {
  width: px2rem(100);
}
.dirHeader p {
  color: #fff;
  font-size: px2rem(16);
  line-height: px2rem(32);
}
.dirHeader p span {
  font-size: px2rem(20);
  font-weight: bold;
  margin: 0 5px;
}
.hfWord {
  margin-top: px2rem(15);
}
.hfWord p {
  text-indent: px2rem(10);
  color: #346d98;
}
.hfWord .word {
  position: relative;
  margin: 0 auto;
  width: px2rem(300);
  height: px2rem(330);
  background: url($icon1) no-repeat;
  background-size: 100% 100%;
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
.hfWord .word ul li {
  position: absolute;
  color: #346d98;
  text-align: center;
}
.hfWord .word ul li:nth-child(11) {
  width: px2rem(50);
  height: px2rem(50);
  top: px2rem(30);
  left: px2rem(125);
}
.hfWord .word ul li:nth-child(10) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(95);
  left: px2rem(222);
}
.hfWord .word ul li:nth-child(9) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(175);
  left: px2rem(242);
}
.hfWord .word ul li:nth-child(8) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(245);
  left: px2rem(212);
}
.hfWord .word ul li:nth-child(7) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(280);
  left: px2rem(155);
}
.hfWord .word ul li:nth-child(6) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(280);
  left: px2rem(82);
}
.hfWord .word ul li:nth-child(5) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(230);
  left: px2rem(24);
}
.hfWord .word ul li:nth-child(4) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(170);
  left: px2rem(10);
  font-size: px2rem(14);
}
.hfWord .word ul li:nth-child(3) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(120);
  left: px2rem(45);
  font-size: px2rem(12);
}
.hfWord .word ul li:nth-child(2) {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(120);
  left: px2rem(120);
  font-size: px2rem(12);
}
.hfWord .word ul li:first-child {
  width: px2rem(40);
  height: px2rem(40);
  top: px2rem(176);
  left: px2rem(140);
  font-size: px2rem(12);
}
.outerDirector {
  margin-top: px2rem(20);
}
.selectbox {
  margin-top: px2rem(25);
}
.selectbox p {
  float: left;
  margin-bottom: px2rem(20);
  margin-right: px2rem(25);
}
.selectbox .year {
  float: right;
}
.selectbox .year span {
  font-size: px2rem(14);
  padding: px2rem(5) px2rem(10);
  color: #000;
  border-radius: 15px;
}
.selectbox .year span.on {
  background: #5ca9c1;
  color: #fff;
}
.province ul {
  margin-top: 1.25rem;
  width: 100%;
  display: -webkit-box;
  list-style-type: none;
  flex-wrap: nowrap;
  -webkit-box-pack: justify;
  justify-content: space-between;
  overflow: auto;
  background: #ffff;
  margin: 0;
  position: relative;
  padding: px2rem(10) px2rem(0);
}
.province ul li {
  width: 16%;
  height: px2rem(30);
  line-height: px2rem(33);
  font-size: px2rem(14);
  text-align: center;
}
.province ul li:last-child {
  width: auto;
}
.province ul li.on {
  background: #5ca9c1;
  border-radius: 10px;
  color: #fff;
}
.hfWords{
  height: px2rem(260);
}
.tag-cloud{
  width:260px !important;
  height:260px !important;
}
</style>