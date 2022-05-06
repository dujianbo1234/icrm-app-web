<template>
	<div>
		<nav-bar title="客户管理" />
		<div class="modelBox">
			<div class="modelItem" v-for="(item,i) in showMenu" :key="'modelItem'+i" @click="openModel(item)">
				<div class="modelIcon" :style="{'background-image': 'url('+item.icon+')'}"></div>
				<div class="modelName">{{item.name}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				modelList: [{
						name: '存量客户管理',
						icon: require('../../assets/image/cust_main_clkhgl.png'),
						url: '/clCustList'
					},
					{
						name: '潜在客户管理',
						icon: require('../../assets/image/cust_main_qzkhgl.png'),
						url: '/qzCustList'
					},
					{
						name: '营销服务',
						icon: require('../../assets/image/cust_main_yxfw.png'),
						url: ''
					},
					{
						name: '产品到期类',
						icon: require('../../assets/image/cust_main_cpdql.png'),
						url: ''
					},
					{
						name: '统计报表',
						icon: require('../../assets/image/cust_main_tjbb.png'),
						url: '/statisticForm'
					},
					{
						name: '百户长营销活动',
						icon: require('../../assets/image/cust_main_bhzyxhd.png'),
						url: ''
					},
					{
						name: '客户公共池管理',
						icon: require('../../assets/image/cust_main_khggcgl.png'),
						url: ''
					},
					{
						name: '短信审批',
						icon: require('../../assets/image/cust_main_dxsp.png'),
						url: ''
					},
					{
						name: '九数',
						icon: require('../../assets/image/cust_main_js.png'),
						url: ''
					},
					{
						name: '重要潜客',
						icon: require('../../assets/image/cust_main_qzkhgl.png'),
						url: '/impQZCust'
					}
				],
				showMenu: []
			}
		},
		methods: {
			openModel(item) {
				if (!item.url) {
					Toast("功能开发中...");
					return;
				}
				switch (item.name) {
					case "九数":
						break;
					default:
						this.$router.push(item.url)
						break;
				}
			}
		},
		mounted() {
			var menu;
			switch (this.$store.state.userMsg.roleId) {
				case "00000001": // 总行管理员（业务）
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "短信审批", "九数"];
					break;
				case "00000002": // 分行管理员
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "短信审批", "九数"];
					break;
				case "00000003": // 支行管理员
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "短信审批", "客户公共池管理", "九数"];
					break;
				case "00000004": // 客户经理
					menu = ["存量客户管理", "潜在客户管理", "营销服务", "百户长营销活动", "客户公共池管理", "九数"];
					break;
				case "00000005": // 系统管理员（科技）
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "九数"];
					break;
				case "00000006": // 总行领导
					menu = ["存量客户管理", "潜在客户管理", "九数"];
					break;
				case "00000007": // 分行领导
					menu = ["存量客户管理", "潜在客户管理", "九数"];
					break;
				case "00000008": // 二级支行管理员
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "客户公共池管理", "短信审批", "九数"];
					break;
				case "00000009": // 理财经理
					menu = ["存量客户管理", "潜在客户管理", "统计报表", "客户公共池管理", "九数"];
					break;
			}
			menu.push("重要潜客");
			this.showMenu = [];
			menu.forEach((item) => {
				this.showMenu.push(
					this.modelList.find(modelItem => modelItem.name == item)
				)
			})
		}
	}
</script>

<style scoped>
	.modelBox {
		width: 93%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.modelItem {
		width: 47%;
		margin: 0.1rem 0;
	}

	.modelIcon {
		width: 0.8rem;
		height: 0.8rem;
		margin: 0 auto;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 75%;
	}

	.modelName {
		width: 100%;
		text-align: center;
		font-size: 0.17rem;
	}
</style>
