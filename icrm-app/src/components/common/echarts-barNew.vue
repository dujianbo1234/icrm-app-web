<template>
  <!-- 柱状图组件 -->
  <div class="echarts-barNew">
    <div class="echarts" ref="echarts"></div>
    <div class="title">
      <span class="left">
        <span class="timeText" v-if="timeUnit == 0">{{moment(axisValue).format('YYYY-MM-DD')}}</span>
        <span class="timeText" v-else>{{moment(axisValue).format('YYYY-MM')}}</span>
        <span :style="{'color': currentNum > 0 ? 'red' : (currentNum < 0 ? '#37cd37' : '#8C8C8C') }">
          {{currentNum > 0 ? `+${currentNum}` : currentNum}}{{unit}}
        </span>
      </span>
      <span class="right">客户总数：<span class="text">{{pepoe}}</span></span>
    </div>
    <span class="time">日期</span>
  </div>
</template>

<script>
import moment from "moment"
export default {
  name: "echarts-barNew",
  props: {
    barData: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    yName: String,
    timeUnit: Number,
    unit: {
      type: String,
      default: '人'
    }
  },
  watch: {
    barData(newData, oldData){
      this.initData(newData.xAxis, newData.series)
      // let myChart = this.$echarts.init(this.$refs.echarts);
      // // 使用刚指定的配置项和数据显示图表
      // this.option.xAxis.data = newData.xAxis
      // this.option.series[0].data = this.setNum(newData.series)
      // myChart.clear()
      // myChart.setOption(this.option);
    }
  },
  data() {
    return {
      currentNum: 0,
      axisValue: moment(),
      pepoe: 0,
      option: {
        tooltip: {
          show: true,
          trigger: 'axis',
					formatter: params => {
            this.axisValue = params[0].data.time
            this.currentNum = params[0].data.toYstd
            this.pepoe = params[0].value
            let string = 
            `<div style="display: flex;justify-content: space-between;align-items: center;">
              <span style="width: 0.05rem; height: 0.05rem; border-radius: 50%; background: ${params[0].color}; margin-right: 0.06rem"></span>
              <span>${params[0].value}${this.unit}</span>
            </div>`
            return string
          },
          axisPointer: {
						type: 'cross',
            snap: true,
            label: {
              show: false
            }
					},
        },
        grid: {
          left: 10,
          right: 20,
          top: '20%',
          bottom: 14,
          containLabel: true
        },
        axisLabel: {
          show: true,
          color: "#8C8C8C"
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#8C8C8C'
            }
          },
          axisTick: {
            show: false
          },
          data: [],
        },
        yAxis: {
          type: "value",
          name: this.yName,
          nameTextStyle: {
            color: '#8C8C8C',
            align: "right"
          },
          splitLine :{
            lineStyle:{
              type:'dashed', //虚线
            },
            show: true //隐藏
          }
        },
        series: [
          {
            type: "bar",
            data: [],
          },
        ],
      }
    };
  },
  created(){
    this.$nextTick(()=>{
      this.initData(this.barData.xAxis, this.barData.series)
    })
  },
  methods: {
    moment,
    initData(xAxis, series) {
      let myChart = this.$echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表
      this.option.xAxis.data = xAxis
      this.option.series[0].data = this.setNum(series)
      myChart.clear()
      myChart.setOption(this.option);
    },
    /* 判断每条数据显示的颜色 */
    setNum(arr){
      let newArr = []
      arr.forEach((item, index) => {
        let obj = {
          value: item.value,
          toYstd: item.toYstd,
          time: item.time,
          itemStyle: {
            color: item.value < 0 ? '#8C8C8C' : '#026DFF'
          }
        }
        newArr.push(obj)
        // 初始化顶部展示
        if(index == 0){
          this.axisValue = item.time
          this.currentNum = item.toYstd   // 较上日
          this.pepoe = item.value         // 总数
        }
      })
      return newArr
    }
  },
};
</script>
<style lang="less" scoped>
.echarts-barNew {
  // border: 0.005rem solid #000;
  position: relative;
  width: 100%;
  height: 1.87rem;
  padding: 0;
  margin-bottom: 0.02rem;
  z-index: 1;
  .echarts {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 3.5%;
    right: 0;
    padding-right: 0.1rem;
    &>span {
      padding: 0.02rem 0.08rem;
      background: rgba(2,109,255,0.08);
      border-radius: 0.04rem;
      color: #595959;
      letter-spacing: 0;
      margin: auto 0;
    }
    .left {
      font-size: 0.12rem;
      margin-right: 0.1rem;
      .timeText {
        margin-right: 0.02rem ;
      }
    }
    .right {
      font-size: 0.12rem;
      .text {
        font-size: 0.1rem;
      }
    }
  }
  .time {
    position: absolute;
    bottom: 0;
    right: 2%;
    color: #8C8C8C;
    font-size: 0.1rem
  }
}
</style>
