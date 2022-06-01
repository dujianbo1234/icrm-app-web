<template>
  <div class="MorningEvening">
    <!-- 顶部title -->
    <nav-bar type="2" title="晨夕会" leftIcon/>
    <!-- 日历 -->
    <div class="calendar">
      <div class="date">{{showTime}}</div>
      <span class="toDay" @click="toDay">当日</span>
    </div>
    <!-- 日历选择器 -->
    <div class="arrow">
      <!-- 2022.06.24 -->
      <van-calendar ref="calendar" :default-date="defaultDate._d" :min-date="minDate._d" :max-date="maxDate._d" row-height="40" :poppable="false" teleport=".arrow" color="#026DFF" :show-confirm="false" :show-title="false" :show-subtitle="false" :safe-area-inset-bottom="false" :style="{ height: '3rem' }" @select="selectDate" v-if="showWeekDetial"/>
      <!-- 分割线 -->
      <van-divider style="margin: 0; padding: 0 0.12rem;" @click.stop="showDate"><van-icon :name="showWeekDetial ? 'arrow-up' : 'arrow-down'" size="0.22rem" color="#ccc"/></van-divider>
    </div>
    <!-- 会议记录 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">会议记录</div>
        <div class="editBtn">编辑</div>
      </div>
      <div class="card">
        aaa
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'MorningEvening',
  data() {
    return {
      showWeekDetial: false,
      defaultDate: moment(),
      showTime: moment().format('YYYY年MM月DD日'),
      minDate: moment().subtract(3, 'month'),
      maxDate: moment(),
    };
  },
  methods: {
    moment,
    /* 展开或者收起日历 */
    showDate(){
      this.showWeekDetial = !this.showWeekDetial
    },
    /* 选中日期时 */
    selectDate(value){
      this.showTime = moment(value).format('YYYY年MM月DD日')
    },
    /* 当日 */
    toDay(){
      this.showTime = moment().format('YYYY年MM月DD日')
      this.$refs['calendar'].reset()
    }
  },
  mounted() {
    
  },
};
</script>
<style lang="less" scoped>
.MorningEvening {
  .card {
    background: #fff;
    padding: 0.12rem;
    border-radius: 0.08rem;
  }
  .calendar {
    position: relative;
    padding: 0.12rem;
    // height: 0.45rem;
    font-size: 0.15rem;
    text-align: center;
    border: 0.005rem solid #E5E5E5;
    background: #fff;
    .date {
      margin: 0 auto;
      color: #1D70F5;
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
    &:deep(.van-calendar__selected-day){
      width: 0.28rem;
      height: 0.28rem;
      border-radius: 50%;
    }
    // margin-top: 0;
    // width: 100%;
    // font-size: 0.12rem;
  }
  .minutesMeeting {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0.12rem;
      font-size: 0.17rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .label {
        color: #222222;
      }
      .editBtn {
        color: #026DFF;
      }
    }
  }
}
</style>