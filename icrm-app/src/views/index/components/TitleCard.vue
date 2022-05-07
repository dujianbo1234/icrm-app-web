<template>
  <div class="TitleCard">
    <div class="titleTop">
      <div class="titleL">
        <van-icon :name="require('@/assets/image/AUM_img.png')" size="0.2rem" />
        <h3>AUM余额(万元)</h3>
        <van-icon name="question-o" size="0.16rem" color="#BFBFBF"/>
      </div>
      <span class="titleR">
        <van-icon :name="require('@/assets/image/AUM_YE.png')" size="0.16rem"/>
        <span class="text">切换为贷款日均</span>
      </span>
    </div>
    <div class="titleNum">{{numFliter(4409514, false)}}</div>
    <div class="titleBot">
      <template v-for="(item,index) in [4409514,-49514,4409514]" :key="index">
        <div>
          <p class="textF">{{['较上日','较上月','较年初'][index]}}</p>
          <p class="textS">
            <span>{{numFliter(item, true)}}</span>
            <!-- 上升 -->
            <van-icon :name="require('@/assets/image/index_arrow_top.png')" size="0.16rem" v-if="item > 0"/>
            <!-- 下降png -->
            <van-icon :name="require('@/assets/image/index_main_numDown.png')" size="0.16rem" v-else-if="item < 0"/>
            <!-- 无数据 -->
            <van-icon :name="require('@/assets/image/index_main_numLine.png')" size="0.16rem" v-else/>
            <!-- 下降icon -->
            <!-- <van-icon name="down" size="0.12rem" color="#37cd37" v-if="false"/> -->
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleCard",
  props: {
    title: {
      type: Array,
      default: ["选项1", "选项2"],
    },
  },
  data() {
    return {};
  },

  methods: {
    numFliter(value, tip){
      if(value == undefined){
        return '0'
      }
      let n = value.toString().split('.')
      let z = /\d{1,3}(?=(\d{3})+$)/g
      let b = Number(value) > 0 && tip ? '+' : ''
      if(value.toString().indexOf('.') >= 0){
        return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
      }else{
        return `${b}${value.toString().replace(z, '$&,')}`
      }
    }
  },
};
</script>
<style lang="less" scoped>
.TitleCard {
  .titleTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .titleL {
      display: flex;
      justify-content: start;
      height: 0.2rem;
      text-align: left;
      h3 {
        margin: 0 0.08rem;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
    }
    .titleR {
      display: flex;
      justify-content: space-between;
      .text {
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #026DFF;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
  .titleNum {
    width: 100%;
    text-align: left;
    margin: 0.12rem 0 0.08rem 0;
    font-family: PingFangSC-Medium;
    font-size: 0.2rem;
    color: rgba(0,0,0,0.85);
    letter-spacing: 0;
    font-weight: 500;
  }
  .titleBot {
    display: flex;
    justify-content: space-between;
    text-align: left;
    letter-spacing: 0;
    font-weight: 400;
    font-size: 0.12rem;
    .textF {
      color: #8C8C8C;
    }
    .textS {
      display: flex;
      justify-content: start;
      color: #262626;
    }
  }
}
</style>