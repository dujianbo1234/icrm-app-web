<template>
  <div class="TitleCard">
    <div class="titleTop">
      <div class="titleL">
        <van-icon :name="require('@/assets/image/AUM_img.png')" size="0.2rem"/>
        <h3>{{`${title[num ? 0 : 1]}(${unit})`}}</h3>
        <van-icon name="question-o" size="0.16rem" color="#BFBFBF" @click="clickDalong"/>
      </div>
      <span class="titleR" @click="clickBtn">
        <van-icon :name="require('@/assets/image/AUM_YE.png')" size="0.16rem"/>
        <span class="text">切换为{{title[num ? 1 : 0]}}</span>
      </span>
    </div>
    <div class="titleNum">{{numFliter(arr[num ? 0 : 1][0], false)}}</div>
    <div class="titleBot" :style="`justify-content: ${['space-between','space-around'][num ? 0 : 1]};`">
      <div v-for="(item,index) in [['较上日','较上月','较年初'],['较上月','较年初']][num ? 0 : 1]" :key="index">
        <p class="textF">{{item}}</p>
        <p class="textS">
          <span>{{numFliter(arr[num ? 0 : 1][index + 1], true)}}</span>
          <van-icon :name="require('@/assets/image/index_arrow_top.png')" size="0.16rem" v-if="arr[num ? 0 : 1][index + 1] > 0"/>
          <van-icon :name="require('@/assets/image/index_arrow_dowm.png')" size="0.16rem" v-else-if="arr[num ? 0 : 1][index + 1] < 0"/>
          <van-icon :name="require('@/assets/image/index_main_numLine.png')" size="0.16rem" v-else/>
        </p>
      </div>
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
    arr: {
      type: Array,
      default: [[], []],
    },
    unit: {
      type: String,
      default: '万元',
    }
  },
  data() {
    return {
      num: true
    };
  },
  methods: {
    numFliter(value, tip){
      if(value == undefined){
        return '0'
      }
      value = (Number(value)/10000).toFixed(2)
      let n = value.toString().split('.')
      let z = /\d{1,3}(?=(\d{3})+$)/g
      let b = Number(value) > 0 && tip ? '+' : ''
      if(value.toString().indexOf('.') >= 0){
        return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
      }else{
        return `${b}${value.toString().replace(z, '$&,')}`
      }
    },
    clickBtn(){
      this.num = !this.num
      this.$emit('change',this.num)
    },
    clickDalong(){
      this.$emit('clickDalong')
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
      justify-content: flex-start;
      align-items: center;
      height: 0.2rem;
      text-align: left;
      h3 {
        margin: 0 0.08rem;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
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
    // justify-content: space-between;
    text-align: left;
    letter-spacing: 0;
    font-weight: 400;
    font-size: 0.12rem;
    .textF {
      color: #8C8C8C;
    }
    .textS {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #262626;
    }
  }
}
</style>