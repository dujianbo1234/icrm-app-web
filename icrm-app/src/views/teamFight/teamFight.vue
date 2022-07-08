<template>
	<div class="home">
		<van-swipe :autoplay="0" indicator-color="#026DFF">
			<van-swipe-item v-for="image in swipeImg" :key="image">
				<img style="width: 100vw;" :src="image" />
			</van-swipe-item>
		</van-swipe>
		<div class="menuBox">
			<div class="menuItem" v-for="(menuItem,i) in mainMenu" v-show="menuItem.show" :key="'mainMenu'+i"
				@click="openModel(menuItem)">
				<div class="menuIcon" :style="{'background-image':'url('+menuItem.icon+')'}"></div>
				<div class="menuName">{{menuItem.title}}</div>
			</div>
		</div>
		<van-empty style="margin-top: 0.5rem;" :image="require('../../assets/image/common_waiting.png')"
			image-size="120" description="页面开发中" />
		<div class="vuNum">
			<span>累计人数：{{useNum?Number(useNum).toLocaleString():"-"}}</span>
			<span>浏览人数：{{visitNum?Number(visitNum).toLocaleString():"-"}}</span>
		</div>
		<div class="bottomLine">
			<div class="bottomText">到底啦，我是有底线的</div>
		</div>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		saveSmAppVisitInfo,
		querySmAppVisitSum
	} from "../../request/market.js";
	export default {
		data() {
			return {
				swipeImg: [
					require('../../assets/image/teamFight_main_swipe1.png'),
					require('../../assets/image/teamFight_main_swipe1.png'),
					require('../../assets/image/teamFight_main_swipe1.png'),
				],
				mainMenu: [{
						title: "团战",
						icon: require('../../assets/image/teamFight_main_tz.png'),
						show: true
					},
					{
						title: "营销中心",
						icon: require('../../assets/image/teamFight_main_yxzx.png'),
						show: true
					},
					{
						title: "考核指标",
						icon: require('../../assets/image/teamFight_main_khzb.png'),
						show: true
					},
					{
						title: "过程管理",
						icon: require('../../assets/image/teamFight_main_gcgl.png'),
						show: true
					},
					{
						title: "业务数据",
						icon: require('../../assets/image/teamFight_main_ywsj.png'),
						show: true
					},
					{
						title: "理财之星",
						icon: require('../../assets/image/teamFight_main_lczx.png'),
						show: true
					},
					{
						title: "基金之星",
						icon: require('../../assets/image/teamFight_main_jjzx.png'),
						show: true
					},
					{
						title: "更多",
						icon: require('../../assets/image/common_menu_more.png'),
						show: true
					}
				],
				visitNum: "",
				useNum: "",
			}
		},
		methods: {
			openModel(val) {
				switch (val.title) {
					// case "重要潜客":
					// 	this.$router.push('./impQZCust');
					// 	break;
					// case "财富客群":
					// 	this.$router.push({
					// 		name: 'business',
					// 		params: {
					// 			pageType: 1
					// 		}
					// 	});
					// 	break;
					default:
						Toast("功能开发中");
						break;
				}
			},
		},
		mounted() {
			saveSmAppVisitInfo({
				busiType: "2"
			}, (res) => {

			});
			querySmAppVisitSum({
				busiType: "2"
			}, (res) => {
				if (res.data) {
					this.visitNum = res.data.visitNum;
					this.useNum = res.data.useNum;
				}
			});
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.home {
		background-color: #FFFFFF;
		margin-top: calc(calc(constant(safe-area-inset-top) + 0.5rem) * -1);
		margin-top: calc(calc(env(safe-area-inset-top) + 0.5rem) * -1);
		padding-bottom: 0.4rem;
		position: relative;
	}

	.menuBox {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.menuItem {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 25%;
	}

	.menuIcon {
		width: 0.24rem;
		height: 0.24rem;
		margin-top: 0.16rem;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.menuName {
		width: 100%;
		height: 0.18rem;
		margin-top: 0.1rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.18rem;
	}

	.bottomLine {
		height: 0.2rem;
		width: 60%;
		margin: -0.1rem auto 0.05rem;
		border-bottom: solid 0.01rem #F4F4F4;
		position: relative;
		display: flex;
		justify-content: center;
	}

	.bottomText {
		font-size: 0.12rem;
		padding: 0 0.1rem;
		color: #D8D8D8;
		background-color: #FFFFFF;
		position: absolute;
		bottom: -50%;
	}

	.vuNum {
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		height: 0.44rem;
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		padding: 0 3.2%;
	}
</style>
