<template>
  <div class="MorningEvening">
    <!-- 顶部title -->
    <nav-bar type="2" title="晨夕会" leftIcon/>
    <!-- 日历 -->
    <div class="calendar">
      <div class="date">
        <span class="icon icon1"></span>
        <span class="text">2022年05月18日</span>
        <span class="icon icon2"></span>
      </div>
      <span class="toDay">当日</span>
    </div>
    <!-- 日历选择器 -->
    <div class="arrow">
      <!-- 2022.06.24 -->
      <van-calendar :poppable="false" teleport=".arrow" color="#026DFF" :show-confirm="false" :show-title="false" :safe-area-inset-bottom="false" :show-subtitle="false" :style="{ height: '3rem' }" v-if="showWeekDetial"/>
      <!-- 分割线 -->
      <van-divider style="margin-top: 0; padding: 0 0.12rem;" @click.stop="showDate"><van-icon :name="showWeekDetial ? 'arrow-up' : 'arrow-down'" size="0.22rem" color="#ccc"/></van-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MorningEvening',
  data() {
    return {
      showWeekDetial: false
    };
  },
  methods: {
    showDate(){
      this.showWeekDetial = !this.showWeekDetial
    }
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.MorningEvening {
  .calendar {
    position: relative;
    padding: 0.12rem;
    // height: 0.45rem;
    font-size: 0.16rem;
    text-align: center;
    border: 0.005rem 0 0.005rem 0 solid #E5E5E5;
    background: #fff;
    .date {
      margin: 0 auto;
      display: flex;
      align-items: center;
      width: 50%;
      .text {
        color: #1D70F5;
        margin: 0 0.08rem;
      }
      .icon {
        border-top: 0.07rem solid transparent; /*这行去掉也行*/
        border-bottom: 0.07rem solid transparent;
      }
      .icon1 {
        border-right: 0.07rem solid #1D70F5;
        border-left: 0.07rem solid transparent;
      }
      .icon2 {
        border-right: 0.07rem solid transparent;
        border-left: 0.07rem solid #1D70F5;
      }
    }
    .toDay {
      position: absolute;
      right: 0.12rem;
      top: 50%;
      transform: translateY(-50%);
      color: #1D70F5;
    }
  }
    .arrow {
      // padding: 0 0.12rem;
      background: #fff;
      border-radius: 0 0 0.08rem 0.08rem;
      // margin-top: 0;
      // width: 100%;
      // font-size: 0.12rem;
    }
}
</style>