<template>
  <div class="addNewRecord">
    <!-- 顶部title -->
    <nav-bar type="2" title="新增记录" leftIcon />
    <!-- 会议记录 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">会议记录</div>
      </div>
      <div class="card">
        <div style="display: flex">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea"></el-input>
        </div>
        <div class="minutesList">
          <div>
            <span>创建人</span>
            <span>李白</span>
          </div>
          <div>
            <span>机构</span>
            <span>九江银行八里湖支行</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>2021-12-01 08:00-10</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 音频管理 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">音频管理</div>
      </div>
      <div class="card">
        <div class="minutesList">
          <div>
            <span>创建人</span>
            <span>李白</span>
          </div>
          <div>
            <span>机构</span>
            <span>九江银行八里湖支行</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>2021-12-01 08:00-10</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 会议照片 -->
    <div class="minutesMeeting">
      <div class="title">
        <div class="label">会议照片</div>
      </div>
      <div class="card">
        <div class="minutesList">
          <div>
            <span>创建人</span>
            <span>李白</span>
          </div>
          <div>
            <span>机构</span>
            <span>九江银行八里湖支行</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>2021-12-01 08:00-10</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 这是底线 -->
    <div class="bottomLine">
      <span></span>
      <div class="bottomText">到底啦，我是有底线的</div>
      <span></span>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "addNewRecord",
  data() {
    return {
      textarea: "",
    };
  },
  methods: {
    moment
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.addNewRecord {
  .card {
    background: #fff;
    padding: 0.12rem;
    border-radius: 0.08rem;
  }
  .minutesMeeting {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0.12rem;
      font-size: 0.15rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .label {
        color: #222222;
      }
    }
    .minutesList {
      // background: pink;
      font-size: 0.15rem;
      & > div {
        display: flex;
        justify-content: space-between;
        padding: 0.12rem 0;
      }
      div:nth-child(2) {
        border-top: 0.005rem solid #e5e5e5;
        border-bottom: 0.005rem solid #e5e5e5;
      }
      div:nth-child(3) {
        padding-bottom: 0;
      }
    }
  }
  .bottomLine {
    width: 60%;
    margin: 0.5rem auto 0.35rem;
    padding-bottom: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
      width: 10.7%;
      height: 0.005rem;
      opacity: 0.7;
      border-top: 0.005rem solid rgba(191, 191, 191, 1);
    }
    .bottomText {
      margin: 0 2.7%;
      font-size: 0.12rem;
      padding: 0 0.1rem;
      color: #bfbfbf;
    }
  }
}
</style>