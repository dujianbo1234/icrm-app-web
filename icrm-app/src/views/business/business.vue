<template>
	<div class="home">
		<div class="topZW"></div>
		<div class="fixedPlace">
			<div class="plate1">
				<div class="palte1_1">商机进度：{{toPercent(sumMsg.thenFollowRate||0)}}</div>
				<van-progress color="#026DFF" track-color="#EBEBEB" pivot-text=""
					:percentage="sumMsg.thenFollowRate*100||0" />
				<div class="plate1_2">
					<div class="plate1_2_child">
						<span class="plate1_2_childName">总数：</span>
						<span class="plate1_2_childValue">{{sumMsg.allSum||"-"}}</span>
					</div>
					<div class="plate1_2_child">
						<span class="plate1_2_childName">已跟进：</span>
						<span class="plate1_2_childValue">{{sumMsg.thenFollowNum||"-"}}</span>
					</div>
					<div class="plate1_2_child">
						<span class="plate1_2_childName">成交率：</span>
						<span class="plate1_2_childValue">{{toPercent(sumMsg.succFollowRate||0)}}</span>
					</div>
					<div class="plate1_2_child">
						<span class="plate1_2_childName">逾期未跟进率：</span>
						<span class="plate1_2_childValue">{{toPercent(sumMsg.overFollowRate||0)}}</span>
					</div>
				</div>
			</div>
			<div class="plate2">
				<div class="plate2_child" v-for="(orderItem,i) in orderList" :key="'orderItem'+i"
					@click="changeOrder(i)">
					<span>{{orderItem.text}}</span>
					<van-icon v-if="i!=orderIndex" :name="require('../../assets/image/common_order_none.png')"
						size="20" />
					<van-icon v-else-if="orderType" :name="require('../../assets/image/common_order_down.png')"
						size="20" />
					<van-icon v-else :name="require('../../assets/image/common_order_up.png')" size="20" />
				</div>
			</div>
			<div class="plate3">
				<div class="plate3_father" :style="{width: kequnList.length*0.84+0.16+'rem'}">
					<div :class="i==kequnIndex?'plate3_child_a':'plate3_child'" v-for="(kequnItem,i) in kequnList"
						:key="'kequnItem'+i" @click="changeKequn(i)">
						{{kequnItem.text}}
					</div>
				</div>
			</div>
		</div>
		<div style="height: 1.87rem;"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="—— 到底啦,我是有底线的 ——" @load="onLoad"
			:immediate-check="false">
			<div class="businessItem" v-for="(item,i) in msgList" :key="'item'+i" @click="openDetail(item)">
				<div class="itemPlate1">{{item.cmrcOpptSubclassNm}}</div>
				<div class="itemPlate2">
					<van-rate v-model="item.practialScore" :size="18" color="#FFBA00" void-icon="star" readonly
						void-color="#E0E0E0" allow-half />
					<div class="itemPlate2_value">{{item.practialScore}}</div>
				</div>
				<div class="itemPlate3">{{item.keyWords}}</div>
				<div class="itemPlate3">创建人：{{item.crtUsrName}}</div>
				<div class="itemPlate4">
					<div class="itemPlate4_child">
						<span class="itemPlate4_childName">客户数：</span>
						<span class="itemPlate4_childValue" style="color: #FF3A3A;">{{item.allSum}}人</span>
					</div>
					<div class="itemPlate4_child">
						<span class="itemPlate4_childName">到期日期：</span>
						<span class="itemPlate4_childValue">{{item.cmrcOpptExpDay}}</span>
					</div>
					<div class="itemPlate4_child">
						<span class="itemPlate4_childName">跟进率：</span>
						<span class="itemPlate4_childValue">{{toPercent(item.thenFollowRate||0)}}</span>
					</div>
					<div class="itemPlate4_child">
						<span class="itemPlate4_childName">成交率：</span>
						<span class="itemPlate4_childValue">{{toPercent(item.succFollowRate||0)}}</span>
					</div>
				</div>
				<div class="itemPlate5">
					{{item.cmrcOpptBclassNm}}
				</div>
			</div>
			<div class="vuNum">
				<span>使用人数：{{useNum?Number(useNum).toLocaleString():"-"}}</span>
				<span>浏览人数：{{visitNum?Number(visitNum).toLocaleString():"-"}}</span>
			</div>
		</van-list>
		<div class="bottomZW"></div>
	</div>
</template>

<script>
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryCmrcOpportunitySum,
		queryCmrcOpportunitySumList,
		saveSmAppVisitInfo,
		querySmAppVisitSum
	} from "../../request/market.js";
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				sumMsg: {},
				orderIndex: -1,
				orderType: true,
				orderList: [{
					text: "跟进率",
					value: "THEN_FOLLOW_RATE"
				}, {
					text: "成交率",
					value: "SUCC_FOLLOW_RATE"
				}, {
					text: "好评率",
					value: "PRACTIAL_SCORE"
				}, {
					text: "到期日期",
					value: "CMRC_OPPT_EXP_DAY",
				}],
				kequnIndex: 0,
				kequnList: [{
					text: "全部",
					value: ""
				}],
				msgList: [],
				loading: false,
				finished: false,
				pageIndex: 0,
				visitNum: "",
				useNum: "",
			}
		},
		methods: {
			toPercent(point) {
				var str = Number(point * 100).toFixed(2);
				str += "%";
				return str;
			},
			changeOrder(i) {
				if (i == this.orderIndex) {
					this.orderType = !this.orderType;
				} else {
					this.orderIndex = i;
					this.orderType = true;
				}
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeKequn(i) {
				this.kequnIndex = i;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			openDetail(item) {
				localStorage.setItem("cmrcOpptId", item.cmrcOpptId);
				this.$router.push({
					name: 'chooseCust',
					params: {
						cmrcOpptId: item.cmrcOpptId
					}
				})
			},
			onLoad() {
				this.loading = true;
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				queryCmrcOpportunitySumList({
					pageSize: "10",
					pageNum: this.pageIndex,
					cmrcOpptBclass: this.kequnList[this.kequnIndex].value,
					orderField: this.orderIndex >= 0 ? this.orderList[this.orderIndex].value : "",
					orderType: this.orderIndex >= 0 ? this.orderType ? "DESC" : "ASC" : ""
				}, (res) => {
					if (res.data && res.data.records) {
						this.msgList = this.msgList.concat(res.data.records);
						if (this.msgList.length >= res.data.total) this.finished = true;
					} else {
						this.finished = true;
					}
					Toast.clear();
					this.loading = false;
				})
			},
			mounted_m() {
				this.kequnIndex = Number(this.$route.params.pageType) || 0;
				getSysCodeByType({
					codeType: "CMRC_OPPT_BCLASS"
				}, (res) => {
					if (res.data) {
						var arr = res.data.map((item) => {
							return {
								text: item.codeName,
								value: item.codeValue
							}
						})
						this.kequnList = [{
							text: "全部",
							value: ""
						}, ...arr];
						this.onLoad();
					} else {
						Toast.fail("商机大类数据为空")
					}
				})
				queryCmrcOpportunitySum({}, (res) => {
					if (res.data) {
						this.sumMsg = res.data;
					} else {
						Toast.fail("商机汇总数据为空");
					}
				})
				saveSmAppVisitInfo({
					busiType: "4"
				}, (res) => {

				});
				querySmAppVisitSum({
					busiType: "4"
				}, (res) => {
					if (res.data) {
						this.visitNum = res.data.visitNum;
						this.useNum = res.data.useNum;
					}
				});
			},
		},
		mounted() {
			localStorage.setItem("newBusiness", "0");
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("newBusiness") == "0") {
				localStorage.setItem("newBusiness", "1")
			} else {
				this.sumMsg = {};
				this.orderIndex = -1;
				this.orderType = true;
				this.kequnIndex = 0;
				this.msgList = [];
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.visitNum = "";
				this.useNum = "";
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

	.topZW {
		width: 100%;
		height: constant(safe-area-inset-top);
		height: env(safe-area-inset-top);
		background-color: #F8F8F8;
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.home {
		background-color: #FFFFFF;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		top: constant(safe-area-inset-top);
		top: env(safe-area-inset-top);
		z-index: 9;
	}

	.plate1 {
		width: 93.6%;
		margin: 0.12rem auto;
		padding: 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.1rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
	}

	.palte1_1 {
		width: 100%;
		line-height: 0.28rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.2rem;
		color: rgba(0, 0, 0, 0.85);
		letter-spacing: 0;
		font-weight: 500;
		margin-bottom: 0.04rem;
	}

	.plate1_2 {
		display: flex;
		flex-wrap: wrap;
		margin-top: 0.08rem;
		margin-bottom: -0.07rem;
	}

	.plate1_2_child {
		width: 50%;
		flex-shrink: 0;
		line-height: 0.17rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		text-align: left;
		letter-spacing: 0;
		font-weight: 400;
		margin-bottom: 0.07rem;
	}

	.plate1_2_childName {
		color: #8C8C8C;
	}

	.plate1_2_childValue {
		color: #262626;
	}

	.plate2 {
		display: flex;
		flex-wrap: nowrap;
		height: 0.44rem;
		background: #FFFFFF;
		align-items: center;
		justify-content: space-around;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate2_child {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		flex-shrink: 0;
		line-height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
	}

	.plate3 {
		overflow: auto;
		width: 100%;
		height: 0.56rem;
		background: #FFFFFF;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate3_father {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding: 0.12rem;
		align-items: center;
	}

	.plate3_child,
	.plate3_child_a {
		flex-shrink: 0;
		text-align: center;
		margin-right: 0.08rem;
		width: 0.8rem;
		line-height: 0.32rem;
		border-radius: 0.08rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		letter-spacing: 0;
	}

	.plate3_child {
		background: #F5F5F5;
		color: #595959;
		font-weight: 400;
	}

	.plate3_child_a {
		background: rgba(2, 109, 255, 0.12);
		color: #026DFF;
		font-weight: 500;
	}

	.plate3::-webkit-scrollbar {
		display: none;
	}

	.businessItem {
		width: 93.6%;
		margin: 0.12rem auto;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.1rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		padding: 0.12rem;
		position: relative;
		overflow: hidden;
	}

	.itemPlate1 {
		width: 100%;
		height: 0.24rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
	}

	.itemPlate2 {
		height: 0.21rem;
		margin-top: 0.02rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.itemPlate2_value {
		width: 0.21rem;
		height: 0.21rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 500;
		margin-left: 0.09rem;
	}

	.itemPlate3 {
		width: 100%;
		height: 0.18rem;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-top: 0.05rem;
		margin-bottom: 0.07rem;
	}

	.itemPlate4 {
		display: flex;
		flex-wrap: wrap;
		padding-top: 0.07rem;
		margin-bottom: -0.04rem;
		border-top: solid 0.01rem rgba(0, 0, 0, 0.04);
	}

	.itemPlate4_child {
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

	.itemPlate4_childName {
		color: #8C8C8C;
	}

	.itemPlate4_childValue {
		color: #262626;
	}

	.itemPlate5 {
		width: 1rem;
		height: 0.2rem;
		line-height: 0.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #FFFFFF;
		letter-spacing: 0;
		font-weight: 400;
		background: url(../../assets/image/business_main_tag.png) no-repeat;
		background-size: cover;
		position: absolute;
		top: 0;
		right: 0;
		padding-left: 0.16rem;
	}

	.vuNum {
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		/* height: 0.44rem; */
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		padding: 0 3.2%;
	}

	:deep(.van-list__finished-text) {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #BFBFBF;
		letter-spacing: 1px;
	}
</style>
