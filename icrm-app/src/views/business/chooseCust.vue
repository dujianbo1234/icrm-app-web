<template>
	<div class="home">
		<nav-bar title="选择客户" type="2" leftIcon />
		<div class="fixedPlace">
			<div class="plate1">
				<div class="plate1_1">{{baseMsg.cmrcOpptSubclassNm}}</div>
				<div class="scorePane">
					<div class="leftPane">
						<div class="scoreNum">{{scoreNum?Number(scoreNum).toFixed(1):0}}</div>
						<div class="scoreStar">
							<van-rate v-model="scoreNum" :size="16" color="#FFBA00" void-icon="star" readonly
								void-color="#E0E0E0" gutter="2" />
						</div>
						<div class="scoreBottom">
							<div class="scorePeople">{{visitNum || 0}}人浏览</div>
							<div class="scorePeople">{{scorePeople || 0}}人评论</div>
						</div>
					</div>
					<div class="rightPane">
						<div class="rowStyle">
							<div>5.0</div>
							<van-progress track-color="#F4F5F9" color="#FFBA00" :percentage="progressList.five"
								stroke-width="5" />
						</div>
						<div class="rowStyle">
							<div>4.0</div>
							<van-progress track-color="#F4F5F9" color="#FFBA00" :percentage="progressList.four"
								stroke-width="5" />
						</div>
						<div class="rowStyle">
							<div>3.0</div>
							<van-progress track-color="#F4F5F9" color="#FFBA00" :percentage="progressList.three"
								stroke-width="5" />
						</div>
						<div class="rowStyle">
							<div>2.0</div>
							<van-progress track-color="#F4F5F9" color="#FFBA00" :percentage="progressList.two"
								stroke-width="5" />
						</div>
						<div class="rowStyle">
							<div>1.0</div>
							<van-progress track-color="#F4F5F9" color="#FFBA00" :percentage="progressList.one"
								stroke-width="5" />
						</div>
						<div class="wantScore" v-if="changeScore" @click="showScore=true">
							<div>我也想评分？</div>
						</div>
						<div class="myScore" v-else>
							<p style="margin-right:0.03rem">我的评分</p>
							<p>
								<van-rate v-model="myScore" :size="12" color="#FFBA00" void-icon="star" readonly
									void-color="#E0E0E0" gutter="2" />
							</p>
							<p class="scoreEdit" @click="editScore"><img src="../../assets/image/scoreEdit.png" alt="">
							</p>
						</div>
					</div>
				</div>
				<div class="plate1_2">
					<!-- <div class="plate1_2_1">
						<van-rate v-model="baseMsg.practialScore" :size="16" color="#FFBA00" void-icon="star" readonly
							void-color="#E0E0E0" allow-half gutter="2" />
						<div class="plate1_2_1_value">{{baseMsg.practialScore}}</div>
					</div> -->
					<div class="plate1_2_2">到期日期：{{baseMsg.cmrcOpptExpDay}}</div>
				</div>
				<div class="plate1_3">{{baseMsg.keyWords}}</div>
				<div class="plate1_4" :class="openDesc?'':'plate1_4_close'">商机描述：{{baseMsg.cmrcOpptDsc}}</div>
			</div>
			<div class="plate2" @click="openDesc=!openDesc;resetTop();">
				<van-icon v-if="openDesc" name="arrow-up" size="20" color="#8C8C8C" />
				<van-icon v-else name="arrow-down" size="20" color="#8C8C8C" />
			</div>
			<!-- <div class="plate3" v-if="openSearch"> -->
			<div class="plate3">
				<van-search v-model="searchValue" shape="round" show-action placeholder="请输入关键词进行搜索" @search="onSearch"
					@blur="onSearch" :left-icon="require('../../assets/image/common_search.png')">
					<template #action>
					</template>
				</van-search>
			</div>
			<!-- <div class="plate4" v-if="!openSearch">
				
				<div class="plate4_2" v-if="!openSearch" @click="openSearch=true;resetTop();">
					<div class="plate4_2_1"></div>
					<van-icon :name="require('../../assets/image/common_search_black.png')" size="16" color="#262626"
						style="margin: 0 0.08rem;" />
					<div class="plate4_2_2">搜索</div>
				</div>
			</div> -->
			<div class="plate5">
				<div class="plate5_father" :style="{width: statusList.length*0.84+0.16+'rem'}">
					<div :class="i==statusIndex?'plate5_child_a':'plate5_child'" v-for="(levelItem,i) in statusList"
						:key="'levelItem'+i" @click="changeStatus(i)">
						{{levelItem.text}}
					</div>
				</div>
			</div>
			<div class="plate5">
				<div class="plate5_father" :style="{width: levelList.length*0.84+0.16+'rem'}">
					<div :class="i==levelIndex?'plate5_child_a':'plate5_child'" v-for="(levelItem,i) in levelList"
						:key="'levelItem'+i" @click="changeLevel(i)">
						{{levelItem.text}}
					</div>
				</div>
			</div>

			<div class="total">
				<div>筛选结果：共{{Number(total).toLocaleString()}}条数据</div>
				<template v-if="canFP">
					<div class="fpBtn" v-if="openFP" @click="checked=[];openFP=false;">取消分配</div>
					<div class="fpBtn" v-else @click="openFP=true">分配</div>
				</template>
			</div>
		</div>
		<div :style="{height: fixedHeight}"></div>
		<div class="autoPlace" ref="autoPlace" :style="{height: `calc(100vh - ${topHeight}px - ${fixedHeight})`}">
			<van-list v-model:loading="loading" :finished="finished" :immediate-check="false" finished-text="已加载全部数据"
				@load="onLoad">
				<van-checkbox-group v-model="checked" ref="checkboxGroup">
					<div v-for="(item,i) in custList" :key="'item'+i" class="msgCardOutBox"
						:style="{'margin-left':openFP?'15%':'0%'}">
						<div class="leftCheckBox">
							<van-checkbox :name="item.sysId" :disabled="item.cmrcOpptSt!='2'"></van-checkbox>
						</div>
						<div class="msgCardBox">
							<div class="custItem" @click="openDetail(item)">
								<div class="custItem1">
									<div class="custItem1_1"></div>
									<div class="custItem1_2">
										<div class="custItem1_2_1">{{item.custNm}}</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='0'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type0.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='1'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='2'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='3'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='4'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='5'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}">
										</div>
										<div class="custItem1_2_2" v-if="item.svcLvl=='6'"
											:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}">
										</div>
										<div class="custItem1_2_3">
											<div class="custItem1_2_3_item" v-if="item.vipCstFlg=='1'"
												style="background-color: rgba(2,109,255,0.08);color: #026DFF;">财</div>
											<div class="custItem1_2_3_item" v-if="item.agentPayCstFlg=='1'"
												style="background-color: rgba(255,133,0,0.08);color: #FF8500;">代</div>
											<div class="custItem1_2_3_item" v-if="item.newCstFlg=='1'"
												style="background-color: rgba(255,58,58,0.08);color: #FF3A3A;">新</div>
											<div class="custItem1_2_3_item" v-if="item.merntCstFlg=='1'"
												style="background-color: rgba(68,107,161,0.08);color: #446BA1;">商</div>
											<div class="custItem1_2_3_item" v-if="item.ioinHoldLoan=='1'"
												style="background-color: rgba(55,205,55,0.08);color: #13AD13;">贷</div>
											<div class="custItem1_2_3_item" v-if="item.crdtCrdCstFlg=='1'"
												style="background-color: rgba(55,205,55,0.08);color: #13AD13;">信</div>
											<van-icon v-if="item.ioinSgnMobbank=='1'"
												:name="require('../../assets/image/business_chooseCust_jjyh_a.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-else
												:name="require('../../assets/image/business_chooseCust_jjyh.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-if="item.ioinSgnAlpy=='1'"
												:name="require('../../assets/image/business_chooseCust_zfb_a.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-else
												:name="require('../../assets/image/business_chooseCust_zfb.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-if="item.ioinSgnWchtPymt=='1'"
												:name="require('../../assets/image/business_chooseCust_wx_a.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-else
												:name="require('../../assets/image/business_chooseCust_wx.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-if="item.ioinSgnYsf=='1'"
												:name="require('../../assets/image/business_chooseCust_ysf_a.png')"
												size="16" style="margin-right: 0.04rem;" />
											<van-icon v-else
												:name="require('../../assets/image/business_chooseCust_ysf.png')"
												size="16" style="margin-right: 0.04rem;" />
										</div>
									</div>
									<div class="custItem1_3" v-if="item.cmrcOpptSt=='2'"
										style="background-color: #026DFF;">
										待跟进</div>
									<div class="custItem1_3" v-if="item.cmrcOpptSt=='4'"
										style="background-color: #FFBA00;">
										已跟进</div>
									<div class="custItem1_3" v-if="item.cmrcOpptSt=='5'"
										style="background-color: #52C41A;">
										已成交</div>
								</div>
								<div class="custItem2">
									<div class="custItem2_child">
										<span class="custItem2_childName">极差值：</span>
										<span class="custItem2_childValue">{{formatNum(item.aumDifVal/10000)}}万元</span>
									</div>
									<div class="custItem2_child">
										<span class="custItem2_childName">历史最高资产：</span>
										<span
											class="custItem2_childValue">{{formatNum(item.aumHistHestVal/10000)}}万元</span>
									</div>
									<div class="custItem2_child">
										<span class="custItem2_childName">AUM资产：</span>
										<span class="custItem2_childValue">{{formatNum(item.aumBal/10000)}}万元</span>
									</div>
									<div class="custItem2_child">
										<span class="custItem2_childName">定期：</span>
										<span
											class="custItem2_childValue">{{formatNum(item.timeDpsitBal/10000)}}万元</span>
									</div>
									<div class="custItem2_child">
										<span class="custItem2_childName">活期：</span>
										<span
											class="custItem2_childValue">{{formatNum(item.currDpsitBal/10000)}}万元</span>
									</div>
									<div class="custItem2_child">
										<span class="custItem2_childName">贷款：</span>
										<span class="custItem2_childValue">{{formatNum(item.loanBal/10000)}}万元</span>
									</div>
									<div class="custItem2_child" v-if="$store.state.userMsg.roleId!='00000004'">
										<span class="custItem2_childName">客户经理：</span>
										<span class="custItem2_childValue">{{item.belgCustMgrNm}}</span>
									</div>
									<div class="custItem2_child ycsl" v-if="$store.state.userMsg.roleId!='00000004'">
										<span class="custItem2_childName">机构：</span>
										<span class="custItem2_childValue">{{item.belongOrgNm}}</span>
									</div>
								</div>
								<div class="custItem3"></div>
								<div class="custItem4">
									<div class="custItem4_1" :class="item.openRecomRea?'':'ycsl'">
										<span style="color: #026DFF;font-weight: 600;">#推荐理由#</span>
										<span>{{item.recomRea}}</span>
									</div>
									<div class="custItem4_2" @click.stop="item.openRecomRea=!item.openRecomRea">
										<van-icon v-if="item.openRecomRea" name="arrow-up" color="#8C8C8C" size="16" />
										<van-icon v-else name="arrow-down" color="#8C8C8C" size="16" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-checkbox-group>
			</van-list>
			<div class="bottomZW"></div>
		</div>
		<!-- <org-list ref="orgList" :type="2" @close="openOrgList=false" @activeOrg="activeOrg" />
		<customer-list ref="custList" :orgId="chooseOrg.value" @close="openCustList=false" @activeCust="activeCust" /> -->
		<customer-list ref="custList1" :allBtn="false" :resetIt="true" :selfAct="false" @close="openCustList1=false"
			@activeCust="activeCust1" />
		<van-popup v-model:show="openFP" position="bottom" :overlay="false" :lock-scroll="false" safe-area-inset-bottom
			z-index="99998">
			<div class="bottomBox">
				<div></div>
				<div class="btnBox">
					<div class="bottomBtn" @click="confirmCheck('all')">全部分配</div>
					<div class="bottomBtn" @click="confirmCheck('choose')">分配</div>
				</div>
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
		<van-overlay :show="showScore" :z-index="99999">
			<div class="plate6">
				<div class="plate6_1">评分</div>
				<div class="plate6_5">
					<van-rate v-model="score_c" :size="25" color="#FFBA00" void-icon="star" void-color="#E0E0E0"
						gutter="3" />
				</div>
				<div class="plate6_3">
					<span class="plate6_3_1" v-show="score_c>0">{{score_c.toFixed(1)}}</span>
					<span class="plate6_3_2" v-if="score_c==0"></span>
					<span class="plate6_3_2" v-else-if="score_c==1">很差</span>
					<span class="plate6_3_2" v-else-if="score_c==2">较差</span>
					<span class="plate6_3_2" v-else-if="score_c==3">一般</span>
					<span class="plate6_3_2" v-else-if="score_c==4">较好</span>
					<span class="plate6_3_2" v-else-if="score_c==5">很好</span>
				</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showScore=false">取消</div>
					<div class="palte6_4_2" @click="sureScore">提交</div>
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
		formatNum
	} from "../../api/common.js";
	import {
		queryCmrcOpportunityList,
		queryCmrcOpportunitySumInfo,
		distributeCmrcOpport,
		queryOpportPractialInfo,
		queryOpportunityScoringProgress,
		queryOpportPractialCount,
		saveOpportPractialInfo,
		saveSmAppVisitInfo,
		querySmAppVisitSum
	} from "../../request/market.js";
	import {
		Toast
	} from "vant";
	import customerList from "../../components/common/customerList.vue";
	export default {
		data() {
			return {
				score_c: 0,
				showScore: false,
				baseMsg: {},
				openDesc: false,
				openSearch: false,
				openOrgList: false,
				chooseOrg: {
					text: "全部机构",
					value: ""
				},
				openCustList: false,
				chooseCust: {
					empName: "客户经理",
					empId: ""
				},
				searchValue: "",
				levelIndex: 0,
				statusIndex: 0,
				levelList: [{
					text: "全部",
					value: ""
				}],
				statusList: [{
					text: "全部",
					value: ""
				}],
				custList: [],
				fixedHeight: "2.5rem",
				topHeight: "0",
				loading: false,
				finished: false,
				pageIndex: 0,
				total: "0",
				openFP: false,
				checked: [],
				canFP: false,
				openCustList1: false,
				chooseCust1: {
					empName: "客户经理",
					empId: ""
				},
				showFP: false,
				FPType: "",
				myScore: '',
				progressList: {},
				scoreNum: '',
				changeScore: true,
				scorePeople: '',
				visitNum: '',
				isEditScore: false,
				scoreId: ''
			}
		},
		components: {
			customerList
		},
		methods: {
			editScore() {
				this.showScore = true
				this.isEditScore = true
			},
			sureScore() {
				if (!this.score_c) return;
				let params = {}
				if (this.isEditScore) {
					params = {
						scoreId: this.scoreId,
						score: this.score_c
					}
				} else {
					params = {
						// sysId: this.$route.params.sysId,
						cmrcOpptId: this.baseMsg.cmrcOpptId,
						cmrcOpptSubclass: this.baseMsg.cmrcOpptSubclass,
						score: this.score_c
					}
				}
				console.log('params', params)
				saveOpportPractialInfo(params, (res) => {
					console.log('saveOpportPractialInfo', res)
					if (res.data == "操作成功") {
						this.showScore = false
						Toast("发布成功~感谢您的评价");
						this.changeScore = false;
						this.queryOpportPractialInfo();
						this.queryOpportunityScoringProgress()
						this.queryOpportPractialCount()
					}
				});
			},
			formatNum,
			resetTop() {
				this.$nextTick(() => {
					var fixedPlace = document.defaultView.getComputedStyle(document.getElementsByClassName(
						"fixedPlace")[0], null);
					this.fixedHeight = fixedPlace.height;
					this.topHeight = document.getElementsByClassName("fixedPlace")[0].offsetTop;
				})
			},
			onSearch() {
				this.pageIndex = 0;
				this.loading = true;
				this.custList = [];
				this.checked = [];
				this.openFP = false;
				this.onLoad();
			},
			onCancel() {
				this.openSearch = false;
				this.resetTop();
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
				this.chooseCust = {
					empName: "客户经理",
					empId: ""
				};
				this.openOrgList = false;
				this.pageIndex = 0;
				this.loading = true;
				this.custList = [];
				this.checked = [];
				this.openFP = false;
				this.onLoad();
			},
			activeCust(custValue) {
				if (custValue.empId) {
					this.chooseCust = custValue
				} else {
					this.chooseCust = {
						empName: "客户经理",
						empId: ""
					}
				};
				this.openCustList = false;
				this.pageIndex = 0;
				this.loading = true;
				this.custList = [];
				this.checked = [];
				this.openFP = false;
				this.onLoad();
			},
			changeLevel(i) {
				this.levelIndex = i;
				this.pageIndex = 0;
				this.loading = true;
				this.custList = [];
				this.checked = [];
				this.openFP = false;
				this.onLoad();
			},
			changeStatus(i) {
				this.statusIndex = i;
				this.pageIndex = 0;
				this.loading = true;
				this.custList = [];
				this.checked = [];
				this.openFP = false;
				this.onLoad();
			},
			openDetail(item) {
				localStorage.setItem("autoPlaceScrollTop", String(this.$refs.autoPlace.scrollTop))
				console.log(item)
				this.$router.push({
					name: 'busiDetail',
					params: {
						sysId: item.sysId,
						custNo: item.custNo
					}
				})
			},
			confirmCheck(type) {
				if (type == "choose" && !this.checked.length) {
					Toast.fail("请先选择至少1条数据");
					return;
				}
				this.FPType = type;
				this.$refs.custList1.showPopup();
			},
			activeCust1(custValue) {
				this.chooseCust1 = custValue;
				this.showFP = true;
			},
			checkFP() {
				this.showFP = false;
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0
				});
				var params = {
					cmrcOpptId: this.baseMsg.cmrcOpptId,
					svcLvl: "",
					custNm: "",
					belgCustMgr: "",
					belongOrg: "",
					followUpPrsn: this.chooseCust1.empId,
					followUpPrsnNm: this.chooseCust1.empName,
					followUpOrg: this.chooseCust1.orgCode,
					followUpOrgNm: this.chooseCust1.orgName,
					sysIds: [],
				}
				switch (this.FPType) {
					case "all":
						params.svcLvl = this.levelList[this.levelIndex].value;
						params.cmrcOpptSt = this.statusList[this.statusIndex].value;
						params.custNm = this.searchValue;
						params.belgCustMgr = this.chooseCust.empId;
						params.belongOrg = this.chooseOrg.value;
						break;
					case "choose":
						params.sysIds = this.checked;
						break;
				}
				distributeCmrcOpport(params, (res) => {
					Toast.success("分配成功");
					this.$refs.custList1.cancle();
					this.showFP = false;
					setTimeout(() => {
						this.pageIndex = 0;
						this.loading = true;
						this.custList = [];
						this.checked = [];
						this.openFP = false;
						this.onLoad();
					}, 800)
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
				queryCmrcOpportunityList({
					pageSize: "10",
					pageNum: this.pageIndex,
					cmrcOpptId: this.baseMsg.cmrcOpptId,
					svcLvl: this.levelList[this.levelIndex].value,
					cmrcOpptSt: this.statusList[this.statusIndex].value,
					custNm: this.searchValue,
					belgCustMgr: this.chooseCust.empId,
					belongOrg: this.chooseOrg.value
				}, (res) => {
					if (res.data && res.data.records) {
						this.total = res.data.total;
						res.data.records.forEach((item) => {
							item.openRecomRea = false
						});
						this.custList = this.custList.concat(res.data.records);
						if (this.custList.length >= res.data.total) this.finished = true;
					} else {
						this.finished = true;
					}
					Toast.clear();
					this.loading = false;
				})
			},
			mounted_m() {
				this.canFP = this.$store.state.userMsg.roleId == "00000002" || this.$store.state.userMsg.roleId ==
					"00000003" || this.$store.state.userMsg.roleId == "00000008" || this.$store.state.userMsg.roleId ==
					"00000009";
				this.baseMsg.cmrcOpptId = this.$route.params.cmrcOpptId || localStorage.getItem("cmrcOpptId");
				this.onLoad();
				queryCmrcOpportunitySumInfo({
					cmrcOpptId: this.baseMsg.cmrcOpptId
				}, (res) => {
					this.baseMsg = res.data;
					this.resetTop();
				})
				saveSmAppVisitInfo({
					busiType: "5"
				}, (res) => {

				});
				querySmAppVisitSum({
					busiType: "5"
				}, (res) => {
					if (res.data) {
						this.visitNum = res.data.visitNum;
					}
				});
				getSysCodeByType({
					codeType: "SVC_LVL_SHOW"
				}, (res) => {
					if (res.data) {
						var arr = res.data.map((item) => {
							return {
								text: item.codeName,
								value: item.codeValue
							}
						})
						this.levelList = this.levelList.concat(arr);
						this.resetTop();
					} else {
						Toast.fail("服务等级数据为空")
					}
				});
				getSysCodeByType({
					codeType: "CMRC_OPPT_ST"
				}, (res) => {
					if (res.data) {
						var arr = res.data.map((item) => {
								return {
								text: item.codeName,
								value: item.codeValue
							}
						})
						this.statusList=this.statusList.concat(arr)
						this.statusList=this.statusList.slice(0,4);
						this.resetTop();
					} else {
						Toast.fail("服务等级数据为空")
					}
				});
			},
			// 查询本人商机评分
			queryOpportPractialInfo() {
				queryOpportPractialInfo({
					createPerson: this.$store.state.userMsg.empno,
					cmrcOpptId: this.baseMsg.cmrcOpptId,
				}, (res) => {
					this.myScore = res.data.score
					this.scoreId = res.data.scoreId;
					if (this.myScore) {
						this.changeScore = false
					} else {
						this.changeScore = true
					}
					console.log('this.myScore', this.myScore)
				})
			},
			// 查询商机进度条
			queryOpportunityScoringProgress() {
				queryOpportunityScoringProgress({
					cmrcOpptId: this.baseMsg.cmrcOpptId,
				}, (res) => {
					this.progressList = res.data;
				})
			},
			// 查询商机评分数量
			queryOpportPractialCount() {
				queryOpportPractialCount({
					cmrcOpptId: this.baseMsg.cmrcOpptId,
				}, (res) => {
					this.scoreNum = res.data.score;
					this.scorePeople = res.data.countNb
				})
			},

		},
		activated() {
			localStorage.setItem("newBusiness", "0");
			if (this.$route.params.cmrcOpptId) {
				this.baseMsg = {};
				this.openDesc = false;
				this.openSearch = false;
				this.openOrgList = false;
				this.chooseOrg = {
					text: "全部机构",
					value: ""
				};
				this.openCustList = false;
				this.chooseCust = {
					empName: "客户经理",
					empId: ""
				};
				this.searchValue = "";
				this.levelIndex = 0;
				this.statusIndex = 0;

				this.levelList = [{
					text: "全部",
					value: ""
				}];
				this.statusList = [{
					text: "全部",
					value: ""
				}];
				this.fixedHeight = "2.5rem";
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.custList = [];
				this.total = "0";
				this.openFP = false;
				this.checked = [];
				this.canFP = false;
				this.openCustList1 = false;
				this.chooseCust1 = {
					empName: "客户经理",
					empId: ""
				};
				this.showFP = false;
				this.FPType = "";
				this.mounted_m();
				this.queryOpportPractialInfo()
				this.queryOpportunityScoringProgress()
				this.queryOpportPractialCount()
			} else {
				this.resetTop();
				this.$refs.autoPlace.scrollTop = Number(localStorage.getItem("autoPlaceScrollTop"))
			}
		},
		mounted() {}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.autoPlace {
		overflow-y: auto;
		overflow-x: hidden;
		height: calc(100vh - 90px - 2.5rem);
	}

	.home {
		background-color: #F8F8F8;
		overflow: hidden;
	}

	.fixedPlace {
		width: 100%;
		position: fixed;
		background-color: #F8F8F8;
		z-index: 9;
	}

	:deep(.van-search__field) {
		align-items: center;
	}

	.plate1 {
		width: 100%;
		background-color: #FFFFFF;
		padding: 0.12rem 0.12rem 0.04rem;
	}

	.plate1_1 {
		width: 100%;
		text-align: left;
		height: 0.24rem;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.24rem;
		font-weight: 500;
		margin-bottom: 0.02rem;
	}

	.plate1_2 {
		width: 100%;
		height: 0.21rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.08rem;
		margin-bottom: 0.06rem;

	}

	.plate1_2_1 {
		display: flex;
		flex-wrap: nowrap;
	}

	.plate1_2_1_value {
		width: 0.21rem;
		height: 0.21rem;
		margin-left: 0.08rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 500;
	}

	.plate1_2_2 {
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.plate1_3 {
		width: 100%;
		text-align: left;
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.11rem;
	}

	.plate1_4 {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.plate1_4_close {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.plate2 {
		width: 100%;
		height: 0.23rem;
		border-top: solid 1px #EFEFEF;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.1rem;
	}

	.plate3 {
		height: 0.44rem;
		padding: 0.06rem 0.12rem;
		background-color: #FFFFFF;
	}

	.plate4 {
		width: 100%;
		height: 0.44rem;
		background: #FFFFFF;
		padding: 0 0.12rem;
		border-top: solid 1px rgba(0, 0, 0, 0.04);
		border-bottom: solid 1px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.plate4_1 {
		height: 0.22rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.22rem;
		font-weight: 400;
		max-width: 40%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-right: 0.24rem;
	}

	.plate4_1_value {
		margin-right: 0.04rem;
	}

	.plate4_2 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		position: absolute;
		right: 0.12rem;
	}

	.plate4_2_1 {
		width: 0.01rem;
		height: 0.16rem;
		box-shadow: inset -0.005rem 0 0 0 rgba(0, 0, 0, 0.08);
	}

	.plate4_2_2 {
		height: 0.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.85);
		letter-spacing: 0;
		font-weight: 400;
	}

	.plate5 {
		overflow: auto;
		width: 100%;
		height: 0.44rem;
		background: #FFFFFF;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate5_father {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		padding: 0.06rem 0.12rem;
		align-items: center;
	}

	.plate5_child,
	.plate5_child_a {
		flex-shrink: 0;
		text-align: center;
		margin-right: 0.08rem;
		width: 0.76rem;
		height: 0.32rem;
		line-height: 0.32rem;
		border-radius: 0.04rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		letter-spacing: 0;
	}

	.plate5_child {
		background: #F5F5F5;
		color: #595959;
		font-weight: 400;
	}

	.plate5_child_a {
		background: rgba(2, 109, 255, 0.12);
		color: #026DFF;
		font-weight: 600;
	}

	.plate5::-webkit-scrollbar {
		display: none;
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
		margin-bottom: 0.16rem;
	}

	.custItem {
		width: 93.6%;
		margin: 0.06rem auto;
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
		top: 0.16rem;
		right: 0.12rem;
		width: 0.41rem;
		text-align: center;
		height: 0.16rem;
		line-height: 0.16rem;
		border-radius: 0.02rem;
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		color: #FFFFFF;
		font-weight: 400;
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

	.total {
		font-size: 0.1rem;
		color: #262626;
		height: 0.36rem;
		padding: 0.04rem 0.15rem 0;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.fpBtn {
		font-size: 0.13rem;
		color: #0066FF;
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
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 0.4rem;
		text-align: center;
		margin-right: 0.1rem;
	}

	.msgCardOutBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
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

	.msgCardBox {
		width: 100%;
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
		font-size: 0.18rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFBA00;
	}

	.plate6_3_2 {
		margin-left: 0.125rem;
		font-size: 0.18rem;

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
		margin-bottom: 0.11rem;
		margin-top: 0.11rem;
	}

	.scorePane {
		display: flex;
		justify-content: space-between;
		height: 0.9rem;
		border-radius: 0.08rem;
		border: 1px solid #EBEBEB;
	}

	.scoreNum {
		height: 0.21rem;
		font-size: 0.3rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFBA00;
	}

	.scorePeople {
		font-size: 0.08rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #BFBFBF;
		margin-left: 0.08rem;
	}

	.wantScore div {
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFBA00;
		height: 0.12rem;
		border-bottom: 1px solid #FFBA00;
		/* width: 0.62rem; */
	}

	.myScore {
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #BFBFBF;
		height: 0.12rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.wantScore {
		height: 0.12rem;
		display: flex;
		justify-content: right;
	}

	.scoreStar {
		margin-top: 0.18rem;
		font-size: 0.16rem;
	}

	.scoreStar :deep(.van-rate) {
		height: 0.18rem;
	}

	.scoreBottom {
		display: flex;
		height: 0.11rem;
	}

	.leftPane {
		margin-left: 0.08rem;
		margin-top: 0.07rem;
		text-align: center;
	}

	:deep(.van-progress) {
		height: 0.08rem;
		width: 1.43rem;
	}

	:deep(.van-progress__pivot) {
		display: none;
	}

	.rightPane {
		margin-top: 0.12rem;
		margin-right: 0.16rem;
	}

	.rowStyle {
		height: 0.12rem;
		display: flex;
		align-items: center;
	}

	.rowStyle div {
		margin-right: 0.03rem;
		font-size: 0.07rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFBA00;
	}

	.scoreEdit img {
		width: 0.12rem;
		height: 0.12rem;
		margin-left: 0.03rem;
		margin-top: 0.03rem;
	}
</style>
