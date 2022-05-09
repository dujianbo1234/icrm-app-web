<template>
  <div class="echart-Histogram">
    <!-- title选择 -->
    <van-tabs class="cust" v-model:active="active" :shrink="true" @change="change">
      <van-tab v-for="item in dataArr" :title="item" :key="item">
        <echartsBar ref="echartsBar" :yName="'增长人数'" :barData="barData"></echartsBar>
      </van-tab>
    </van-tabs>
    <!-- 下方月份选择 -->
    <van-tabs class="month" v-model:active="active2" type="card" v-if="timeUnit != 1">
      <van-tab v-for="index in ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']" :key="index" :title="index">
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import echartsBar from '@/components/common/echarts-barNew.vue'
export default {
  name: "echart-Histogram",
  components: {
    echartsBar
  },
  props: {
    dataArr: Array,
    timeUnit: Number, // 是否展示下方月份选择
    barData: {
      type: Object,
      default: ()=>{
        return {
          series: [120, -100, 150, 80, 70, 110, 130, 240, -100, 120,120, -200, 150, 80, 70, 110, 130, 240, 100, 120,120, 200, 150, 80, 70, 110, 130, 240, 100, 120],
          xAxis: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
        }
      }
    }
  },
  data() {
    return {
      active2: 0,
      active: 0,
      type: 0
    };
  },
  methods: {
    change(v){
      this.$emit('change', v)
    }
  },
};
</script>

<style lang="less" scoped>
.echart-Histogram {
  &:deep(.van-tabs__nav--card){
    margin: 0;
  }
  &:deep(.cust){
    --van-tab-text-color: #8C8C8C;
    --van-tab-active-text-color: #026DFF;
    --van-tabs-bottom-bar-color: #026DFF;
    --van-tab-font-size: 0.14rem;
    margin-bottom: 0.12rem;
  }
  &:deep(.month) {
    .van-tabs__nav--card {
      border: none;
    }
    .van-tab--card {
      border-right: none;
      color: #8C8C8C;
    }
    .van-tab--active {
      background: rgba(2,109,255,0.12);
      border-radius: 0.08rem;
      color: #026DFF;
    }
  }
}
</style>