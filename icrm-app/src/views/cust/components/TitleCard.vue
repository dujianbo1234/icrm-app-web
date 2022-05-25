<template>
  <div class="TitleCard">
    <div class="titleTop">
      <div class="titleL">
        <van-icon :name="require('@/assets/image/AUM_img.png')" size="0.2rem"/>
        <h3>{{`${title}(${unit})`}}</h3>
        <van-icon name="question-o" size="0.16rem" color="#BFBFBF" @click="show = true"/>
      </div>
    </div>
    <div class="titleNum">{{numFliter(cardData[0], false)}}</div>
    <div class="titleBot" :style="`justify-content: space-between;`" v-if="title != '负债总览'">
      <div v-for="(item,index) in ['月日均','季日均','年日均']" :key="index">
        <p class="textF">{{item}}</p>
        <p class="textS">
          <span>{{numFliter(cardData[index+1], true)}}</span>
          <van-icon :name="require('@/assets/image/index_arrow_top.png')" size="0.16rem" v-if="cardData[index+1] > 0"/>
          <van-icon :name="require('@/assets/image/index_arrow_dowm.png')" size="0.16rem" v-else-if="cardData[index+1] < 0"/>
          <van-icon :name="require('@/assets/image/index_main_numLine.png')" size="0.16rem" v-else/>
        </p>
      </div>
    </div>

      <van-dialog v-model:show="show" :title="title" show-cancel-button>
        <div class="diloag">
          <div class="diloagItem">
            <p v-for="(item, index) in dalongShow" :key="index">{{item}}</p>
          </div>
        </div>
        <template #footer>
          <div class="bootomBtn">
            <!-- <van-button class="btnL" size="small" round plain type="primary" @click="show = false">取消</van-button> -->
            <van-button class="btn" size="small" type="primary" @click="show = false">确认</van-button>
          </div>
        </template>

      </van-dialog>
  </div>
</template>

<script>
export default {
  name: "TitleCard",
  props: {
    title: {
      type: String,
      default: '资产总览',
    },
    cardData: {
      type: Array,
      default: [],
    },
    unit: {
      type: String,
      default: '元',
    },
    dalongShow: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    numFliter(value, tip){
      if(value == undefined){
        return tip ? '0.00' : '0'
      }
      value = tip ? Number(value).toFixed(0) : Number(value).toFixed(2)
      let n = value.toString().split('.')
      let z = /\d{1,3}(?=(\d{3})+$)/g
      let b = Number(value) > 0 && tip ? '+' : ''
      if(value.toString().indexOf('.') >= 0){
        return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
      }else{
        return `${b}${value.toString().replace(z, '$&,')}`
      }
    },
  },
};
</script>
<style lang="less" scoped>
.TitleCard {
  background: #fff;
  border-radius: 0.08rem;
  padding: 0.07rem 0.075rem 0;
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
        font-weight: 500;
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
.diloag {
  text-align: left;
  width: 90%;
  margin: auto;
  padding: 0.05rem;
  border-radius: 0.04rem;
  border: solid 1px #e6e6e6;
  .diloagItem {
    overflow-y: auto;
    max-height: 4rem;
    line-height: 0.3rem;
    font-size: 0.13rem;
  }
}
.bootomBtn {
  margin: 0.08rem;
  .btn {
    padding: 0 0.32rem;
    border-radius: 0.08rem;
  }
}
</style>