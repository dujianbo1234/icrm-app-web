<template>
	<!-- <router-view /> -->
	<router-view v-slot='{Component}'>
		<keep-alive>
			<component :is='Component' :key="$route.name" v-if="$route.meta.keepAlive" />
		</keep-alive>
		<component :is='Component' :key="$route.name" v-if="!$route.meta.keepAlive" />
	</router-view>

	<van-tabbar v-if="showTabbar" v-model="active" route fixed safe-area-inset-bottom active-color="#026DFF"
		placeholder>
		<van-tabbar-item v-for="(tabbarItem, index) in tabbarList" :key="'tabbarItem' + index" replace
			:to="tabbarItem.url">
			{{ tabbarItem.value }}
			<template #icon="props">
				<img :src="index == active ? tabbarItem.act_icon : tabbarItem.icon" />
			</template>
		</van-tabbar-item>
	</van-tabbar>
</template>

<script>
	export default {
		data() {
			return {
				tabbarList: [{
						name: "index",
						value: "首页",
						url: "/index",
						icon: require("../assets/image/tabbar_index.png"),
						act_icon: require("../assets/image/tabbar_index_a.png"),
					},
					{
						name: "teamFight",
						value: "数据",
						url: "/teamFight",
						icon: require("../assets/image/tabbar_teamFight.png"),
						act_icon: require("../assets/image/tabbar_teamFight_a.png"),
					},
					{
						name: "cust",
						value: "营销",
						url: "/cust",
						icon: require("../assets/image/tabbar_cust.png"),
						act_icon: require("../assets/image/tabbar_cust_a.png"),
					},
					{
						name: "business",
						value: "商机",
						url: "/business",
						icon: require("../assets/image/tabbar_business.png"),
						act_icon: require("../assets/image/tabbar_business_a.png"),
					},
					{
						name: "mine",
						value: "我的",
						url: "/mine",
						icon: require("../assets/image/tabbar_mine.png"),
						act_icon: require("../assets/image/tabbar_mine_a.png"),
					},
				],
				active: 0,
				showTabbar: true,
			};
		},
		beforeRouteUpdate(to, from, next) {
			let index = this.tabbarList.indexOf(
				this.tabbarList.find((item) => item.name == to.name)
			);
			if (index < 0) {
				this.showTabbar = false;
			} else {
				this.active = index;
				this.showTabbar = true;
			}
			next();
		},
		// watch: {
		// 	$route() {
		// 		let index = this.tabbarList.indexOf(this.tabbarList.find(item => item.name == this.$route.name));
		// 		if (index < 0) {
		// 			this.showTabbar = false;
		// 		} else {
		// 			this.active = index;
		// 			this.showTabbar = true;
		// 		}
		// 	}
		// }
	};
</script>

<style scoped>
	* {
		user-select: none;
	}
</style>
