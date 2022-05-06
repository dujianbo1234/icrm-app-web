<template>
	<div class="home">
		<nav-bar title="商机列表" :rightText="sjxg?'商机效果':''" @touchRight="touchRight"/>
		<van-dropdown-menu class="topMenu" :close-on-click-outside="false" active-color="#1989FA">
			<van-dropdown-item v-model="sjBigValue" :options="sjBigList" :title="sjBigValue?'':'商机大类'"
				@change="changeSJBigValue" />
			<van-dropdown-item v-model="sjSmallValue" :options="sjSmallList" :title="sjSmallValue?'':'商机细类'"
				@change="reload" />
			<van-dropdown-item v-model="sjTypeValue" :options="sjTypeList" @change="reload" />
		</van-dropdown-menu>
		<van-search class="searchBox" v-model="searchValue" show-action placeholder="输入 客户姓名 查询" @search="reload">
			<template #action>
				<div @click="reload">搜索</div>
			</template>
		</van-search>
		<div class="listNum">
			<div class="allNum">
				<span>筛选结果：</span>
				<span style="color: #0088FF;">{{allNum}}</span>
				<span> 条数据</span>
			</div>
			<!-- <div class="sendAll" v-if="msgOrPhone&&$store.state.userMsg.roleId=='00000004'" @click="showBatchSend=!showBatchSend"> -->
			<div class="sendAll" v-if="msgOrPhone&&$store.state.userMsg.roleId=='00000004'" @click="gaveMessage">
				<van-icon name="invitation" style="margin-right: 0.02rem;" v-show="!showBatchSend" />
				<span v-if="showBatchSend">取消</span>
				<span v-else>批量发送</span>
			</div>
			<div v-else></div>
		</div>
		<div style="width: 100%;height: 1.46rem;"></div>
		<van-checkbox-group v-model="chooseItems">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :offset="10"
				@load="getSJList">
				<div class="msgItem" v-for="(item,i) in sjList" :key="'custItem'+i">
					<div class="msgItem1" v-show="showBatchSend">
						<van-checkbox :name="item" ref="checkboxes" />
					</div>
					<div class="msgItem2">
						<div class="msgItem2_1">
							<div class="msgItem2_1_1">{{item.cmrcOpptNm.split("+")[0]}}</div>
							<div class="msgItem2_1_2">{{item.custName}}</div>
						</div>
						<div class="msgItem2_2">{{item.cmrcOpptPdNm||"-"}}</div>
						<div class="msgItem2_3">跟进人：{{item.followUpPrsnNm}}({{item.belongOrg}})</div>
					</div>
					<div class="msgItem3" v-if="msgOrPhone">
						<div @click="gaveCall(item.ctcTel)"
							:style="{'background-image': 'url('+require('../../assets/image/common_phone.png')+')'}">
						</div>
						<div @click="gaveMessage(item)"
							:style="{'background-image': 'url('+require('../../assets/image/common_message.png')+')'}">
						</div>
						<div class="msgItemDate">
							{{item.cmrcOpptExpDay.slice(0, 4)}}-{{item.cmrcOpptExpDay.slice(4, 6)}}-{{item.cmrcOpptExpDay.slice(6,8)}}
						</div>
					</div>
					<div class="msgItem3" v-else>
						<div class="msgItemDate">
							{{item.cmrcOpptExpDay.slice(0, 4)}}-{{item.cmrcOpptExpDay.slice(4, 6)}}-{{item.cmrcOpptExpDay.slice(6,8)}}
						</div>
					</div>
					<div class="msgItem4">
						<div v-if="$store.state.userMsg.roleId=='00000004'">
							<div class="msgItemType" v-if="item.followUpLab=='2'" style="background-color: #CC3333;">待跟进
							</div>
							<div class="msgItemType" v-if="item.followUpLab=='4'" style="background-color: #33AA33;">已跟进
							</div>
						</div>
						<div v-else>
							<div class="msgItemType" v-if="item.alctLab=='1'" style="background-color: #CC3333;">待分配
							</div>
							<div class="msgItemType" v-if="item.alctLab=='2'" style="background-color: #33AA33;">已分配
							</div>
						</div>
					</div>
					<div class="msgItem5" @click="goCustView(item)" v-show="!showBatchSend">
						<van-icon name="arrow" size="20" color="#666666" />
					</div>
				</div>
			</van-list>
		</van-checkbox-group>
		<div style="height: calc(constant(safe-area-inset-bottom) + 0.6rem);height: calc(env(safe-area-inset-bottom) + 0.6rem);"
			v-show="showBatchSend"></div>
		<div class="sendMsgBtnBox" v-show="showBatchSend">
			<div class="sendMsgBtn" @click="msgBatchSend(true)">全部发送</div>
			<div class="sendMsgBtn" @click="msgBatchSend(false)">批量发送</div>
		</div>
	</div>
</template>

<script>
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryCommercialOpportunityList
	} from "../../request/market.js";
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				sjBigValue: "",
				sjBigList: [],
				sjSmallValue: "",
				sjSmallList: [],
				sjTypeValue: "",
				sjTypeList: [],
				searchValue: "",
				loading: true,
				finished: false,
				pageIndex: 0,
				sjList: [],
				allNum: "0",
				msgOrPhone: false,
				showBatchSend: false,
				chooseItems: [],
				params: "",
				sjxg: false,
			}
		},
		methods: {
			changeSJBigValue(val) {
				this.sjSmallValue = "";
				if (val) {
					getSysCodeByType({
						codeType: "CMRC_OPPT_STY"
					}, (res) => {
						if (res.data) {
							var allSmallList = res.data.map((item) => {
								return {
									text: item.codeName,
									value: item.codeValue
								}
							})
							this.sjSmallList = [{
									text: "全部",
									value: ""
								},
								...allSmallList.filter(item => item.value.substring(0, 5) == val)
							]
						} else {
							Toast.fail("商机大类列表数据为空")
						}
					})
				} else {
					this.sjSmallList = []
				};
				this.reload();
			},
			getSJList() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				let params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					custName: this.searchValue,
					alctLab: this.$store.state.userMsg.roleId == "00000004" ? "" : this.sjTypeValue,
					followUpLab: this.$store.state.userMsg.roleId == "00000004" ? this.sjTypeValue : "",
					cmrcOpptBclass: this.sjBigValue,
					cmrcOpptSubclass: this.sjSmallValue
				}
				this.params = JSON.stringify(params);
				queryCommercialOpportunityList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.allNum = res.data.total.toLocaleString();
						this.sjList = this.sjList.concat(res.data.records);
						if (this.sjList.length >= this.allNum) this.finished = true;
					} else {
						Toast.fail("存量客户列表数据为空");
						this.finished = true;
					}
					this.loading = false;
				})
			},
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.chooseOrg = orgValue
				} else {
					this.chooseOrg = {
						text: "选择机构",
						value: ""
					}
				};
				this.$refs.orgDrop.toggle(false);
				this.reload();
			},
			reload() {
				this.loading = true
				this.finished = false;
				this.pageIndex = 0;
				this.sjList = [];
				this.showBatchSend = false;
				this.getSJList();
			},
			gaveCall(phone) {
				AlipayJSBridge.call('callHandler', {
					phone
				});
			},
			gaveMessage() {
				Toast("功能开发中...");
			},
			goCustView(item) {
				Toast("功能开发中...");
			},
			msgBatchSend(sendAll) {
				Toast("功能开发中...");
			},
			closeOrg() {
				this.$refs.orgDrop.toggle(false)
			},
			touchRight() {
				Toast("功能开发中...");
			}
		},
		mounted() {
			this.msgOrPhone = this.$store.state.userMsg.orgClass != "90000001";
			this.sjxg = this.$store.state.userMsg.roleId != "00000006" && this.$store.state.userMsg.roleId != "00000007";
			getSysCodeByType({
				codeType: "CMRC_OPPT_BT"
			}, (res) => {
				if (res.data) {
					this.sjBigList = [{
						text: "全部",
						value: ""
					}, ...res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue
						}
					})]
				} else {
					Toast.fail("商机大类列表数据为空")
				}
			});
			// 定义 跟进|分配 状态列表
			if (this.$store.state.userMsg.roleId == '00000004') {
				this.sjTypeList = [{
					text: "待跟进",
					value: "2"
				}, {
					text: "已跟进",
					value: "4"
				}];
				this.sjTypeValue = "2";
			} else {
				this.sjTypeList = [{
					text: "待分配",
					value: "1"
				}, {
					text: "已分配",
					value: "2"
				}];
				this.sjTypeValue = "1";
			}
			var oldParams = JSON.parse(localStorage.getItem("oldParams"));
			if (oldParams) {

			} else {

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

	.topMenu {
		width: 100%;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 0.46rem);
		top: calc(env(safe-area-inset-top) + 0.46rem);
		left: 0;
		z-index: 3;
	}

	.searchBox {
		width: 100%;
		background-color: #FFFFFF;
		height: 0.5rem;
		padding-left: 3.5%;
		padding-right: 2%;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 1rem);
		top: calc(env(safe-area-inset-top) + 1rem);
		left: 0;
		z-index: 2;
	}

	.listNum {
		font-size: 0.14rem;
		line-height: 0.4rem;
		width: 100%;
		height: 0.4rem;
		padding: 0 3.5%;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 1.5rem);
		top: calc(env(safe-area-inset-top) + 1.5rem);
		left: 0;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		background-color: #F5F6FA;
		z-index: 1;
	}

	.sendAll {
		color: #0088FF;
	}

	.msgItem {
		width: 93%;
		margin: 0 auto 0.1rem;
		padding: 0.03rem 0 0.03rem 0.11rem;
		background-color: #FFFFFF;
		border-radius: 0.05rem;
		display: flex;
		box-shadow: 0rem 0rem 0.06rem -0.04rem #888888;
		text-align: left;
		position: relative;
	}

	.msgItem * {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.msgItem1 {
		width: 8%;
		display: flex;
		text-align: center;
		align-items: center;
		flex-shrink: 0;
	}

	.msgItem2 {
		width: 67%;
		margin-right: 5%;
		line-height: 0.2rem;
		font-size: 0.13rem;
		color: #666666;
		padding: 0.1rem 0;
		flex-shrink: 0;
	}

	.msgItem2_1 {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.msgItem2_1_1 {
		color: #333333;
		font-weight: 600;
		font-size: 0.15rem;
	}

	.msgItem2_1_2 {
		font-size: 0.13rem;
		padding: 0 0.06rem;
		border: solid 1px #FFBBAA;
		color: #FF5544;
		background-color: #FFE8D8;
		border-radius: 0.03rem;
	}

	.msgItem2_2 {
		font-size: 0.13rem;
	}

	.msgItem2_3 {
		font-size: 0.13rem;
	}

	.msgItem3 {
		width: 20%;
		padding: 0.1rem 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		flex-shrink: 0;
		overflow: visible;
	}

	.msgItem3>div {
		width: 48%;
		height: 50%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 85%;
	}

	.msgItem3>.msgItemDate {
		width: 100%;
		font-size: 0.13rem;
		height: 30%;
		overflow: visible;
		white-space: nowrap;
	}

	.msgItem4 {
		position: absolute;
		top: 0;
		right: 0;
	}

	.msgItemType {
		font-size: 0.12rem;
		color: #FFFFFF;
		border-top-right-radius: 0.05rem;
		border-bottom-left-radius: 0.05rem;
		padding: 0.01rem 0.05rem;
	}

	.msgItem5 {
		width: 8%;
		display: flex;
		text-align: center;
		align-items: center;
		flex-shrink: 0;
	}

	.sendMsgBtnBox {
		width: 100%;
		border-top: solid 1px #DFEFFF;
		height: calc(constant(safe-area-inset-bottom) + 0.6rem);
		height: calc(env(safe-area-inset-bottom) + 0.6rem);
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		padding-left: 3.5%;
		padding-right: 3.5%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.sendMsgBtn {
		width: 42.5%;
		line-height: 0.35rem;
		font-size: 0.15rem;
		border: solid 1px #3399FF;
		background-color: #e2f7ff;
		color: #3399FF;
		text-align: center;
		border-radius: 1.599147rem;
	}
</style>
