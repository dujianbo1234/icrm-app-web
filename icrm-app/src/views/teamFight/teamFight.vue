<template>
	<div class="home">
		<van-swipe :autoplay="0" indicator-color="#026DFF">
			<van-swipe-item v-for="image in swipeImg" :key="image">
				<img style="width: 100vw;" :src="image" />
			</van-swipe-item>
		</van-swipe>
		<div class="menuBox">
			<div class="menuItem" v-for="(menuItem,i) in mainMenu" v-show="mainMenu.show" :key="'mainMenu'+i"
				@click="openModel(menuItem)">
				<div class="menuIcon" :style="{'background-image':'url('+menuItem.icon+')'}"></div>
				<div class="menuName">{{menuItem.title}}</div>
			</div>
		</div>
	</div>
</template>

<script>
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
	}

	.menuBox {
		margin: 0 auto 0.11rem;
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

	:deep(.van-notice-bar) {
		margin: 0 3%;
		padding: 0 0.05rem;
		border: solid 0.01rem #F7F7F7;
		font-size: 0.13rem;
		border-radius: 0.02rem;
	}
</style>
