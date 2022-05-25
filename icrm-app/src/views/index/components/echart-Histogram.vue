<template>
  <div class="echart-Histogram">
    <!-- title选择 -->
    <van-tabs class="cust" v-model:active="active" :shrink="true" @change="change">
      <van-tab v-for="item in dataArr" :title="item" :key="item">
        <echartsBar ref="echartsBar" :yName="['增长人数','增长(万元)','增长(元)'][type]" :unit="['人','万元','元'][type]" :numType="numType" :numUnit="numUnit" :timeUnit="timeUnit" :barData="barData"></echartsBar>
      </van-tab>
    </van-tabs>
    <!-- 下方月份选择 -->
    <van-tabs class="month" v-model:active="active2" type="card" @change="change2" v-if="timeUnit != 1">
      <van-tab v-for="item in selectTime" :key="item.key" :title="item.title">
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
    selectTime: Array, // 根据数据日期生成的可以选择查询的12个月
    numType: {
      type: String,
      default: '客户总数'
    },
    numUnit: String,
    barData: {
      type: Object,
      default: ()=>{
        return {
          series: [120, -100, 150, 80, 70, 110, 130, 240, -100, 120,120, -200, 150, 80, 70, 110, 130, 240, 100, 120,120, 200, 150, 80, 70, 110, 130, 240, 100, 120],
          xAxis: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
        }
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      active2: 11,
      active: 0,
    };
  },
  methods: {
    // 选择title类型
    change(v){
      this.$emit('change', v)
    },
    // 选择月份时重置title
    change2(v){
      this.active = 0
      this.$emit('change', 0)
      this.$emit('change2', v)
    },
    init(){
      this.active = 0
      this.active2 = 11
      this.$emit('change', 0)
      // this.$emit('change2', 11)
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