<template>
  <div class="unityList">
    <van-list class="vanListStyle" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getCustList">
      <div class="itemCard" v-for="item in unityList" :key="item.sysId">
        <div class="topText">
          <div class="title">
            <span class="name">{{item.cmrcOpptSubclassNm}}</span>
            <span class="icon blue" v-if="item.cmrcOpptSt == '2'">待跟进</span>
            <span class="icon yellow" v-if="item.cmrcOpptSt == '4'">已跟进</span>
            <span class="icon green" v-if="item.cmrcOpptSt == '5'">已成交</span>
            <span class="icon grany" v-if="item.cmrcOpptSt == '3'">逾期未跟进</span>
          </div>
          <div class="keyWords">{{item.keyWords}}</div>
        </div>
        <div class="botText">
          <div class="botText_top">
            <div>
              <span>商机到期日期：</span>
              <span class="text">{{moment(item.cmrcOpptExpDay).format('YYYY-MM-DD')}}</span>
            </div>
            <div>
              <span>跟进人：</span>
              <span class="text">{{item.followUpPrsnNm}}</span>
            </div>
          </div>
          <div>
            <span>最后跟进日期：</span>
            <span class="text">{{item.followUpDt ? moment(item.followUpDt).format('YYYY-MM-DD') : '-'}}</span>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import moment from "moment"
export default {
  props: {
    unityList: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {

    }
  },
  methods: {
    moment,
    getCustList(){
      this.$emit('getCustList')
    }
  }
};
</script>

<style lang="less" scoped>
.unityList {
  .itemCard {
    padding: 0.12rem;
    margin-bottom: 0.12rem;
    background: #ffffff;
    box-shadow: 0 0.02rem 0.1rem 0 rgba(217, 229, 242, 0.6);
    border-radius: 0.08rem;
    .topText {
      box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
      margin-bottom: 0.08rem;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          font-size: 0.16rem;
          font-weight: 500;
          color: #262626;
        }
        .icon {
          width: 0.41rem;
          height: 0.16rem;
          font-size: 0.11rem;
          color: #ffffff;
          border-radius: 0.02rem;
        }
        .blue {
          background: #026dff;
        }
        .yellow {
          background: #ffba00;
        }
        .green {
          background: rgb(18, 255, 18);
        }
        .grany {
          background: #bfbfbf;
        }
      }
      .keyWords {
        padding: 0.08rem 0;
        font-size: 0.12rem;
        font-weight: 400;
        text-align: left;
        color: #8c8c8c;
      }
    }
    .botText {
      font-size: 0.12rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      text-align: left;
      .text {
        color: #262626;
      }
      .botText_top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.04rem;
        & > div {
          flex: 1;
        }
      }
    }
  }
}
</style>