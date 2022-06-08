<template>
  <!-- 音频播放组件 -->
  <div class="PlayAudio">
    <div class="audioTitle">正在播放：{{ "录音2备份" }}</div>
    <van-progress :percentage="percentage" :show-pivot="false" />
    <div class="time">
      <span>{{tiemInit(currentDuration)}}</span>
      <span>{{tiemInit(totalDuration)}}</span>
    </div>
    <div class="playBtn">
      <van-icon :name="require('@/assets/image/play_left.png')" size="0.2rem" @click="forwardBack(true)"/>
      <van-icon :name="play ? 'pause-circle-o' : 'play-circle-o'" size="0.4rem" color="#1D70F5" @click="playBtn" style="padding: 0 0.35rem;"/>
      <van-icon :name="require('@/assets/image/play_right.png')" size="0.2rem" @click="forwardBack(false)"/>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data(){
    return {
      currentDuration: 0, // 初始时间(秒)
      totalDuration: 90,  // 录音总时长(秒)
      play: false,
      player: null,
    }
  },
  computed: {
    /* 进度条当前进度 */
    percentage(){
      return (this.currentDuration/this.totalDuration)*100 || 0
    }
  },
  methods: {
    moment,
    /* 初始化状态 */
    init(){
      this.play = false
      this.currentDuration = 0
      clearInterval(this.player)
    },
    /* 点击播放按钮 */
    playBtn(){
      this.play = !this.play
      if(this.play){
       this.player = setInterval(()=> {
          if(this.currentDuration < this.totalDuration){
            this.currentDuration += 1
          }else{
            this.play = !this.play
            this.currentDuration = 0
            clearInterval(this.player)
          }
        }, 1000)
      }else{
        clearInterval(this.player)
      }
    },
    /* 快进/快退 */
    forwardBack(type){
      let num = 5 // 这里修改每次前进后退的时间
      switch(type){
        case true:
          if(this.currentDuration < num){
            this.currentDuration = 0
          }else{
            this.currentDuration -= num
          }
        break;
        case false:
          if(this.totalDuration - this.currentDuration < num){
            this.currentDuration = this.totalDuration
          }else{
            this.currentDuration += num
          }
        break;
      }
    },
    /* 格式化时间 */
    tiemInit(num){
      if(num == 0){
        return '00:00'
      }else{
        let mm = (num - (num%60)) / 60 
        let ss = num%60
        return `${mm < 10 ? `0${mm}` : mm}:${ss < 10 ? `0${ss}` : ss}`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.PlayAudio {
  border-bottom: 0.005rem solid #EBEBEB;
  .audioTitle {
    text-align: left;
    color: #131313;
    font-size: 0.15rem;
    margin-bottom: 0.3rem;
  }
  .time {
    display: flex;
    justify-content: space-between;
    margin-top: 0.06rem;
    font-size: 0.13rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
  .playBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.23rem 0;
  }
}
</style>