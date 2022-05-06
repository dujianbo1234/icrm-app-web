<template>
  <div class="echart-Histogram">
    <van-tabs v-model:active="active" @click-tab="onClickTab" :shrink="true">
      <van-tab v-for="item in dataArr" :title="item" :key="item">
        <echartsBar ref="echartsBar" :yName="'增长人数'" :barData="barData"></echartsBar>
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
  },
  data() {
    return {
      active: 0,
      barData: {
        xAxis: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
        series: [120, -100, 150, 80, 70, 110, 130, 240, -100, 120,120, -200, 150, 80, 70, 110, 130, 240, 100, 120,120, 200, 150, 80, 70, 110, 130, 240, 100, 120]
      }
    };
  },
  methods: {
    onClickTab(){
      
    }
  },
};
</script>

<style scoped>
.echart-Histogram {
  --van-tab-text-color: #8C8C8C;
  --van-tab-active-text-color: #026DFF;
  --van-tabs-bottom-bar-color: #026DFF;
  --van-tab-font-size: 0.14rem;
}
</style>