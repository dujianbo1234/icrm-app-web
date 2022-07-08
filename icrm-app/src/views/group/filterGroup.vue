<template>
	<div class="home">
		<nav-bar title="条件群组" type="2" leftIcon />
		<van-tabs v-model:active="active" scrollspy sticky>
			<van-tab v-for="(filterItem,i) in filterList" :key="'filterItem'+i" :title="filterItem.value">
				<div class="plateTitle">{{filterItem.title}}</div>
				<div class="filterItemBox">
					<div class="filterEmpty" v-if="!filterItem.list.length">
						—— 暂无可筛选指标 ——
					</div>
					<div class="filterItem" v-for="(filterItemChild,j) in filterItem.list" :key="'filterItemChild'+j"
						:class="activeChild.code==filterItemChild.code?'filterItem_a':''"
						@click="checkChild(filterItemChild)">
						{{filterItemChild.title}}
					</div>
				</div>
				<div v-if="i==filterList.length-1">
					<div style="height: 0.58rem;"></div>
					<div class="bottomZW"></div>
				</div>
			</van-tab>
		</van-tabs>
		<div class="bottomCard">
			<div class="bottomCard1">
				已选<span style="color: #026DFF;">{{5}}</span>项
			</div>
			<div class="bottomCard2">
				<div class="bottomCard1_1">
					已筛选<span style="color: #026DFF;">{{5}}</span>位客户
				</div>
				<div class="bottomCard1_2">确定</div>
			</div>
		</div>
		<van-popup v-model:show="defaultShow" position="bottom" :style="{ height: '60%' }" round :lock-scroll="false"
			:close-on-click-overlay="true" close-on-popstate>
			<div class="popupTitle">{{activeChild.title}}</div>
			<div class="childListOutBox">
				<div class="childListBox">
					<div class="childRemark">{{activeChild.remark}}</div>
					<div class="childListItem" v-for="(childListItem,i) in activeChild.list"
						:key="'childListItem'+i">
						{{childListItem.title}}
					</div>
				</div>
			</div>
			<div class="btnBox">
				<div class="btnItem btnItem1" @click="defaultShow=false">取消</div>
				<div class="btnItem btnItem2" @click="defaultConfirm">确定</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		filterList
	} from "./filterGroup.js";
	export default {
		data() {
			return {
				filterList: filterList,
				active: 0,
				activeChild: {},
				defaultShow: false,
			}
		},
		watch: {
			defaultShow() {
				if(!this.defaultShow) {
					this.activeChild = {}
				}
			}
		},
		methods: {
			checkChild(child) {
				this.activeChild = child;
				switch (child.code) {
					// case "01010000":
					// 	break;
					default:
						this.defaultShow = true;
						break;
				}
			},
			defaultConfirm() {
				alert("选定条件");
				this.defaultShow = false;
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
		height: calc(100vh - calc(constant(safe-area-inset-top) + 0.45rem));
		height: calc(100vh - calc(env(safe-area-inset-top) + 0.45rem));
		overflow-x: hidden;
		overflow-y: auto;
		padding-left: 26.67%;
	}

	:deep(.van-tabs) {
		display: flex;
		flex-wrap: nowrap;
	}

	:deep(.van-tabs>div:first-child) {
		width: 26.67%;
		position: fixed;
		left: 0;
	}

	:deep(.van-tabs__wrap) {
		height: auto;
	}

	:deep(.van-tabs__nav) {
		flex-wrap: wrap;
		padding: 0.27rem 0 0 !important;
		background-color: transparent;
	}

	:deep(.van-tab) {
		width: 100%;
		height: 0.37rem;
		line-height: 0.37rem;
		text-align: center;
		white-space: nowrap;
		padding: 0;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
	}

	:deep(.van-tab--active) {
		background-color: #FFFFFF;
		color: #026DFF;
	}

	:deep(.van-tabs__line) {
		display: none;
	}

	:deep(.van-tabs__content) {
		width: 100% !important;
		background-color: #FFFFFF;
	}

	:deep(.van-tab__panel) {
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.bottomCard {
		width: 100%;
		height: calc(0.58rem + constant(safe-area-inset-bottom));
		height: calc(0.58rem + env(safe-area-inset-bottom));
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
		border-top: solid 0.01rem #F5F5F5;
		position: fixed;
		bottom: 0;
		left: 0;
		padding-left: 0.25rem;
		padding-right: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.bottomCard1 {
		height: 0.2rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.2rem;
	}

	.bottomCard2 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.bottomCard1_1 {
		margin-right: 0.11rem;
		height: 0.2rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.2rem;
	}

	.bottomCard1_2 {
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 0.4rem;
	}

	.plateTitle {
		width: 100%;
		height: 0.48rem;
		border-bottom: solid 0.01rem #F5F5F5;
		padding: 0 0.14rem;
		line-height: 0.48rem;
		text-align: left;
		font-size: 0.17rem;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #262626;
	}

	.filterItemBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 0.06rem 0;
	}

	.filterItem {
		width: 44%;
		margin: 0.06rem 0 0.06rem 4%;
		padding: 0 0.1rem;
		height: 0.4rem;
		background: #F5F5F5;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.filterItem_a {
		background: #F2F8FF;
		color: #026DFF;
	}

	.popupTitle {
		width: 100%;
		height: 0.52rem;
		padding: 0 0.18rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		/* margin-bottom: 0.1rem; */
	}

	.childRemark {
		width: 100%;
		margin: 0.05rem 0;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.19rem;
		text-align: left;
	}
	
	.childListOutBox {
		width: 100%;
		padding: 0.07rem 0.14rem 0 0.2rem;
		height: calc(100% - 1.28rem - constant(safe-area-inset-bottom));
		height: calc(100% - 1.28rem - env(safe-area-inset-bottom));
	}

	.childListBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.childListItem {
		min-width: calc(25% - 0.08rem);
		height: 0.35rem;
		background: #F5F5F5;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		margin: 0 0.08rem 0.12rem 0;
		padding: 0 0.1rem;
	}
	
	.btnBox {
		width: 100;
		height: 0.76rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
	
	.btnItem {
		width: 0.88rem;
		height: 0.4rem;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 0.4rem;
		margin: 0 0.12rem;
	}
	
	.btnItem1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}
	
	.btnItem2 {
		background: #026DFF;
		color: #FFFFFF;
		
	}
	
	.filterEmpty {
		width: 100%;
		height: 0.4rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #D8D8D8;
		line-height: 0.4rem;
		text-align: center;
	}
</style>
