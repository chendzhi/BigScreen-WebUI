<template>
  <div class="main">
    <div class="detailTop">
      <div class="back" @click="goback">&lt;</div>
      <p>传播详情</p>
    </div>
    <div class="maintitle">
      <p>{{mancInfo.title}}<span>{{mancInfo.time}}</span></p>
      
    </div>
    <div class="zccb">
      <div class="cbcon">
        <div class="zcEcharts">
          <div id="zcfb1" class="mycharts"></div>
          <div id="zcfb2" class="mycharts"></div>
          <div id="zcfb3" class="mycharts"></div>
          <div id="zcfb4" class="mycharts"></div>
        </div>
        <div class="dept">
          <ul>
            <li v-for="(item,idx) in deptList" :key="idx">
              <span class="name">{{item.name}}</span>
              <span class="value"><i>{{item.crtVal}}</i>/{{item.allVal}}</span>   
            </li>
          </ul>
        </div>
        <div class="city">
          <ul>
            <li v-for="(item,idx) in cityList" :key="idx">
              <div class="top">{{item.cityName}}</div>
              <div class="citydata">
                <div class="sz">
                  <span><i>{{item.cityData[0].crtVal}}</i>/{{item.cityData[0].allVal}}</span>
                  <span>{{item.cityData[0].name}}</span>
                </div>
                <div class="qx">
                  <span><i>{{item.cityData[1].crtVal}}</i>/{{item.cityData[1].allVal}}</span>
                  <span>{{item.cityData[1].name}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
// 引入echarts
import Vue from 'vue'
import echarts from 'echarts'
import axios from 'axios'
Vue.prototype.$echarts = echarts;



export default {
  data () {
    return {
      deptList:[],
      spreadList:[],
      cityList:[],
      mancInfo:{
        title:'',
        time:''
      }
    }
  },
  mounted(){
    
    let dataInfo = this.$route.query.data;
    let details = JSON.parse(dataInfo.details);
    let allNumObj = this.getSum(details)
    this.mancInfo = {
      title:dataInfo.title,
      time:dataInfo.release_date
    }
    this.deptList = [
      {
        name:'省直',
        crtVal:dataInfo.directly_under_spread,
        allVal:dataInfo.directly_under_number
      },
      {
        name:'市州',
        crtVal:dataInfo.citiesn_spread,
        allVal:dataInfo.citiesn_number
      }
    ]
    this.spreadList = [
      {
        name:'省直',
        crtVal:dataInfo.directly_under_spread,
        allVal:dataInfo.directly_under_number
      },
      {
        name:'市州',
        crtVal:dataInfo.citiesn_spread,
        allVal:dataInfo.citiesn_number
      },
      {
        name:'市直',
        crtVal:allNumObj.directly_spreadSum,
        allVal:allNumObj.directly_allSum
      },
      {
        name:'区县',
        crtVal:allNumObj.organ_spreadSum,
        allVal:allNumObj.organ_allSum
      }
    ];
    this.drawLine();

  },
  created(){
  }
  ,
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('zcfb1'))
        let myChart1 = this.$echarts.init(document.getElementById('zcfb2'))
        let myChart2 = this.$echarts.init(document.getElementById('zcfb3'))
        let myChart3 = this.$echarts.init(document.getElementById('zcfb4'))
        // 绘制图表
        myChart.setOption(this.setopation(this.spreadList[0].crtVal/this.spreadList[0].allVal,this.spreadList[0].name,this.spreadList[0].crtVal));
        myChart1.setOption(this.setopation(this.spreadList[1].crtVal/this.spreadList[1].allVal,this.spreadList[1].name,this.spreadList[1].crtVal));
        myChart2.setOption(this.setopation(this.spreadList[2].crtVal/this.spreadList[2].allVal,this.spreadList[2].name,this.spreadList[2].crtVal));
        myChart3.setOption(this.setopation(this.spreadList[3].crtVal/this.spreadList[3].allVal,this.spreadList[3].name,this.spreadList[3].crtVal));
    },
    setopation(percent,title,num){
      return {
				tooltip: {
					show: false,
				},
				series: [{
					type: "gauge",
					startAngle: 180,
					endAngle: 0,
					radius:'85%',
					startAngle:210,
					endAngle:-30,
					splitNumber: 3,		// 仪表盘刻度的分割段数,默认 10。
					center: ["50%", "65%"],	// 仪表盘位置(圆心坐标)
					axisLine: {
						show: true,
						lineStyle: {
              width: 8,
              color:[[percent, '#4D84AB'],[1, '#E6EBF8']]
						},
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitLine:{
						show:false
					},
					pointer: {
						show: false,
          },
          progress:{
            show: true,
            width: 8,
            itemStyle:{
                color:'#4D84AB',
            }
          },
					detail: {
						 show:true,
						 formatter : "{score|{value}个}",
						 offsetCenter: [0, "20%"],
						 height:30,
						 rich : {
							 score : {
								 color : "#DF6454",
								 fontSize : 12
							 }
						 }
					 },
					data: [{value: num,name:title}],
					title: {
					    offsetCenter: [0, '70%'],
              fontSize: 12
					}
				}]};
    },
    format(timestr) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(timestr);
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return this.addZero(m) + "-" + this.addZero(d);
    },
    addZero(m) {
      return m < 10 ? "0" + m : m;
    },
    goback(){
      this.$router.go(-1);
    },
    getSum(arr){
      let that = this;
      let obj = {
        directly_spreadSum:0,
        directly_allSum:0,
        organ_spreadSum:0,
        organ_allSum:0,
      }
      arr.forEach(function(val,idx){
        obj.directly_spreadSum += val.directly_spread;
        obj.directly_allSum += val.directly_number;
        obj.organ_spreadSum += val.sub_organ_spread;
        obj.organ_allSum += val.sub_organ_number;
        let spreadObj = {};
// {cityName:'成都',cityData:[{name:'市直',value:0},{name:'区县',crtVal:3,allVal:'5'}]},
        
        if(val.organ_name.indexOf('市')){
          spreadObj.cityName = val.organ_name.replace('市','');
        }
        if(val.organ_name.indexOf('自治州') != -1){
          spreadObj.cityName = val.organ_name.substring(0,2) + '州';
        }
        spreadObj.cityData = [
          {name:'市直',crtVal:val.directly_spread,allVal:val.directly_number},
          {name:'区县',crtVal:val.sub_organ_spread,allVal:val.sub_organ_number}
        ];
        that.cityList.push(spreadObj)
      })
      return obj;
    }
  },
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
$icon1: "~@/assets/images/mobilePhone/deptbg.png";
$icon2: "~@/assets/images/mobilePhone/citybg.png";


@function px2rem( $px ){
    @return $px/16 + rem;
}

$designWidth : 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

.detailTop{
  position:relative;
  width: 100%;
  height:px2rem(50);
  line-height: px2rem(50);
  text-align: center;
  color:#fff;
  background: #125589;
}
.detailTop div{
  position:absolute;
  width:50px;
  height:100%;
  font-size:px2rem(22);
}

.maintitle{
  padding:px2rem(10);
  width: 100%;
  font-size: px2rem(20);
}
.maintitle p{
  padding: px2rem(10);
  line-height:px2rem(25);
  font-weight: bold;
}
.maintitle span{
  float:right;
  font-size: px2rem(16);
  color:#ccc;
  font-weight: normal;
}
.fbcon,.cbcon{
  width: 100%;
  height:px2rem(140);
}
.fbcon{
  padding-left: px2rem(8);
}
.cbcon{
  padding-bottom: px2rem(20);
  height:auto;
}
.fbcon img,.cbcon img{
  float:left;
  width: px2rem(55);
  margin: px2rem(45) px2rem(5) 0;
}
.mycharts,.cbcon .zcEcharts .mycharts{
  float:left;
  width: px2rem(80);
  height: px2rem(80);
}
.cbcon .zcEcharts{
  width:100%;
  display: flex;
  justify-content: space-around;
  height:px2rem(110);
}
.dept{
  width:100%;
  margin: 0 auto px2rem(20);
}
.dept ul,.city ul{
  padding: 0;
  margin: 0;
  display: flex;
  list-style:none;
  justify-content: space-around;
  flex-wrap: wrap;
}
.dept ul li{
  width:43%;
  height:px2rem(40);
  background: url($icon1) no-repeat;
  background-size: 100% 100%;
  text-align: center;
  line-height: px2rem(40);
}
.dept ul li span{
  color:#4D84AB;
}
.dept ul li span + span{
  margin-left: px2rem(15);
}
.city ul li{
  width: 26%;
}
.city ul li .top{
  width: 100%;
  height:px2rem(30);
  line-height: px2rem(30);
  text-align: center;
  font-weight: bold;
}
.city ul li i,.dept ul li i{
  font-style: normal;
  color: #ED993C;
}
.city ul li .citydata{
  padding: px2rem(15) px2rem(10);
  width: 100%;
  height: px2rem(70);
  background: url($icon2) no-repeat;
  background-size: 100% 100%;
}
.city ul li .citydata div{
  float: left;
  width: 50%;
  height:100%;
  text-align: center;
  font-size: px2rem(14);
}
.city ul li .citydata div span{
  display: block;
  width: 100%;
  color:#4D84AB;
}
.city ul li .citydata div span + span{
  margin-top: px2rem(5);
}
</style>
