<template>
	<div class="clCustList">
		<div class="top">
			<!-- 顶部title -->
			<nav-bar title="选择客户" type="2" :rightText="$store.state.userMsg.roleId != '00000004' ? orgName : ''"
				rightColor="rgba(2, 109, 255, 1)" @touchRight="$refs.orgList.showPopup()" leftIcon />
			<!-- 搜索栏 -->
			<van-search v-model="searchValue" shape="round" show-action placeholder="输入客户姓名/手机号/身份证号/客户号查询"
				@search="reload" :left-icon="require('../../assets/image/common_search.png')">
				<template #action>
					<div style="color: #026DFF;font-size: 0.14rem;padding-left: 0.1rem;" @click="reload">搜索</div>
				</template>
			</van-search>
			<!-- 排序 -->
			<div class="orderList">
				<div class="orderItem" v-for="(item, index) in orderList" :key="item.key"
					@click="changeOrder(item, index)">
					<span>{{ item.value }}</span>
					<van-icon v-if="params.orderType == `${item.key}D`"
						:name="require('@/assets/image/common_order_down.png')" size="20" />
					<van-icon v-else-if="params.orderType == `${item.key}Z`"
						:name="require('@/assets/image/common_order_up.png')" size="20" />
					<van-icon v-else :name="require('@/assets/image/common_order_none.png')" size="20" />
				</div>
			</div>
			<!-- 选择tabs -->
			<div class="list">
				<van-tabs class="month" v-model:active="tageListActive" type="card" @change="tageListChange">
					<van-tab v-for="item in tageList" :key="item.key" :title="item.title">
					</van-tab>
				</van-tabs>
			</div>
			<!-- 筛选结果 -->
			<div class="listNum">
				<div class="total">
					<span>筛选结果：共{{formatNums(total)}}条数据 </span>
				</div>
				<div class="sendAll" @click="sendFrom">
					<span v-if="showBatchSend">取消添加</span>
					<span v-else>批量添加</span>
				</div>
			</div>
		</div>
		<van-list class="vanListStyle" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
			@load="queryList" :immediate-check="false">
			<van-checkbox-group v-model="chooseItems" ref="checkboxGroup">
				<div class="custItem" v-for="(item,i) in custList" :key="'item'+i"
					:style="{'margin-left':showBatchSend?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="item.custNum" @click="checkAll=false" :disabled="item.isGroupCust=='1'">
						</van-checkbox>
					</div>
					<div class="custItem1">
						<div class="custItem1_2">
							<div class="custItem1_2_1">{{item.cstName}}</div>
							<div class="custItem1_2_2"
								:style="`background-image:url(${require(`@/assets/image/business_chooseCust_type${item.svcLvlCount || 0}.png`)})`">
							</div>
							<div class="custItem1_2_3">
								<template
									v-for="(text, j) in ['vipCstFlg','agentPayCstFlg', 'newCstFlg', 'merntCstFlg', 'ioinHoldLoan', 'crdtCrdCstFlg']">
									<div :class="text" v-if="item[text] =='1'" :key="j">{{['财','代','新','商','贷','信'][j]}}
									</div>
								</template>
								<template
									v-for="(text, s) in ['ioinSgnMobbank','ioinSgnAlpy','ioinSgnWchtPymt', 'ioinSgnYsf']"
									:key="s">
									<van-icon
										:name="require(`@/assets/image/business_chooseCust_${['jjyh','zfb','wx','ysf'][s]}${['.png','_a.png'][item[text] || 0]}`)"
										size="16" style="margin-right: 0.04rem;" />
								</template>
							</div>
						</div>
						<div class="playFrom">
							<van-icon :name="require('@/assets/image/group_delete.png')" size="0.18rem"
								style="margin-right: 0.24rem;" v-if="item.isGroupCust=='1'" @click="delCust(item)" />
							<van-icon :name="require('@/assets/image/group_add.png')" size="0.18rem"
								style="margin-right: 0.24rem;" v-else @click="addCust([item.custNum])" />
						</div>
					</div>
					<div class="custItem2">
						<template v-for="cust in custItemArr" :key="cust.key">
							<div class="custItem2_child">
								<span class="custItem2_childName">{{cust.value}}：</span>
								<span class="custItem2_childValue">{{formatNumW(item[cust.key] || 0)}}万元</span>
							</div>
						</template>
					</div>
				</div>
			</van-checkbox-group>
		</van-list>
		<div class="bottomZW"></div>
		<div style="height: 0.6rem;" v-show="showBatchSend"></div>
		<van-popup v-model:show="showBatchSend" position="bottom" :overlay="false" :lock-scroll="false"
			safe-area-inset-bottom>
			<div class="sendMsgBtnBox">
				<div></div>
				<div class="sendBox">
					<div class="sendMsgBtn" style="margin-right: 0.1rem;" @click="msgBatchSend(true)">全部添加</div>
					<div class="sendMsgBtn" @click="msgBatchSend(false)">添加</div>
				</div>
			</div>
		</van-popup>
		<!-- 选择机构组件 -->
		<org-list ref="orgList" :type="2" @close="closeOrg" @activeOrg="activeOrg" />
		<van-overlay :show="showDelete" z-index="11">
			<div class="plate6">
				<div class="plate6_5">确定将该客户从群组移除？</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showDelete=false">取消</div>
					<div class="palte6_4_2" @click="checkDelete">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>
<script>
	import {
		formatNumW,
		formatNums
	} from "@/api/common.js";
	import {
		querySelCustList,
		deleteGroupFixCust,
		addGroupFixSelCust
	} from "@/request/market.js";
	import {
		Toast
	} from "vant";
	export default {
		name: 'clCustList',
		data() {
			return {
				checkAll: false,
				orderList: [{
						key: 'aumDifVal',
						value: '极差值',
						status: ''
					},
					{
						key: 'aumBal',
						value: 'AUM余额',
						status: ''
					},
					{
						key: 'loanBal',
						value: '贷款余额',
						status: ''
					}
				],
				custItemArr: [{
						key: 'aumDifVal',
						value: '极差值'
					},
					{
						key: 'aumHistHestVal',
						value: '历史最高资产'
					},
					{
						key: 'aumBal',
						value: 'AUM资产'
					},
					{
						key: 'timeDpsitBal',
						value: '定期'
					},
					{
						key: 'currDpsitBal',
						value: '活期'
					},
					{
						key: 'loanBal',
						value: '贷款'
					},
				],
				searchValue: "",
				loading: false,
				finished: false,
				pageIndex: 0,
				custList: [],
				total: 0,
				showBatchSend: false,
				chooseItems: [],
				params: {
					pageSize: "10",
					pageNum: "1",
					belgCustMgr: "", // 客户经理
					// orderType: "",      // 排序
					cstName: "", // 客户名称
					svcLvl: '', // 服务等级
					ctcTel: "", // 联系电话
					certNum: "", // 证件号
					cstLvl: "", // 客户等级
					belongOrg: "", // 归属机构
					groupId: ""
				},
				tageList: [{
					key: '',
					title: "全部"
				}, {
					key: 6,
					title: "私行级"
				}, {
					key: 5,
					title: "钻石级"
				}, {
					key: 4,
					title: "白金卡级"
				}, {
					key: 3,
					title: "金卡级"
				}, {
					key: 2,
					title: "理财级"
				}, {
					key: 1,
					title: "大众级"
				}, {
					key: 0,
					title: "未达标"
				}],
				tageListActive: 0,
				orgName: '选择机构',
				deleteItem: {},
				showDelete: false,
			};
		},
		mounted() {
			this.params.groupId = this.$route.params.groupId;
			this.queryList();
		},
		watch: {
			searchValue() {
				this.params.custNum = "";
				this.params.ctcTel = "";
				this.params.certNum = "";
				this.params.cstName = "";
				if (this.searchValue) {
					if (this.searchValue.length == 16) { //客户号
						this.params.custNum = this.searchValue;
					} else if (this.searchValue.length == 11) { //手机号
						this.params.ctcTel = this.searchValue;
					} else if (this.searchValue.length == 18) { //身份证号
						this.params.certNum = this.searchValue;
					} else { //客户姓名
						this.params.cstName = this.searchValue;
					}
				}
			},
			showBatchSend() {
				if(this.showBatchSend){
					this.chooseItems = []
				}
			}
		},
		methods: {
			formatNumW,
			formatNums,
			/* 存量客户查询接口 */
			queryList() {
				this.finished = false;
				this.loading = true;
				// this.total = 0
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				this.params.pageNum = this.pageIndex.toString();
				querySelCustList(this.params, (res) => {
					if (res.data && res.data.records) {
						this.total = res.data.total;
						this.custList = this.custList.concat(res.data.records);
						if (this.custList.length >= this.total || res.data.records.length <= 0) this.finished =
							true;
					} else {
						this.finished = true;
					}
					this.$nextTick(() => {
						Toast.clear();
						this.loading = false;
						this.$forceUpdate();
					});
				});
			},
			/* 初始化查询条件 */
			initParams() {
				this.pageIndex = 0;
				// this.tageListActive = 0;
				this.params.pageSize = '10';
				this.params.pageNum = '';
				this.custList = [];
				this.showBatchSend = false;
			},
			/* 选择机构 */
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.orgName = orgValue.text;
				} else {
					this.orgName = "选择机构";
				};
				this.initParams();
				this.params.belongOrg = orgValue.value || '';
				this.queryList();
			},
			/* 点击搜索 */
			reload() {
				this.initParams();
				this.queryList();
			},
			delCust(item) {
				this.deleteItem = item;
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
					groupId: this.params.groupId,
					custNum: this.deleteItem.custNum
				}, (res) => {
					if (res.data == "操作成功") {
						Toast.success("删除成功");
						this.deleteItem.isGroupCust = "0";
					} else {
						Toast.fail(res.msg)
					}
				})
			},
			addCust(list) {
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				addGroupFixSelCust({
					groupId: this.params.groupId,
					custNums: list
				}, (res) => {
					if (res.data == "操作成功") {
						this.showBatchSend = false;
						Toast.success("添加成功");
						if (list.length>1) {
							setTimeout(() => {
								this.$router.go(-1);
							}, 800)
						} else{
							list.forEach((item) => {
								this.custList.find(custItem => custItem.custNum == item).isGroupCust = "1"
							});
						}
					} else {
						Toast.fail(res.msg)
					}
				})
			},
			/* 批量添加的按钮 */
			msgBatchSend(sendAll) {
				if (sendAll) {
					Toast.loading({
						message: "正在操作",
						forbidClick: true,
						duration: 0,
					});
					addGroupFixSelCust(this.params, (res) => {
						if (res.data == "操作成功") {
							this.showBatchSend = false;
							Toast.success("添加成功");
							setTimeout(() => {
								this.reload();
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				} else {
					if (this.chooseItems && this.chooseItems.length < 1) {
						Toast.fail('请选择客户!')
						return
					};
					this.addCust(this.chooseItems)
				}
			},
			closeOrg() {
				// this.$refs.orgDrop.toggle(false);
			},
			/* 点击排序 */
			changeOrder(item, i) {
				if (item.status != 'D') {
					item.status = 'D'
				} else {
					item.status = 'Z'
				}
				this.params.orderType = `${item.key}${item.status}`
				this.initQueryList()
			},
			/* 选择服务等级 */
			tageListChange(v) {
				this.params.svcLvl = ['', '6', '5', '4', '3', '2', '1', '0'][v]
				this.initQueryList()
			},
			/* 初始化查询条件后查询 */
			initQueryList() {
				// this.params.cstName = ''
				// this.params.belgCustMgr = ''
				this.pageIndex = 0;
				this.custList = [];
				this.showBatchSend = false;
				this.queryList()
			},
			/* 批量发送 */
			sendFrom() {
				this.showBatchSend = !this.showBatchSend;
				this.chooseItems = []
			},
			/* 跳转详情 */
			openDetails(item) {
				if (!this.showBatchSend) {
					this.$router.push({
						name: 'clCustomerView',
						query: {
							custNum: item.custNum
						}
					})
				}
			},
			/* 全选 */
			chooseAll() {
				this.$refs.checkboxGroup.toggleAll(this.checkAll);
			}
		},
	};
</script>
<style lang="less" scoped>
	:deep(.van-search) {
		padding: 0.1rem;
	}

	:deep(.van-search__field) {
		align-items: center;
	}

	:deep(.van-search__action) {
		padding: 0;
	}

	.clCustList {
		font-size: 0.14rem;
		background-color: #F5F5F5;

		.top {
			position: fixed;
			// top: 0;
			width: 100%;
			// min-height: 0.5rem;
			// border: 0.005rem solid black;
			z-index: 2;

			.searchBox {
				width: 100%;
				height: 0.5rem;
				background-color: #ffffff;
				padding: 0 8%;
			}

			.orderList {
				width: 100%;
				display: flex;
				// flex-wrap: nowrap;
				justify-content: space-around;
				padding: 0.14rem 0;
				background: #fff;
				border-bottom: solid 0.01rem #f0f0f0;
				border-top: solid 0.01rem #f0f0f0;

				.orderItem {
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
				}
			}

			&:deep(.van-tabs__nav--card) {
				margin: 0;
			}

			.list {
				width: 100%;
				padding: 0.1rem 0 0.15rem;
				background: #fff;

				&:deep(.month) {
					.van-tabs__nav--card {
						border: none;
					}

					.van-tab--card,
					.van-tab--active {
						margin: 0 0.1rem;
						border-radius: 0.15rem;
					}

					.van-tab--card {
						background: rgba(245, 245, 245, 1);
						border-right: none;
						color: #8c8c8c;
					}

					.van-tab--active {
						background: rgba(2, 109, 255, 0.12);
						color: #026dff;
					}
				}
			}

			.listNum {
				font-size: 0.1rem;
				color: #262626;
				line-height: 0.4rem;
				width: 100%;
				height: 0.4rem;
				padding: 0 3.5%;
				display: flex;
				flex-wrap: nowrap;
				justify-content: space-between;
				background-color: #f5f5f5;

				.sendAll {
					color: rgba(2, 109, 255, 1);
					font-size: 0.14rem;
				}
			}
		}

		.vanListStyle {
			padding: 1.88rem 0.12rem 0;
			max-width: 100%;
			overflow: hidden;

			.custItem {
				width: 100%;
				margin: 0.12rem auto 0;
				background: #FFFFFF;
				box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
				border-radius: 0.08rem;
				padding: 0.12rem;
				position: relative;
				transition: margin-left 0.3s;

				.leftCheckBox {
					width: 0.2rem;
					height: 0.2rem;
					flex-shrink: 0;
					position: absolute;
					top: 50%;
					left: -12.5%;
					transform: translateY(-50%);
					display: flex;
					justify-content: flex-end;
				}

				.custItem1 {
					width: 100%;
					height: 0.44rem;
					display: flex;
					justify-content: space-between;
					flex-wrap: nowrap;

					.custItem1_2 {
						display: flex;
						flex-wrap: wrap;

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

							.vipCstFlg,
							.agentPayCstFlg,
							.newCstFlg,
							.merntCstFlg,
							.ioinHoldLoan,
							.crdtCrdCstFlg {
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

							.vipCstFlg {
								background-color: rgba(2, 109, 255, 0.08);
								color: #026DFF;
							}

							.agentPayCstFlg {
								background-color: rgba(255, 133, 0, 0.08);
								color: #FF8500;
							}

							.newCstFlg {
								background-color: rgba(255, 58, 58, 0.08);
								color: #FF3A3A;
							}

							.merntCstFlg {
								background-color: rgba(68, 107, 161, 0.08);
								color: #446BA1;
							}

							.ioinHoldLoan {
								background-color: rgba(55, 205, 55, 0.08);
								color: #13AD13;
							}

							.crdtCrdCstFlg {
								background-color: rgba(176, 177, 255, 0.08);
								color: #B0B1FF
							}
						}
					}

					.playFrom {
						display: flex;
						justify-content: space-around;
					}
				}

				.custItem2 {
					display: flex;
					flex-wrap: wrap;
					margin-top: 0.12rem;

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
						margin-top: 0.04rem;
						white-space: nowrap;
					}

					.custItem2_childName {
						color: #8C8C8C;
					}

					.custItem2_childValue {
						color: #262626;
					}
				}

				.custItem3 {
					width: 100%;
					margin: 0 auto 0.1rem;
					height: 0.01rem;
					box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
				}

				.bottomText {
					display: flex;
					font-size: 0.12rem;

					&>div {
						width: 50%;
						text-align: left;
						letter-spacing: 0;
					}
				}
			}
		}
	}
</style>
<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		/* border: 0; */
	}

	.msgItem {
		width: 93%;
		margin: 0 auto 0.1rem;
		padding: 0.11rem 0 0.11rem 0.11rem;
		background-color: #ffffff;
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
		height: 0.6rem;
		padding: 0 3.5%;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: solid 0.01rem #F5F5F5;
	}

	.sendBox {
		display: flex;
	}

	.sendMsgBtn {
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
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

	.plate6_1 {
		width: 100%;
		height: 0.22rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 500;
		margin-bottom: 0.24rem;
	}

	.plate6_2 {
		width: 100%;
		height: 0.24rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.plate6_3 {
		width: 100%;
		height: 0.27rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.08rem;
	}

	.plate6_3_1 {
		margin-left: 0;
	}

	.plate6_3_2 {
		margin-left: 0.125rem;
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
		margin-bottom: 0.24rem;
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
