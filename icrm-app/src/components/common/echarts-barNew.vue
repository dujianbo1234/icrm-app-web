<template>
  <!-- 柱状图组件 -->
  <div class="echarts-barNew">
    <div class="echarts" ref="echarts"></div>
    <span class="time">日期</span>
  </div>
</template>

<script>
export default {
  name: "echarts-barNew",
  props: {
    barData: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    yName: String
  },
  watch: {
    barData(newData, oldData){
      let myChart = this.$echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表
      this.option.xAxis.data = newData.xAxis
      this.option.series[0].data = this.setNum(newData.series)
      myChart.clear()
      myChart.setOption(this.option);
    }
  },
  data() {
    return {
      option: {
        tooltip: {
          show: true,
          trigger: 'axis',
					formatter: params => {
            let string = 
            `<div style="display: flex;justify-content: space-between;align-items: center;">
              <span style="width: 0.05rem; height: 0.05rem; border-radius: 50%; background: ${params[0].color}; margin-right: 0.06rem"></span>
              <span>${params[0].value}人</span>
            </div>`
            return string
          },
          axisPointer: {
						type: 'cross',
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
            align: "center"
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
  mounted(){
    this.$nextTick(()=>{
      this.initData()
    })
  },
  methods: {
    initData() {
      let myChart = this.$echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表
      this.option.xAxis.data = this.barData.xAxis
      this.option.series[0].data = this.setNum(this.barData.series)
      myChart.clear()
      myChart.setOption(this.option);
    },
    /* 判断每条数据显示的颜色 */
    setNum(arr){
      let newArr = []
      arr.forEach(item => {
        let obj = {
          value: item,
          itemStyle: {
            color: item < 0 ? '#8C8C8C' : '#026DFF'
          }
        }
        newArr.push(obj)
      })
      return newArr
    }
  },
};
</script>
<style lang="less" scoped>
.echarts-barNew {
  border: 0.005rem solid #000;
  width: 100%;
  height: 1.87rem;
  padding: 0;
  margin-bottom: 0.02rem;
  z-index: 1;
  .echarts {
    width: 100%;
    height: 100%;
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
