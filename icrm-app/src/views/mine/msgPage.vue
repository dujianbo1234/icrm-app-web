<template>
	<div>
		<nav-bar title="提醒消息" leftIcon />
		<div class="modelBox">
			<div class="modelItem" v-for="(item,i) in showMenu" :key="'modelItem'+i" @click="openModel(item)">
				<div class="modelIcon" :style="{'background-image': 'url('+item.icon+')'}"></div>
				<div class="modelName">{{item.codeName}}</div>
				<div class="modelValue" v-if="item.value!='0'">{{item.value}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryWarningRmdMgtSum
	} from "../../request/product.js";
	export default {
		data() {
			return {
				showMenu: [],
			}
		},
		methods: {
			openModel(item) {
				Toast("功能开发中...");
			}
		},
		mounted() {
			getSysCodeByType({
				codeType: "evtype"
			}, (res1) => {
				if (res1.data) {
					this.showMenu = res1.data;
					queryWarningRmdMgtSum({
						stat: "0"
					}, (res2) => {
						if (res2.data) {
							for (let item of this.showMenu) {
								switch (item.codeValue) {
									case "EV100000":
										item.value = res2.data[0].serviceCareNum;
										item.icon = require("../../assets/image/mine_msgPage_khdttx.png");
										break;
									case "EV200000":
										item.value = res2.data[0].productExpireNum;
										item.icon = require("../../assets/image/mine_msgPage_cpdqtx.png");
										break;
									case "EV300000":
										item.value = res2.data[0].acctChangeNum;
										item.icon = require(
											"../../assets/image/mine_msgPage_dezrzctx.png");
										break;
									case "EV400000":
										item.value = res2.data[0].custChangeNum;
										item.icon = require(
											"../../assets/image/mine_msgPage_khsjjbdtx.png");
										break;
									case "EV500000":
										item.value = res2.data[0].riskNum;
										item.icon = require("../../assets/image/mine_msgPage_dkyjtx.png");
										break;
								}
							}
						}
					})
				}
			})
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

	.modelBox {
		width: 93%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
	}

	.modelItem {
		width: calc(100% / 3);
		padding: 0 1.5%;
		margin: 0.1rem 0;
		position: relative;
	}

	.modelIcon {
		width: 0.8rem;
		height: 0.8rem;
		margin: 0 auto;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 60%;
	}

	.modelName {
		width: 100%;
		text-align: center;
		font-size: 0.13rem;
	}

	.modelValue {
		position: absolute;
		top: 6%;
		left: 61%;
		font-size: 0.12rem;
		color: #FFFFFF;
		background-color: #FF5555;
		height: 0.22rem;
		line-height: 0.22rem;
		padding: 0.01rem 0.04rem;
		border-radius: 0.11rem;
		min-width: 0.22rem;
	}
</style>
