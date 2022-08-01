<template>
	<div class="home">
		<nav-bar title="重要潜客列表" type="2" :rightIcon="gtgh?require('../../assets/image/cust_zyqk_ghlb.png'):''" leftIcon
			@touchRight="openGtgh" />
		<div class="fixedPlace">
			<van-search v-if="$store.state.userMsg.roleId=='00000004'" v-model="searchValue" shape="round" show-action
				placeholder="请输入客户名称" @search="onSearch" :left-icon="require('../../assets/image/common_search.png')">
				<template #action>
					<div style="color: #026DFF;font-size: 0.14rem;padding-left: 0.1rem;" @click="onSearch">搜索</div>
				</template>
			</van-search>
			<van-search v-else v-model="searchValue" shape="round" show-action placeholder="客户名称/客户经理工号"
				@search="onSearch" :left-icon="require('../../assets/image/common_search.png')">
				<template #action>
					<div style="color: #026DFF;font-size: 0.14rem;padding-left: 0.1rem;" @click="onSearch">搜索</div>
					<div class="orgBtn ycsl" @click="$refs.orgList.showPopup()">{{chooseOrg.text}}</div>
				</template>
			</van-search>
			<div class="listBox">
				<div class="listTitle" style="width: 0.4rem;">排序</div>
				<div class="orderList">
					<div class="orderItemBox">
						<div class="orderItem" v-for="(orderItem,i) in orderList" :key="'orderItem'+i"
							@click="changeOrder(i)">
							<span>{{orderItem}}</span>
							<van-icon v-if="i!=orderIndex" :name="require('../../assets/image/common_order_none.png')"
								size="20" />
							<van-icon v-else-if="orderType" :name="require('../../assets/image/common_order_down.png')"
								size="20" />
							<van-icon v-else :name="require('../../assets/image/common_order_up.png')" size="20" />
						</div>
					</div>
				</div>
				<div class="boxBottom"></div>
			</div>
			<div class="listOutBox" :style="{height: moreBoxOpen?'2.12rem':'1.25rem'}">
				<div class="listBox">
					<div class="listTitle">当前阶段</div>
					<div class="list">
						<div class="item" v-for="(tageItem,i) in tageList" :key="'tageItem'+i"
							:class="tageIndex==i?'item_a':''" @click="changeTage(i)">
							<span>{{tageItem.codeName}}</span>
						</div>
					</div>
				</div>
				<div class="listBox topPadding0">
					<div class="listTitle">业务类型</div>
					<div class="list">
						<div class="item" v-for="(busiItem,i) in busiList" :key="'busiItem'+i"
							:class="busiIndex==i?'item_a':''" @click="changeBusi(i)">
							<span>{{busiItem.codeName}}</span>
						</div>
					</div>
				</div>
				<div class="listBox topPadding0">
					<div class="listTitle" style="width: 0.75rem;">预估获客数</div>
					<div class="list" style="width: calc(100% - 0.75rem);">
						<div class="item" :class="value1||value1===0||value2||value2===0?'':'item_a'" @click="allCst">全部
						</div>
						<div class="item_input">
							<van-field v-model="value1" placeholder="请输入最小值" :formatter="formatter1" type="number"
								input-align="center" @blur="changeInput" />
						</div>
						<div style="margin-right: 0.08rem;padding-top: 0.05rem;">—</div>
						<div class="item_input">
							<van-field v-model="value2" placeholder="请输入最大值" :formatter="formatter1" type="number"
								input-align="center" @blur="changeInput" />
						</div>
					</div>
				</div>
				<div class="listBox topPadding0">
					<div class="listTitle" style="width: 0.75rem;">预估成交额</div>
					<div class="list" style="width: calc(100% - 0.75rem);">
						<div class="item" :class="value3||value3===0||value4||value4===0?'':'item_a'" @click="allAmt">全部
						</div>
						<div class="item_input">
							<van-field v-model="value3" placeholder="请输入最小值" :formatter="formatter2" type="number"
								input-align="center" @blur="changeInput" />
						</div>
						<div style="margin-right: 0.08rem;padding-top: 0.05rem;">—</div>
						<div class="item_input">
							<van-field v-model="value4" placeholder="请输入最大值" :formatter="formatter2" type="number"
								input-align="center" @blur="changeInput" />
						</div>
					</div>
				</div>
				<div class="boxBottom" style="bottom: 0.3rem;"></div>
				<div class="moreBox" @click.stop="moreBoxOpen=!moreBoxOpen">
					<van-icon v-if="moreBoxOpen" name="arrow-up" color="#ADADAD" size="24" />
					<van-icon v-else name="arrow-down" color="#ADADAD" size="24" />
				</div>
				<div class="boxBottom"></div>
			</div>
			<div class="totalBox">
				<div class="total">
					<div>筛选结果：共{{total}}条数据</div>
					<div class="fpBtn" v-if="$store.state.userMsg.roleId!='00000004'&&!openPLFP"
						@click="checked=[];checkAll=false;openPLFP=true;">分配</div>
				</div>
				<div class="total">
					<div>预估获客数：{{estCstSum?Number(estCstSum).toLocaleString():"0"}}人</div>
					<div>预估成交额：{{fixedNum(estAmtSum)}}万元</div>
				</div>
			</div>
		</div>
		<div class="topZW">
			<div class="top1" :style="{height: fixedHeight}"></div>
			<div class="top2" :style="{height: moreBoxOpen?'0.87rem':'0rem'}"></div>
		</div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<van-checkbox-group v-model="checked" ref="checkboxGroup">
				<div v-for="(msgItem,i) in msgList" :key="'msgItem'+i" class="msgCardOutBox"
					:style="{'margin-left':openPLFP?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="msgItem.custNo" @click="checkAll=false"></van-checkbox>
					</div>
					<van-swipe-cell :disabled="openPLFP||!gtgh">
						<template #default>
							<div class="msgCardBox">
								<div class="msgCard" @click="openDetail(msgItem)">
									<div class="msgValue1">
										<div class="msgValue1Left ycsl">{{msgItem.cstName}}</div>
										<div class="msgValue1Right">
											<van-icon v-if="msgItem.isManageJudej=='1'"
												:name="require('../../assets/image/cust_zyqk_gh.png')" size="17" />
											<div class="msgValue1RightItem" style="background-color: #026DFF;">
												{{msgItem.busiTypeNm}}
											</div>
											<div class="msgValue1RightItem"
												:style="{'background-color':msgItem.curTage=='1'?'#FF8500':msgItem.curTage=='2'?'#FFBA00':msgItem.curTage=='3'?'#52C41A':'#CFCFCF'}">
												{{msgItem.curTageNm}}
											</div>
										</div>
									</div>
									<div class="msgValue2">
										<div class="msgValue2Left ycsl" v-if="msgItem.estAmt||msgItem.estAmt===0">
											<span class="msgTitleColor">预估成交额(万元)：</span>
											<span>{{fixedNum(msgItem.estAmt)}}</span>
										</div>
										<div class="msgValue2Right ycsl" v-if="msgItem.estCst||msgItem.estCst===0">
											<span class="msgTitleColor">预估获客数(人)：</span>
											<span>{{Number(msgItem.estCst).toLocaleString()}}</span>
										</div>
									</div>
									<div class="msgValue3">
										<div class="msgValue3Left">
											<span class="msgTitleColor">总用时：</span>
											<span>{{Math.trunc(msgItem.totalTime / (3600 * 24)) + "天" + (Math.trunc(msgItem.totalTime / 3600) % 24) + "小时"||"-"}}</span>
										</div>
										<div class="msgValue3Right">{{msgItem.newMarkTime}}</div>
									</div>
									<div class="msgValue4">
										<div class="msgValue4Left ycsl">
											<span class="msgTitleColor">机构名称：</span>
											<span>{{msgItem.orgName}}</span>
										</div>
										<div class="msgValue4Right ycsl">
											<span class="msgTitleColor">客户经理：</span>
											<span>{{msgItem.cstMagName}}</span>
										</div>
									</div>
								</div>
							</div>
						</template>
						<template #right>
							<div class="delBtn1" v-if="msgItem.isManageJudej=='1'"
								@click="delCustItem=msgItem;showDelGh=true;">取消管户</div>
							<div class="delBtn2" v-else @click="addGh(msgItem)">添加管户</div>
						</template>
					</van-swipe-cell>
				</div>
			</van-checkbox-group>
		</van-list>
		<div v-if="openPLFP" style="height: 0.55rem;"></div>
		<div class="bottomZW"></div>
		<div class="impQZCustAdd" :style="{'right':openPLFP?'-0.6rem':'0.2rem'}" @click="$router.push('impQZCustAdd')">
			<van-icon name="plus" color="#FFFFFF" />
		</div>
		<van-popup v-model:show="openPLFP" position="bottom" :overlay="false" :lock-scroll="false"
			safe-area-inset-bottom z-index="99998">
			<div class="bottomBox">
				<van-checkbox v-model="checkAll" ref="checkAll" @click="chooseAll">全选</van-checkbox>
				<div class="btnBox">
					<div class="bottomBtn bottomBtn1" @click="cancleCheck">取消</div>
					<div class="bottomBtn bottomBtn2" @click="confirmCheck">分配</div>
				</div>
			</div>
		</van-popup>
		<cust-list-cs ref="custList" @activeCust="activeCust" />
		<org-list ref="orgList" type="2" @activeOrg="activeOrg" />
		<van-overlay :show="showDelGh" z-index="11">
			<div class="plate6">
				<div class="plate6_5">确认取消管户？</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showDelGh=false">取消</div>
					<div class="palte6_4_2" @click="delGh">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryCustMgrSticReport,
		queryCustMgrSticLoginDtl
	} from "../../request/report.js";
	import {
		queryCustomersInfoList,
		updatePoteCustomersInfo,
		deleteCustomersMarketing,
		queryCustBaseSummary,
		saveCaretakerAPP,
		deleteCaretakerApp
	} from "../../request/custinfo.js";
	import custlistCS from "../../components/cust/custlistCS.vue";
	import {
		Toast,
		Dialog
	} from "vant";
	export default {
		data() {
			return {
				searchValue: "",
				orderIndex: null,
				orderType: true,
				orderList: ["创建时间", "当前阶段", "预估成交额", "预估获客数", "总用时"],
				tageIndex: 0,
				tageList: [],
				busiIndex: 0,
				busiList: [],
				moreBoxOpen: false,
				value1: "",
				value2: "",
				value3: "",
				value4: "",
				total: "0",
				estCstSum: "0",
				estAmtSum: "0",
				msgList: [],
				pageIndex: 0,
				loading: false,
				finished: false,
				chooseOrg: {
					text: "选择机构",
					value: ""
				},
				openPLFP: false,
				checked: [],
				checkAll: false,
				params: {
					pageSize: "10",
					pageNum: "1",
					orderType: "",
					cstName: "",
					cstMagNo: "",
					busiType: "",
					curTage: "",
					estCstStart: "",
					estCstEnd: "",
					estAmtStart: "",
					estAmtEnd: "",
					orgId: ""
				},
				fixedHeight: "0px",
				showDelGh: false,
				delCustItem: {},
				gtgh: false,
			}
		},
		components: {
			"cust-list-cs": custlistCS
		},
		methods: {
			onSearch() {
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeOrder(i) {
				if (i == this.orderIndex) {
					this.orderType = !this.orderType;
				} else {
					this.orderIndex = i;
					this.orderType = true;
				}
				switch (this.orderIndex) {
					case 0:
						if (this.orderType) this.params.orderType = "createDateD"
						else this.params.orderType = "createDateZ";
						break;
					case 1:
						if (this.orderType) this.params.orderType = "curTageD"
						else this.params.orderType = "curTageZ";
						break;
					case 2:
						if (this.orderType) this.params.orderType = "estAmtD"
						else this.params.orderType = "estAmtZ";
						break;
					case 3:
						if (this.orderType) this.params.orderType = "estCstD"
						else this.params.orderType = "estCstZ";
						break;
					case 4:
						if (this.orderType) this.params.orderType = "totalTimeD"
						else this.params.orderType = "totalTimeZ";
						break;
				}
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeTage(i) {
				if (i == this.tageIndex) return;
				this.tageIndex = i;
				this.params.curTage = this.tageList[this.tageIndex].codeValue;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeBusi(i) {
				if (i == this.busiIndex) return;
				this.busiIndex = i;
				this.params.busiType = this.busiList[this.busiIndex].codeValue;
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			changeInput() {
				this.params.estCstStart = this.value1;
				this.params.estCstEnd = this.value2;
				this.params.estAmtStart = this.value3;
				this.params.estAmtEnd = this.value4;
				if ((this.params.estCstStart || this.params.estCstStart === 0) && (this.params.estCstEnd || this.params
						.estCstEnd === 0)) {
					if (Number(this.params.estCstStart) > Number(this.params.estCstEnd)) {
						Toast.fail("最大值不能小于最小值")
						return;
					}
				}
				if ((this.params.estAmtStart || this.params.estAmtStart === 0) && (this.params.estAmtEnd || this.params
						.estAmtEnd === 0)) {
					if (Number(this.params.estAmtStart) > Number(this.params.estAmtEnd)) {
						Toast.fail("最大值不能小于最小值")
						return;
					}
				}
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			allCst() {
				this.params.estCstStart = this.value1 = "";
				this.params.estCstEnd = this.value2 = "";
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			allAmt() {
				this.params.estAmtStart = this.value3 = "";
				this.params.estAmtEnd = this.value4 = "";
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			activeCust(item) {
				updatePoteCustomersInfo({
					custNos: this.checked,
					cstMagName: item.empName,
					cstMagNo: item.empId,
					orgId: item.orgCode,
					orgName: item.orgName
				}, (res) => {
					Toast.success("分配成功");
					this.openPLFP = false;
					setTimeout(() => {
						this.pageIndex = 0;
						this.msgList = [];
						this.onLoad();
					}, 800)
				})
			},
			chooseAll() {
				this.$refs.checkboxGroup.toggleAll(this.checkAll);
			},
			cancleCheck() {
				this.openPLFP = false;
				this.$refs.checkboxGroup.toggleAll(false);
			},
			confirmCheck() {
				if (!this.checked.length) {
					Toast.fail("请先选择至少1条数据");
					return;
				}
				this.$refs.custList.showPopup()
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
				this.pageIndex = 0;
				this.msgList = [];
				this.onLoad();
			},
			delCust(custNo) {
				Dialog.confirm({
					message: '确认删除该客户？',
				}).then(() => {
					deleteCustomersMarketing({
						custNo
					}, (res) => {
						Toast.success("删除成功");
						this.pageIndex = 0;
						this.msgList = [];
						this.onLoad();
					})
				}).catch(() => {

				});;
			},
			delGh() {
				this.showDelGh = false;
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0
				});
				deleteCaretakerApp({
					custNo: this.delCustItem.custNo
				}, (res) => {
					this.delCustItem.isManageJudej = "0";
					Toast.success("操作成功");
				})
			},
			addGh(item) {
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0
				});
				saveCaretakerAPP({
					custNo: item.custNo
				}, (res) => {
					item.isManageJudej = "1";
					Toast.success("操作成功");
				})
			},
			openGtgh() {
				this.$router.push({
					name: 'gtghList',
				})
			},
			formatter1(val) {
				if (val != "" && val == 0) {
					return 0;
				} else if (val.length > 1 && val[0] == 0 && val[1] != ".") {
					return Number(val)
				} else {
					return val.split(".")[0];
				}
			},
			formatter2(val) {
				if (val != "" && val[1] != "." && val == 0) {
					return 0;
				} else if (val.length > 1 && val[0] == 0 && val[1] != ".") {
					return Number(val)
				} else {
					return val;
				}
			},
			fixedNum(val) {
				if (!val) return "0.00";
				val = Number(val).toFixed(2);
				var re = /\d{1,3}(?=(\d{3})+$)/g;
				return val.toString().replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => {
					return s1.replace(re, "$&,") + s2;
				});
			},
			openDetail(item) {
				this.$router.push({
					name: 'impQZCustDetail',
					params: item
				})
			},
			onLoad() {
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.params.pageNum = (++this.pageIndex).toString();
				this.params.orgId = this.chooseOrg.value;
				this.loading = true;
				if (this.pageIndex == "1") {
					if (this.$store.state.userMsg.roleId == '00000004') {
						this.params.cstName = this.searchValue;
					} else {
						if (Number(this.searchValue)) {
							this.params.cstName = "";
							this.params.cstMagNo = this.searchValue;
						} else {
							this.params.cstName = this.searchValue;
							this.params.cstMagNo = "";
						}
					}
					queryCustBaseSummary(this.params, (res) => {
						if (res.data.records.length) {
							this.estCstSum = res.data.records[0].estCstSum;
							this.estAmtSum = res.data.records[0].estAmtSum;
						} else {
							this.estCstSum = "0";
							this.estAmtSum = "0";
						}
					})
				};
				queryCustomersInfoList(this.params, (res) => {
					if (res.data && res.data.records) {
						this.total = res.data.total;
						this.msgList = this.msgList.concat(res.data.records);
						this.checkAll = false;
						if (this.msgList.length >= res.data.total) this.finished = true;
					} else {
						this.finished = true;
					}
					this.$nextTick(() => {
						Toast.clear();
						this.loading = false;
						this.$forceUpdate();
					})
				})
			},
			mounted_m() {
				var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName("fixedPlace")[0],
					null);
				this.gtgh = this.$store.state.userMsg.roleId == '00000001' || this.$store.state.userMsg.roleId ==
					'00000002' ||
					this.$store.state.userMsg.roleId == '00000003' || this.$store.state.userMsg.roleId == '00000006' ||
					this
					.$store.state.userMsg.roleId == '00000007' || this.$store.state.userMsg.roleId == '00000008';
				this.fixedHeight = fixedPlace.height;
				this.onLoad();
			}
		},
		beforeRouteEnter(to, from, next) {
			if (from.name == "cust") {
				localStorage.setItem("newImpQZCust", "1")
			} else {
				localStorage.setItem("newImpQZCust", "0")
			};
			next();
		},
		mounted() {
			localStorage.setItem("newImpQZCust", "0");
			getSysCodeByType({
				codeType: "cur_tage"
			}, (res) => {
				if (res.data) {
					this.tageList = res.data;
					this.tageList.unshift({
						codeName: "全部阶段",
						codeValue: ""
					})
				} else {
					Toast.fail("阶段列表数据为空")
				}
			})
			getSysCodeByType({
				codeType: "BUSI_TYPE"
			}, (res) => {
				if (res.data) {
					this.busiList = res.data;
					this.busiList.unshift({
						codeName: "全部业务",
						codeValue: ""
					})
				} else {
					Toast.fail("业务类型列表数据为空")
				}
			})
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("newImpQZCust") == "0") {
				localStorage.setItem("newImpQZCust", "1")
			} else {
				this.searchValue = "";
				this.orderIndex = null;
				this.orderType = true;
				this.tageIndex = 0;
				this.busiIndex = 0;
				this.moreBoxOpen = false;
				this.value1 = "";
				this.value2 = "";
				this.value3 = "";
				this.value4 = "";
				this.total = "0";
				this.estCstSum = "0";
				this.estAmtSum = "0";
				this.msgList = [];
				this.pageIndex = 0;
				this.loading = false;
				this.finished = false;
				this.chooseOrg = {
					text: "选择机构",
					value: ""
				};
				this.openPLFP = false;
				this.checked = [];
				this.checkAll = false;
				this.params = {
					pageSize: "10",
					pageNum: "1",
					orderType: "",
					cstName: "",
					cstMagNo: "",
					busiType: "",
					curTage: "",
					estCstStart: "",
					estCstEnd: "",
					estAmtStart: "",
					estAmtEnd: "",
					orgId: ""
				};
				this.fixedHeight = "0px";
				this.showDelGh = false;
				this.delCustItem = {};
				this.gtgh = false;
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

	.home {
		overflow: hidden;
		background-color: #F5F5F5;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 0.46rem);
		top: calc(env(safe-area-inset-top) + 0.46rem);
		left: 0;
		z-index: 11;
	}

	.fixedPlace :deep(.van-search) {
		padding: 0.15rem 0.1rem 0.04rem 0.15rem;
	}

	.impQZCustAdd {
		position: fixed;
		bottom: calc(0.2rem + constant(safe-area-inset-bottom));
		bottom: calc(0.2rem + env(safe-area-inset-bottom));
		width: 0.56rem;
		height: 0.56rem;
		background-color: #026DFF;
		border-radius: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.4rem;
		transition: right 0.3s;
	}

	.listOutBox {
		width: 100%;
		position: relative;
		overflow: hidden;
		padding-bottom: 0.3rem;
		transition: height 0.3s;
	}

	.listBox {
		background-color: #FFFFFF;
		width: 100%;
		height: 0.55rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		font-size: 0.13rem;
		padding: 0.17rem 3%;
		position: relative;
		color: #8C8C8C;
	}

	.topPadding0 {
		height: 0.42rem;
		padding-top: 0.04rem;
	}

	.listTitle {
		width: 0.6rem;
		text-align: left;
		font-size: 0.14rem;
		color: #262626;
	}

	.orderList {
		width: calc(100% - 0.4rem);
		overflow-x: auto;
	}

	.orderItemBox {
		width: 130%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
	}

	.orderList::-webkit-scrollbar {
		display: none;
	}

	.orderItem {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.list {
		width: calc(100% - 0.6rem);
		overflow: auto;
		display: flex;
		flex-wrap: nowrap;
		padding: 0 0.05rem;
	}

	.list::-webkit-scrollbar {
		display: none;
	}

	.item {
		width: 0.75rem;
		line-height: 0.3rem;
		flex-shrink: 0;
		background-color: #F5F5F5;
		border-radius: 0.5rem;
		margin-right: 0.08rem;
	}

	.item_input {
		width: 1.1rem;
		height: 0.3rem;
		flex-shrink: 0;
		background-color: #F5F5F5;
		border-radius: 0.5rem;
		margin-right: 0.08rem;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.item_input:deep(.van-field__control) {
		background-color: #F5F5F5;
	}

	.item:last-child,
	.item_input:last-child {
		margin: 0;
	}

	.item_a {
		color: #026DFF;
		background-color: #E0EDFF;
	}

	.boxBottom {
		position: absolute;
		box-sizing: border-box;
		width: 94%;
		bottom: 0;
		left: 3%;
		border-bottom: 1px solid var(--van-cell-border-color);
	}

	.moreBox {
		width: 100%;
		height: 0.3rem;
		background-color: #FFFFFF;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.totalBox {
		width: 100%;
		padding: 0.06rem 0 0.02rem;
		background-color: #F5F5F5;
	}

	.total {
		font-size: 0.1rem;
		color: #262626;
		height: 0.24rem;
		padding: 0 0.15rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.fpBtn {
		font-size: 0.13rem;
		color: #0066FF;
	}

	.top1 {
		width: 100%;
	}

	.top2 {
		width: 100%;
		transition: height 0.3s;
	}

	.msgCardOutBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
	}

	:deep(.van-swipe-cell) {
		width: 100%;
		flex-shrink: 0;
	}

	.msgCardBox {
		width: 100%;
		padding: 0.06rem 3%;
	}

	.msgCard {
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 0 0 0.08rem -0.02rem #E0E0E0;
		border-radius: 0.1rem;
		font-size: 0.16rem;
		padding: 0.1rem 0.15rem;
	}

	:deep(.van-swipe-cell__right) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delBtn1 {
		width: 0.5rem;
		height: 0.45rem;
		font-size: 0.1rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border-radius: 0.25rem;
		margin: 0 0.3rem 0 0.2rem;
		background: url(../../assets/image/cust_zyqk_ghDel.png) no-repeat center top;
		background-size: 0.28rem 0.28rem;
	}

	.delBtn2 {
		width: 0.5rem;
		height: 0.45rem;
		font-size: 0.1rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border-radius: 0.25rem;
		margin: 0 0.3rem 0 0.2rem;
		background: url(../../assets/image/cust_zyqk_ghAdd.png) no-repeat center top;
		background-size: 0.28rem 0.28rem;
	}

	.leftCheckBox {
		width: 12%;
		height: 0.2rem;
		flex-shrink: 0;
		position: absolute;
		left: -15%;
		display: flex;
		justify-content: flex-end;
	}

	.msgValue1 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.12rem;
	}

	.msgValue1Left {
		font-size: 0.18rem;
		font-weight: 500;
		flex-shrink: 1;
	}

	.msgValue1Right {
		display: flex;
		flex-shrink: 0;
	}

	.msgValue1RightItem {
		background-color: #2C3E50;
		color: #FFFFFF;
		font-size: 0.1rem;
		padding: 0.01rem 0.05rem;
		margin-left: 0.05rem;
		border-top-left-radius: 0.05rem;
		border-bottom-right-radius: 0.05rem;
	}

	.msgValue2,
	.msgValue3,
	.msgValue4 {
		width: 100%;
		font-size: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		margin-bottom: 0.08rem;
		justify-content: space-between;
	}

	.msgValue2Left,
	.msgValue3Left,
	.msgValue4Left {
		text-align: left;
		width: 60%;
		flex-shrink: 1;
	}

	.msgValue2Right,
	.msgValue3Right {
		text-align: left;
		width: 40%;
		flex-shrink: 1;
	}

	.msgValue3 {
		border-bottom: solid 0.01rem #F5F5F5;
		padding-bottom: 0.08rem;
	}

	.msgValue4 {
		margin: 0.1rem 0 0;
	}

	.msgValue4Right {
		text-align: left;
		width: 40%;
		flex-shrink: 1;
	}

	.msgTitleColor {
		color: #999999;
	}

	.bottomBox {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		height: 0.55rem;
		font-size: 0.12rem;
		padding-left: 6.5%;
		padding-right: 3%;
		border-top: solid 1px #F5F5F5;
	}

	.bottomBox :deep(.van-checkbox__label) {
		color: #888888;
	}

	.btnBox {
		display: flex;
		flex-wrap: nowrap;
	}

	.bottomBtn {
		padding: 0.07rem 0.2rem;
		margin-right: 0.1rem;
		border-radius: 0.05rem;
	}

	.bottomBtn1 {
		color: #026DFF;
		background-color: #FFFFFF;
		border: solid 0.01rem #026DFF;
	}

	.bottomBtn2 {
		color: #FFFFFF;
		background-color: #026DFF;
		border: solid 0.01rem #026DFF;
	}

	:deep(.van-field__left-icon) {
		display: flex;
		align-items: center;
		margin-right: 0.08rem;
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

	:deep(.van-search__action) {
		display: flex;
		flex-wrap: nowrap;
		padding: 0;
	}

	.orgBtn {
		border-left: solid 0.01rem #EFEFEF;
		color: #026DFF;
		margin-left: 0.06rem;
		padding-left: 0.06rem;
		width: 1.05rem;
	}
</style>
