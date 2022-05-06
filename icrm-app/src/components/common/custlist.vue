<template>
	<div>
		<div class="custBtnType"></div>
		<van-popup v-model:show="show" position="bottom" :style="{ height: '70%' }" teleport="#app" :overlay="overlay">
			<van-search class="searchBox" v-model="searchValue" show-action placeholder="请输入搜索关键词" @search="search">
				<template #action>
					<div @click="cancle">取消</div>
				</template>
			</van-search>
			<div class="listBox">
				<div class="chooseAll" @click="checkAll">查看全部</div>
				<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getCustList">
					<div class="custItem" :class="item.custManagerID==chooseCust.custManagerID?'custItem_a':''"
						v-for="(item,i) in custList" :key="'item'+i" @click="checkCust(item)">
						<div class="leftIcon"></div>
						<div class="rightMsg">
							<div class="topMsg">
								<div class="custName">{{item.custManagerName}}</div>
								<div class="custId">工号：{{item.custManagerID}}</div>
							</div>
							<div class="custOrg">归属机构：{{item.custManagerOrgName}}</div>
						</div>
					</div>
				</van-list>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		queryCustManagers
	} from "../../request/custinfo.js";
	import {
		Toast
	} from "vant";
	export default {
		props: {
			orgId: {
				type: String,
				default: ""
			},
			overlay: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				show: false,
				custList: [],
				searchValue: "",
				pageIndex: 0,
				chooseCust: {},
				loading: true,
				finished: false,
			}
		},
		methods: {
			showPopup() {
				if (this.searchValue) {
					this.show = true;
				} else {
					this.clear();
					this.show = true;
					this.loading = false;
				}
			},
			cancle() {
				this.show = false;
				this.$emit("close");
			},
			clear() {
				this.searchValue = "";
				this.pageIndex = 0;
				this.loading = true;
				this.finished = false;
				this.custList = [];
				this.chooseCust = {};
			},
			checkCust(item) {
				this.chooseCust = item;
				this.cancle();
				this.$emit("activeCust", item);
			},
			checkAll() {
				this.clear();
				this.cancle();
				this.$emit("activeCust", {});
			},
			search() {
				this.pageIndex = 0;
				this.loading = true;
				this.finished = false;
				this.custList = [];
				this.chooseCust = {};
				this.getCustList();
			},
			getCustList() {
				this.pageIndex++;
				this.loading = true;
				queryCustManagers({
					custManager: this.searchValue,
					pageSize: "20",
					pageNum: this.pageIndex.toString(),
					orgID: this.orgId
				}, (res) => {
					if (res && res.code == 0 && res.data && res.data.records) {
						if (res.data.records.length) {
							this.custList = this.custList.concat(res.data.records);
						} else {
							Toast.fail("未获取到客户经理信息");
						}
						if (this.custList.length >= res.data.total) this.finished = true;
					} else {
						Toast.fail("获取客户经理信息失败");
					}
					this.loading = false;
				})
			}
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

	.custBtnType {
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.searchBox {
		width: 100%;
		background-color: #FFFFFF;
		height: 0.5rem;
		padding-left: 3.5%;
		padding-right: 2%;
		border-bottom: solid 1px #EFEFEF !important;
	}

	.listBox {
		margin-top: 0rem;
		height: calc(100% - 0.5rem);
		background-color: #FFFFFF;
		overflow: auto;
	}

	.chooseAll {
		width: 100%;
		font-size: 0.16rem;
		border-bottom: solid 1px #F5F5F5;
		line-height: 0.45rem;
		text-align: center;
		color: #0088FF;
	}

	.custItem {
		width: 95%;
		margin: 0 auto;
		font-size: 0.16rem;
		border-bottom: solid 1px #DFDFDF;
		padding: 0.1rem;
		text-align: left;
		color: #333333;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.custItem_a {
		background-color: #DFDFDF;
	}

	.leftIcon {
		width: 0.25rem;
		height: 0.25rem;
		margin: 0 0.15rem 0 0.02rem;
		background-image: url(../../assets/image/child_custlist_searchUser.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.rightMsg {
		width: calc(100% - 0.35rem);
	}

	.topMsg {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}

	.custName {
		width: 35%;
		font-size: 0.16rem;
		font-weight: 500;
		color: #555555;
	}

	.custId {
		font-size: 0.15rem;
		color: #666666;
	}

	.custOrg {
		font-size: 0.15rem;
		color: #666666;
		margin-top: 0.02rem;
	}
</style>
