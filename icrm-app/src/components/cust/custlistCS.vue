<template>
	<div class="home">
		<div class="custBtnType"></div>
		<van-popup v-model:show="show" v-if="show" duration="0" position="bottom" :style="{ height: '100%' }" z-index="99999"
			teleport="#app" :overlay="false">
			<div class="topZW"></div>
			<van-search class="searchBox" shape="round" v-model="searchValue" show-action placeholder="请输入客户经理姓名或工号"
				@search="search">
				<template #action>
					<div @click="search" style="color: #026DFF;font-weight: 500;margin: 0 0.05rem;">搜索</div>
				</template>
				<template #left>
					<van-icon name="arrow-left" size="20" style="margin-right: 0.1rem;" @click="cancle" />
				</template>
			</van-search>
			<div class="topFixed">
				<div class="titleTop"></div>
				<div class="itemTitle">
					<div class="itemTitle1">姓名</div>
					<div class="itemTitle2">工号</div>
					<div class="itemTitle3">归属机构</div>
				</div>
			</div>
			<div class="topZW2"></div>
			<div class="listBox">
				<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getCustList">
					<div class="itemTitle" v-for="(item,i) in custList" :key="'item'+i" @click="checkCust(item)">
						<div class="itemTitle1 ycsl">{{item.empName}}</div>
						<div class="itemTitle2">{{item.empId}}</div>
						<div class="itemTitle3 ycsl">{{item.orgName}}</div>
					</div>
				</van-list>
			</div>
		</van-popup>
		<van-overlay :show="showFP" z-index="1000000">
			<div class="plate6">
				<div class="plate6_5">是否分配给该客户经理？</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showFP=false">取消</div>
					<div class="palte6_4_2" @click="checkFP">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		queryCustManagerList
	} from "../../request/custinfo.js";
	import {
		Toast,
		Dialog
	} from "vant";
	export default {
		props: {
			orgId: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				show: false,
				custList: [],
				searchValue: "",
				pageIndex: 0,
				chooseCust: {},
				loading: false,
				finished: false,
				showFP: false,
				checkCustom: {},
			}
		},
		methods: {
			showPopup() {
				if (this.searchValue) {
					this.show = true;
				} else {
					this.search();
					this.show = true;
				}
			},
			cancle() {
				this.show = false;
				this.$emit("close");
			},
			checkCust(item) {
				this.checkCustom = item;
				this.showFP = true;
			},
			checkFP() {
					this.chooseCust = this.checkCustom;
					this.showFP = false;
					this.cancle();
					this.$emit("activeCust", this.checkCustom)
			},
			search() {
				this.pageIndex = 0;
				this.finished = false;
				this.custList = [];
				this.chooseCust = {};
				this.getCustList();
			},
			getCustList() {
				this.pageIndex++;
				this.loading = true;
				var params = {
					empId: "",
					empName: "",
					pageSize: "20",
					pageNum: this.pageIndex.toString(),
					orgId: this.orgId
				}
				if (Number(this.searchValue)) {
					params.empName = "";
					params.empId = this.searchValue;
				} else {
					params.empName = this.searchValue;
					params.empId = "";
				}
				queryCustManagerList(params, (res) => {
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
		},
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.topZW {
		width: 100%;
		height: constant(safe-area-inset-top);
		height: env(safe-area-inset-top);
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
		height: 0.47rem;
		padding-left: 3.5%;
		padding-right: 2%;
		padding-top: 0;
		border-bottom: solid 1px #EFEFEF !important;
	}

	.listBox {
		margin-top: 0rem;
		height: calc(100% - constant(safe-area-inset-top) - 1.12rem);
		height: calc(100% - env(safe-area-inset-top) - 1.12rem);
		background-color: #FFFFFF;
		overflow: auto;
	}

	.topFixed {
		width: 100%;
		position: absolute;
		z-index: 9;
	}

	.topZW2 {
		width: 100%;
		background-color: #FFFFFF;
		height: 0.65rem;
	}

	.titleTop {
		width: 100%;
		height: 0.1rem;
		background-color: #F8F8F8;
	}

	.itemTitle {
		display: flex;
		align-items: center;
		font-size: 0.17rem;
		height: 0.55rem;
		padding-left: 0.1rem;
		width: 94%;
		margin: 0 auto 0;
		border-bottom: solid 1px #EEEEEE;
		background-color: #FFFFFF;
	}

	.itemTitle1 {
		width: 20%;
		text-align: left;
	}

	.itemTitle2 {
		width: 40%;
		text-align: center;
	}

	.itemTitle3 {
		width: 40%;
		text-align: center;
	}

	.plate6 {
		width: 74.7%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		position: absolute;
		top: calc(50% - 1rem);
		left: 12.65%;
		padding: 0.2rem 0.12rem;
	}

	.plate6_4 {
		width: 100%;
		height: 0.3rem;
		margin-top: 0.24rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
	}

	.palte6_4_1 {
		width: 1.08rem;
		height: 0.3rem;
		border: 0.01rem solid #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #026DFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.palte6_4_2 {
		width: 1.08rem;
		height: 0.3rem;
		background: #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #FFFFFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.plate6_5 {
		width: 100%;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 400;
		margin-bottom: 0.28rem;
		margin-top: 0.15rem;
	}
</style>
