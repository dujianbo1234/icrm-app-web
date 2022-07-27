<template>
	<div class="navbar" :class="'type'+type">
		<div class="topSafePlace"></div>
		<div class="title" :style="{color:type=='1'?'#FFFFFF':type=='2'?'#262626':'','border-bottom':type=='2'?'solid 0.01rem #F0F0F0':''}">{{title}}</div>
		<div class="leftIcon" v-if="leftIcon" @click="back">
			<van-icon size="0.24rem" name="arrow-left" :color="type=='1'?'#FFFFFF':type=='2'?'#262626':''" />
		</div>
		<div class="rightBtn ycsl" v-if="rightText" :style="{color: rightColor}" @click="touchRight">{{rightText}}</div>
		<div class="rightIcon" v-else-if="rightIcon" :style="{'background-image': 'url('+rightIcon+')'}" @click="touchRight">{{rightText}}</div>
	</div>
</template>

<script>
	import {
		Dialog
	} from "vant";
	export default {
		props: {
			title: String,
			rightText: String,
			leftIcon: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: "1"
			},
			rightColor: {
				type: String,
				default: "#000000"
			},
			rightIcon: {
				type: String,
				default: ""
			},
			backName: {
				type: String,
				default: ""
			},
			backParams: {
				type: Object,
				default: {}
			},
			backLevel: {
				type: Number,
				default: 1
			},
		},
		methods: {
			back() {
				if(this.backName){
					this.$router.push({
						name: this.backName,
						params: this.backParams
					})
					this.$emit('back')
				}else{
					this.$router.go(this.backLevel*(-1));
					this.$emit('back')
				}
			},
			touchRight() {
				this.$emit('touchRight')
			}
		},
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		border: 0;
	}

	.navbar {
		height: calc(constant(safe-area-inset-top) + 0.46rem);
		height: calc(env(safe-area-inset-top) + 0.46rem);
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99999;
	}
	
	.type1 {
		background-color: #4477CC;
		color: #FFFFFF;
	}
	
	.type2 {
		background-color: #FFFFFF;
		color: #000000;
	}
	
	.topSafePlace {
		height: constant(safe-area-inset-top);
		height: env(safe-area-inset-top);
		width: 100%;
	}

	.title {
		width: 100%;
		line-height: 0.46rem;
		font-size: 0.18rem;
		text-align: center;
		letter-spacing: 0.1px;
	}

	.leftIcon {
		width: 0.46rem;
		height: 0.46rem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: constant(safe-area-inset-top);
		top: env(safe-area-inset-top);
		left: 0;
	}

	.rightBtn {
		line-height: 0.46rem;
		padding: 0 0.16rem;
		font-size: 0.14rem;
		position: absolute;
		top: constant(safe-area-inset-top);
		top: env(safe-area-inset-top);
		right: 0;
		max-width: 35%;
	}
	
	.rightIcon {
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		position: absolute;
		top: calc(constant(safe-area-inset-top) + 0.13rem);
		top: calc(env(safe-area-inset-top) + 0.13rem);
		right: 0.18rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		height: 0.2rem;
		width: 0.2rem;
	}
</style>
