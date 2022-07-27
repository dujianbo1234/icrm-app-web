<template>
	<div class="home">
		<nav-bar :title="baseMsg.active==0?baseMsg.acGroupNm:baseMsg.custGroupNm" @touchRight="onClickRight" type="2"
			leftIcon :rightText="baseMsg.active==1?'添加客户':''" rightColor="#026DFF"
			:backLevel="$route.params.backLevel?Number($route.params.backLevel):1" />
		<div class="fixedPlace">
			<div class="baseMsgPlace">
				<div class="baseMsg1">
					<div class="baseMsg1_1">{{baseMsg.active==0?baseMsg.acGroupNm:baseMsg.custGroupNm}}</div>
					<div class="baseMsg1_2">{{(total||0).toLocaleString()}}人</div>
				</div>
				<div class="baseMsg2" v-if="baseMsg.active==0">选客策略</div>
				<div class="baseMsg3" v-if="baseMsg.active==0">
					<template v-for="(filterItem,i) in baseMsg.listGroupCdtnChc" :key="'filterItem'+i">
						<span>#</span>
						<span>{{filterItem.chcFldNm.split("#")[0]}}&nbsp;</span>
						<span v-if="filterItem.chcValue">{{filterItem.chcValue}}</span>
						<span v-else-if="filterItem.chcValueMin&&filterItem.maxValue">
							({{filterItem.minValue}},{{filterItem.chcValueMax}}]</span>
						<span v-else-if="filterItem.chcValueMin">≥{{filterItem.chcValueMin}}</span>
						<span v-else-if="filterItem.chcValueMax">＜{{filterItem.chcValueMax}}</span>
						<span v-else-if="filterItem.chcValues">＜{{filterItem.chcValues}}</span>
						<span># </span>
					</template>
				</div>
				<div class="baseMsg2">客群描述</div>
				<div class="baseMsg3">{{baseMsg.active==0?(baseMsg.rmk||"-"):(baseMsg.rmkExpln||"-")}}</div>
				<div class="baseMsg4">
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">AUM总额：</span>
						<span class="baseMsg4_childValue">{{formatNumW(baseMsg.aumBal||0)}}万元</span>
					</div>
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">贷款总额：</span>
						<span class="baseMsg4_childValue">{{formatNumW(baseMsg.loanBal||0)}}万元</span>
					</div>
				</div>
				<div class="baseMsg5">
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">归属人：</span>
						<span
							class="baseMsg4_childValue">{{baseMsg.active==0?baseMsg.creatorNm:baseMsg.modifUsrName}}</span>
					</div>
					<div class="baseMsg4_child">
						<span class="baseMsg4_childTitle">机构：</span>
						<span
							class="baseMsg4_childValue">{{baseMsg.active==0?baseMsg.crtInstNm:baseMsg.menderBelongOrgNm}}</span>
					</div>
				</div>
			</div>
		</div>
		<div :style="{height: fixedHeight}"></div>
		<van-list ref="vantList" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
			:immediate-check="false" @load="onLoad">
			<div class="custItem" v-for="(custItem,i) in custList" :key="'custItem'+i" @click="toCustView(custItem)">
				<div class="custItem1">
					<div class="custItem1_2">
						<div class="custItem1_2_1">{{baseMsg.active==0?custItem.cstNm:custItem.custNm}}</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='0':custItem.scrLvl=='0'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type0.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='1':custItem.scrLvl=='1'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='2':custItem.scrLvl=='2'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='3':custItem.scrLvl=='3'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='4':custItem.scrLvl=='4'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='5':custItem.scrLvl=='5'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}">
						</div>
						<div class="custItem1_2_2" v-if="baseMsg.active==0?custItem.svcLvl=='6':custItem.scrLvl=='6'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}">
						</div>
						<div class="custItem1_2_3">
							<div class="custItem1_2_3_item" v-if="custItem.vipCustFlg=='1'"
								style="background-color: rgba(2,109,255,0.08);color: #026DFF;">财</div>
							<div class="custItem1_2_3_item" v-if="custItem.agentPayCstFlg=='1'"
								style="background-color: rgba(255,133,0,0.08);color: #FF8500;">代</div>
							<div class="custItem1_2_3_item" v-if="custItem.isNewCust=='1'"
								style="background-color: rgba(255,58,58,0.08);color: #FF3A3A;">新</div>
							<div class="custItem1_2_3_item" v-if="custItem.merntCstFlg=='1'"
								style="background-color: rgba(68,107,161,0.08);color: #446BA1;">商</div>
							<div class="custItem1_2_3_item" v-if="custItem.loanProHold=='1'"
								style="background-color: rgba(55,205,55,0.08);color: #13AD13;">贷</div>
							<div class="custItem1_2_3_item" v-if="custItem.cardCstFlg=='1'"
								style="background-color: rgb(245,245,255);color: #B0B1FF;">信</div>
							<van-icon v-if="custItem.ioinSgnMobbank=='1'"
								:name="require('../../assets/image/business_chooseCust_jjyh_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_jjyh.png')"
								size="16" style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.alpySign=='1'"
								:name="require('../../assets/image/business_chooseCust_zfb_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_zfb.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.wchtPymtSign=='1'"
								:name="require('../../assets/image/business_chooseCust_wx_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_wx.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-if="custItem.ysfSign=='1'"
								:name="require('../../assets/image/business_chooseCust_ysf_a.png')" size="16"
								style="margin-right: 0.04rem;" />
							<van-icon v-else :name="require('../../assets/image/business_chooseCust_ysf.png')" size="16"
								style="margin-right: 0.04rem;" />
						</div>
						<div class="custItem1_3" v-if="baseMsg.active==1" @click.stop="delCust(custItem)">
							<van-icon :name="require('../../assets/image/group_delete.png')" size="18" />
						</div>
					</div>
				</div>
				<div class="custItem2">
					<div class="custItem2_child">
						<span class="custItem2_childName">极差值：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumDifVal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">历史最高资产：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumHistHestVal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">AUM资产：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.aumBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">定期：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.dqBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">活期：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.hqBal/10000)}}万元</span>
					</div>
					<div class="custItem2_child">
						<span class="custItem2_childName">贷款：</span>
						<span class="custItem2_childValue">{{formatNum(custItem.loanBal/10000)}}万元</span>
					</div>
				</div>
			</div>
		</van-list>
		<div class="bottomZW"></div>
		<van-dialog v-model:show="showDelete">
			<template #default>
				<div class="dialogValue">确定将该客户从群组移除？</div>
			</template>
			<template #footer>
				<div class="dialogBtns">
					<div class="dialogBtn dialogBtn1" @click="showDelete=false">取消</div>
					<div class="dialogBtn dialogBtn2" @click="checkDelete">确认</div>
				</div>
			</template>
		</van-dialog>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		formatNumW,
		formatNums,
		formatNum
	} from "../../api/common.js";
	import {
		queryGroupActiveCust,
		queryGroupFixCust,
		deleteGroupFixCust
	} from "../../request/market.js";
	export default {
		data() {
			return {
				baseMsg: {},
				fixedHeight: "",
				loading: false,
				finished: false,
				pageIndex: 0,
				custList: [],
				checkCust: {},
				showDelete: false,
				pageReady: false,
				total: 0,
			}
		},
		methods: {
			formatNumW,
			formatNums,
			formatNum,
			onLoad() {
				if (!this.pageReady) return;
				this.finished = false;
				this.loading = true;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				if (this.baseMsg.active == 0) {
					queryGroupActiveCust({
						pageSize: "10",
						pageNum: this.pageIndex.toString(),
						sysId: this.baseMsg.sysId
					}, (res) => {
						if (res.data && res.data.records) {
							this.total = res.data.total;
							this.custList = this.custList.concat(res.data.records);
							if (this.custList.length >= this.total || res.data.records.length <= 0) this.finished =
								true;
						} else {
							this.finished = true;
						}
						Toast.clear();
						this.loading = false;
					});
				} else {
					queryGroupFixCust({
						pageSize: "10",
						pageNum: this.pageIndex.toString(),
						groupId: this.baseMsg.groupId
					}, (res) => {
						if (res.data && res.data.records) {
							this.total = res.data.total;
							this.custList = this.custList.concat(res.data.records);
							if (this.custList.length >= this.total || res.data.records.length <= 0) this.finished =
								true;
						} else {
							this.finished = true;
						}
						Toast.clear();
						this.loading = false;
					});
				}
			},
			onClickRight() {
				localStorage.setItem("groupDetail", "2");
				localStorage.setItem("newMyGroup", "2");
				this.$router.push({
					name: 'groupAddCust',
					params: {
						groupId: this.baseMsg.groupId
					}
				})
			},
			delCust(item) {
				this.checkCust = item;
				this.showDelete = true;
			},
			checkDelete() {
				this.showDelete = false;
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				deleteGroupFixCust({
					groupId: this.baseMsg.groupId,
					sysId: this.checkCust.sysId
				}, (res) => {
					if (res.data == "操作成功") {
						Toast.success("删除成功");
						setTimeout(() => {
							localStorage.setItem("newMyGroup", "2")
							this.pageIndex = 0;
							this.custList = [];
							this.checkCust = {};
							this.onLoad();
						}, 800)
					} else {
						Toast.fail(res.msg)
					}
				})
			},
			toCustView(custItem) {
				localStorage.setItem("groupDetail", "0");
				this.$router.push({
					name: 'clCustomerView',
					query: {
						custNum: custItem.custNum
					}
				})
			},
			mounted_m() {
				this.baseMsg = this.$route.params.groupItem ? JSON.parse(this.$route.params.groupItem) : JSON.parse(
					localStorage.getItem("groupDetail"));
				this.$nextTick(() => {
					var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName(
						"fixedPlace")[0], null);
					this.fixedHeight = fixedPlace.height;
				})
				this.pageReady = true;
				this.onLoad();
			}
		},
		mounted() {
			localStorage.setItem("groupDetail", "0");
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("groupDetail") == "0") {
				localStorage.setItem("groupDetail", "1")
			} else if (localStorage.getItem("groupDetail") == "2") {
				this.pageIndex = 0;
				this.custList = [];
				this.onLoad();
			} else {
				this.baseMsg = {};
				this.fixedHeight = "";
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.custList = [];
				this.checkCust = {};
				this.showDelete = false;
				this.pageReady = false;
				this.mounted_m();
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

	.fixedPlace {
		width: 100%;
		position: fixed;
		z-index: 9;
		background-color: #f5f5f5;
	}

	.baseMsgPlace {
		width: 93.6%;
		margin: 0.15rem auto;
		padding: 0.07rem 0.1rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}

	.baseMsg1 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-end;
		justify-content: space-between;
		padding-right: 0.1rem;
		margin: 0.05rem 0;
	}

	.baseMsg1_1 {
		height: 0.27rem;
		font-size: 0.18rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.27rem;
	}

	.baseMsg1_2 {
		height: 0.18rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.18rem;
	}

	.baseMsg2 {
		margin-top: 0.07rem;
		height: 0.18rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.18rem;
		text-align: left;
	}

	.baseMsg3 {
		max-width: calc(100% + 0.05rem);
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.18rem;
		text-align: left;
	}

	.baseMsg3>span {
		margin-right: 0.05rem;
	}

	.baseMsg4 {
		width: 100%;
		height: 0.42rem;
		margin-bottom: 0.05rem;
		border-bottom: solid 0.01rem #F5F5F5;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.baseMsg4_child {
		min-width: 50%;
		line-height: 0.18rem;
		text-align: left;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
	}

	.baseMsg4_child_wrap {
		white-space: wrap;
	}

	.baseMsg4_child_nowrap {
		white-space: nowrap;
	}

	.baseMsg4_childTitle {
		color: #8C8C8C;
	}

	.baseMsg4_childValue {
		color: #262626;
	}

	.baseMsg5 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-start;
	}

	.custItem {
		width: 93.6%;
		margin: 0 auto 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
	}

	.custItem1 {
		width: 100%;
		height: 0.44rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem1_1 {
		width: 0.4rem;
		height: 0.4rem;
		background: url(../../assets/image/mine_main_userIcon.png) no-repeat center;
		background-size: contain;
		border-radius: 0.2rem;
		overflow: hidden;
		margin-right: 0.12rem;
	}

	.custItem1_2 {
		display: flex;
		flex-wrap: wrap;
	}

	.custItem1_2_1 {
		height: 0.24rem;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
		margin: 0 0.08rem 0.04rem 0;
	}

	.custItem1_2_2 {
		width: 0.6rem;
		height: 0.16rem;
		margin: 0.04rem 0 0.08rem;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: contain;
	}

	.custItem1_2_3 {
		width: calc(100%);
		height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem1_2_3_item {
		width: 0.19rem;
		height: 0.16rem;
		border-radius: 0.02rem;
		text-align: center;
		line-height: 0.16rem;
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		font-weight: 400;
		margin-right: 0.04rem;
	}

	.custItem1_3 {
		position: absolute;
		top: 0.17rem;
		right: 0.3rem;
		width: 0.18rem;
		height: 0.18rem;
		border-radius: 0.09rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
	}

	.custItem2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.12rem;
		margin-bottom: 0.04rem;
	}

	.custItem2_child {
		width: 50%;
		flex-shrink: 0;
		height: 0.18rem;
		line-height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		text-align: left;
		letter-spacing: 0;
		font-weight: 400;
		margin-bottom: 0.04rem;
	}

	.custItem2_childName {
		color: #8C8C8C;
	}

	.custItem2_childValue {
		color: #262626;
	}

	.custItem3 {
		width: 100%;
		margin: 0 auto 0.12rem;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.custItem4 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}

	.custItem4_1 {
		width: 90%;
		font-family: PingFangSC-Regular;
		text-align: left;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.custItem4_2 {
		width: 10%;
		height: 0.16rem;
		display: flex;
		justify-content: flex-end;
	}

	.dialogValue {
		width: 90%;
		margin: 0.36rem auto 0.24rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.22rem;
	}

	.dialogBtns {
		width: 100%;
		margin-bottom: 0.2rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.dialogBtn {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 0.3rem;
		margin: 0 0.08rem;
	}

	.dialogBtn1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}

	.dialogBtn2 {
		background: #026DFF;
		color: #FFFFFF;
	}
</style>
