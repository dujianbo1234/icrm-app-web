<template>
	<div class="home">
		<nav-bar title="存量客户列表" leftIcon />
		<van-dropdown-menu class="topMenu" :close-on-click-outside="false" active-color="#1989fa">
			<van-dropdown-item v-model="cstLvl" :options="cstLvlList" :title="cstLvl?'':'AUM等级'" @change="reload" />
			<van-dropdown-item v-model="svcLvl" :options="svcLvlList" :title="svcLvl?'':'服务等级'" @change="reload" />
			<van-dropdown-item v-if="$store.state.userMsg.roleId!='00000004'" ref="orgDrop" :title="chooseOrg.text" @open="$refs.orgList.showPopup()"
				@close="$refs.orgList.cancle()" />
		</van-dropdown-menu>
		<van-search class="searchBox" v-model="searchValue" show-action placeholder="输入 客户姓名/手机号码/身份证号码 查询"
			@search="reload">
			<template #action>
				<div @click="reload">搜索</div>
			</template>
		</van-search>
		<div class="listNum">
			<div class="allNum">
				<span>筛选结果：客户数 </span>
				<span style="color: #0088FF;">{{allNum}}</span>
				<span> 人</span>
			</div>
			<div class="sendAll" v-if="msgOrPhone" @click="showBatchSend=!showBatchSend">
				<van-icon name="invitation" style="margin-right: 0.02rem;" v-show="!showBatchSend" />
				<span v-if="showBatchSend">取消</span>
				<span v-else>批量发送</span>
			</div>
			<div v-else></div>
		</div>
		<div style="width: 100%;height: 1.4rem;"></div>
		<org-list ref="orgList" type="2" :overlay="false" @close="closeOrg" @activeOrg="activeOrg" />
		<van-checkbox-group v-model="chooseItems">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :offset="10"
				@load="getCustList">
				<div class="msgItem" v-for="(item,i) in custList" :key="'custItem'+i">
					<div class="msgItem1" v-show="showBatchSend">
						<van-checkbox :name="item" ref="checkboxes" />
					</div>
					<div class="msgItem2">
						<div style="color: #333333;font-weight: 600;font-size: 0.17rem;">{{item.cstName}}</div>
						<div>客户经理：{{item.belgCustMgrNm}}</div>
					</div>
					<div class="msgItem3" v-if="msgOrPhone">
						<div @click="gaveCall(item.ctcTel)"
							:style="{'background-image': 'url('+require('../../assets/image/common_phone.png')+')'}">
						</div>
						<div @click="gaveMessage(item)"
							:style="{'background-image': 'url('+require('../../assets/image/common_message.png')+')'}">
						</div>
					</div>
					<div class="msgItem4">
						<div>{{item.belongOrgNm}}</div>
						<div>AUM等级:{{item.cstLvl}}</div>
						<div>服务等级:{{item.svcLvl}}</div>
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
		queryCustSearchList
	} from "../../request/custinfo.js"
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				cstLvl: "",
				cstLvlList: [],
				svcLvl: "",
				svcLvlList: [],
				chooseOrg: {
					text: "归属机构",
					value: ""
				},
				searchValue: "",
				loading: true,
				finished: false,
				pageIndex: 0,
				custList: [],
				allNum: "0",
				msgOrPhone: false,
				showBatchSend: false,
				chooseItems: [],
				params: ""
			}
		},
		methods: {
			getCustList() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				let params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					cstName: "",
					ctcTel: "",
					certNum: "",
					cstLvl: this.cstLvl,
					svcLvl: this.svcLvl,
					belongOrg: this.chooseOrg.value
				}
				if (this.searchValue) {
					if (this.searchValue.length == 11) {
						params.ctcTel = this.searchValue
					} else if (this.searchValue.length == 18) {
						params.certNum = this.searchValue
					} else {
						params.cstName = this.searchValue
					}
				}
				this.params = JSON.stringify(params);
				queryCustSearchList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.allNum = res.data.total.toLocaleString();
						this.custList = this.custList.concat(res.data.records);
						if (this.custList.length >= this.allNum) this.finished = true;
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
						text: "归属机构",
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
				this.custList = [];
				this.showBatchSend = false;
				this.getCustList();
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
			}
		},
		mounted() {
			this.msgOrPhone = this.$store.state.userMsg.orgClass != "90000001";
			getSysCodeByType({
				codeType: "CST_LVL"
			}, (res) => {
				if (res.data) {
					this.cstLvlList = [{
						text: "全部",
						value: ""
					}, ...res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue
						}
					})]
				} else {
					Toast.fail("AUM等级列表数据为空")
				}
			})
			getSysCodeByType({
				codeType: "SVC_LVL"
			}, (res) => {
				if (res.data) {
					this.svcLvlList = [{
						text: "全部",
						value: ""
					}, ...res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue
						}
					})]
				} else {
					Toast.fail("服务等级列表数据为空")
				}
			})
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
		top: calc(constant(safe-area-inset-top) + 0.5rem);
		top: calc(env(safe-area-inset-top) + 0.5rem);
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
		padding: 0.11rem 0 0.11rem 0.11rem;
		background-color: #FFFFFF;
		border-radius: 0.05rem;
		display: flex;
		box-shadow: 0rem 0rem 0.06rem -0.04rem #888888;
		text-align: left;
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
		width: 30%;
		line-height: 0.2rem;
		font-size: 0.13rem;
		color: #666666;
		padding: 0.1rem 0;
		flex-shrink: 0;
	}

	.msgItem3 {
		width: 20%;
		display: flex;
		flex-shrink: 0;
	}

	.msgItem3>div {
		width: 48%;
		height: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 85%;
	}

	.msgItem4 {
		width: 62%;
		line-height: 0.2rem;
		font-size: 0.13rem;
		color: #666666;
		flex-shrink: 1;
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
