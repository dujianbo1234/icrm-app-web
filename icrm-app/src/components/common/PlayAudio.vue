<template>
	<!-- 音频播放组件 -->
	<div class="PlayAudio">
		<van-progress :percentage="percentage" :show-pivot="false" />
		<div class="time">
			<span>{{tiemInit(currentDuration)}}</span>
			<span>{{tiemInit(totalDuration)}}</span>
		</div>
		<div class="playBtn">
			<van-icon :name="require('@/assets/image/play_left.png')" size="0.2rem" @click="forwardBack('R')" />
			<van-icon :name="play ? 'pause-circle-o' : 'play-circle-o'" size="0.4rem" color="#1D70F5" @click="playBtn"
				style="padding: 0 0.35rem;" />
			<van-icon :name="require('@/assets/image/play_right.png')" size="0.2rem" @click="forwardBack('A')" />
		</div>
	</div>
</template>
<script>
	import moment from 'moment';
	import {
		Toast
	} from 'vant';
	export default {
		props: {
			// 录音总时长(毫秒)
			// totalDuration: Number,
			audioItem: String
		},
		data() {
			return {
				currentDuration: 0, // 初始时间(毫秒)
				totalDuration: 0,
				play: false,
				player: null,
				timer: "",
			}
		},
		computed: {
			/* 进度条当前进度 */
			percentage() {
				return (this.currentDuration / this.totalDuration) * 100 || 0
			}
		},
		methods: {
			moment,
			/* 初始化状态 */
			init() {
				window.recordsAudio = new Audio();
				window.recordsAudio.src = this.audioItem;
				this.play = false;
				this.currentDuration = 0;
				this.totalDuration = 0;
				clearInterval(this.player);
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					if (window.recordsAudio.duration) {
						this.totalDuration = window.recordsAudio.duration;
						clearInterval(this.timer);
						this.timer = "";
					}
				}, 10);
			},
			/* 点击播放按钮 */
			playBtn() {
				if (this.currentDuration == 0 && !this.play) {
					Toast("音频加载中，请耐心等待！")
				}
				if (this.audioItem) {
					this.play = !this.play
					if (this.play) {
						window.recordsAudio.play()
						this.player = setInterval(() => {
							// this.totalDuration = window.recordsAudio.duration
							if (this.currentDuration < this.totalDuration) {
								this.currentDuration = window.recordsAudio.currentTime
							} else {
								this.play = !this.play
								this.currentDuration = 0
								clearInterval(this.player)
							}
						}, 1000)
					} else {
						window.recordsAudio.pause()
						clearInterval(this.player)
					};
					// if(this.play){
					//   this.$emit('playStop', 2)
					//   this.player = setInterval(()=> {
					//     if(this.currentDuration < this.totalDuration){
					//       this.currentDuration += 1
					//     }else{
					//       this.play = !this.play
					//       this.currentDuration = 0
					//       clearInterval(this.player)
					//     }
					//   }, 1000)
					// }else{
					//   this.$emit('playStop', 3)
					//   clearInterval(this.player)
					// }
				} else {
					Toast('请选择录音!')
				}
			},
			/* 快进/快退 */
			forwardBack(type) {
				if (this.audioItem) {
					let num = 15 // 这里修改每次前进后退的时间
					this.totalDuration = window.recordsAudio.duration
					switch (type) {
						case "R":
							if (window.recordsAudio.currentTime > num) {
								window.recordsAudio.currentTime -= num;
								this.currentDuration = window.recordsAudio.currentTime
							} else {
								window.recordsAudio.currentTime = 0;
								this.currentDuration = window.recordsAudio.currentTime
							}
							break;
						case "A":
							window.recordsAudio.currentTime += num;
							this.currentDuration = window.recordsAudio.currentTime
							break;
					}
					// switch(type){
					//   case true:
					//     if(this.currentDuration < num){
					//       this.currentDuration = 0
					//       this.init()
					//     }else{
					//       this.currentDuration -= num
					//     }
					//   break;
					//   case false:
					//     if(this.totalDuration - this.currentDuration < num){
					//       this.currentDuration = this.totalDuration
					//       this.init()
					//     }else{
					//       this.currentDuration += num
					//     }
					//   break;
					// }
				} else {
					Toast('请选择录音!')
				}
			},
			/* 格式化时间 */
			tiemInit(num) {
				if (!num || num == 0) {
					return '00:00'
				} else {
					let mm = (num - (num % 60)) / 60
					let ss = (num % 60).toFixed(0)
					return `${mm < 10 ? `0${mm}` : mm}:${ss < 10 ? `0${ss}` : ss}`
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	:deep(.van-progress__portion) {
		transition: all 0s;
	}

	.PlayAudio {
		// border-bottom: 0.005rem solid #EBEBEB;
		padding: 0.12rem;
		background: #fff;

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
			padding-top: 0.23rem;
		}
	}
</style>
