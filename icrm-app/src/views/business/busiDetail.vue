<template>
	<div class="home">
		<nav-bar title="商机详情" type="2" leftIcon />
		<div class="plate1">
			<div class="plate1_1 ycsl">{{baseMsg.cmrcOpptSubclassNm}}</div>
			<div class="plate1_2">
				<div class="plate1_2_child">
					<div class="plate1_2_childName">客户</div>
					<div class="plate1_2_childValue" style="display: flex;">
						<div class="plate1_2_childValue1">{{baseMsg.custNm}}</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='0'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type0.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='1'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type1.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='2'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type2.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='3'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type3.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='4'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type4.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='5'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type5.png')+')'}">
						</div>
						<div class="plate1_2_childValue2" v-if="baseMsg.svcLvl=='6'"
							:style="{'background-image': 'url('+require('../../assets/image/business_chooseCust_type6.png')+')'}">
						</div>
					</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">联系电话</div>
					<div class="plate1_2_childValue">{{baseMsg.ctcTel}}</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">跟进人</div>
					<div class="plate1_2_childValue plate1_2_childValue1">
						{{baseMsg.followUpPrsnNm}}（{{baseMsg.followUpPrsn}}）
					</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">归属机构</div>
					<div class="plate1_2_childValue">{{baseMsg.belongOrgNm}}</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">极差值</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumDifVal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">历史最高资产</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumHistHestVal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">AUM资产</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.aumBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">定期</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.timeDpsitBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">活期</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.currDpsitBal/10000)}}万元</div>
				</div>
				<div class="plate1_2_child">
					<div class="plate1_2_childName">贷款</div>
					<div class="plate1_2_childValue">{{formatNum(baseMsg.loanBal/10000)}}万元</div>
				</div>
			</div>
			<div class="plate1_2">
				<div class="plate1_2_child" style="width: 100%;">
					<div class="plate1_2_childName">商机描述</div>
					<div class="plate1_2_childValue">{{baseMsg.cmrcOpptDsc}}</div>
				</div>
			</div>
			<div class="plate1_3"></div>
			<div class="plate1_4">
				<span style="color: #026DFF;font-weight: 500;">#推荐理由#</span>
				<span>{{baseMsg.recomRea}}</span>
			</div>
			<div class="plate1_5" v-if="haveScore&&$store.state.userMsg.roleId=='00000004'">
				<div class="plate1_5_1">我评</div>
				<van-rate v-model="score" :size="18" color="#FFBA00" void-icon="star" readonly void-color="#E0E0E0"
					allow-half />
				<div class="plate1_5_2">{{score}}</div>
				<div class="plate1_5_3" @click="score_c=score;changeScore=true;">
					<van-icon :name="require('../../assets/image/common_edit.png')" size="12" />
					<span style="margin-left: 0.02rem;">修改</span>
				</div>
			</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='2'" style="background-color: #026DFF;">待跟进</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='4'" style="background-color: #FFBA00;">已跟进</div>
			<div class="plate1_6" v-if="baseMsg.cmrcOpptSt=='5'" style="background-color: #52C41A;">已成交</div>
		</div>
		<div class="plate2" v-if="!haveScore&&showScore&&$store.state.userMsg.roleId=='00000004'">
			<div class="plateTitle">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">请您对该商机实用度进行评价</div>
			</div>
			<div class="plate2_1" :style="{'background': score_c?'#026DFF':'#B3D3FF'}" @click="saveScore">发布</div>
			<div class="plate2_2">
				<div class="plate2_2_1">实用度</div>
				<van-rate v-model="score_c" :size="27" color="#FFBA00" void-icon="star" void-color="#E0E0E0"
					allow-half />
				<div class="plate2_2_2" v-if="score_c">{{score_c}}</div>
				<span class="plate2_2_3" v-if="score_c&&score_c<=1">很差</span>
				<span class="plate2_2_3" v-else-if="score_c&&score_c<=2">较差</span>
				<span class="plate2_2_3" v-else-if="score_c&&score_c<=3">一般</span>
				<span class="plate2_2_3" v-else-if="score_c&&score_c<=4">较好</span>
				<span class="plate2_2_3" v-else-if="score_c&&score_c<=5">很好</span>
			</div>
			<div class="plate2_3"></div>
			<div class="plate2_4" @click="setting">
				<span style="margin-right: 0.02rem;">看看大家都怎么评</span>
				<van-icon name="arrow" color="#026DFF" />
			</div>
		</div>
		<div class="card">
			<div class="titleTop">
				<div class="titleL">
					<van-icon :name="require('@/assets/image/cust_cycp.png')" size="0.2rem" />
					<h3>持有产品</h3>
				</div>
			</div>
			<TabsList :setList="prdList" style="margin-top: 0.1rem" />
		</div>
		<div class="plate3">
			<div class="plateTitle" style="margin-bottom: 0.2rem;">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">跟进记录</div>
			</div>
			<div class="empty" v-if="!followMsg.length">-暂无跟进记录-</div>
			<van-steps direction="vertical" :active="0">
				<van-step v-for="(followItem,i) in followMsg" :key="'followItem'+i">
					<div class="followItem1">
						<div class="followItem1_1">{{followItem.serviceTypeNm}}</div>
						<div class="followItem1_2">跟进人：{{followItem.createPersonNm}}（{{followItem.createPerson}}）</div>
					</div>
					<div class="followItem2" :style="{'-webkit-line-clamp':followItem.showDesc?'100':'15'}"
						@click="followItem.showDesc=!followItem.showDesc">{{followItem.serviceContent}}</div>
					<div class="followItem5" v-if="followItem.serviceType=='01'&&followItem.fileList.length">
						<div class="followItem5_1"
							v-for="(file,j) in followItem.fileList.length>4&&!followItem.showAllPhoto?followItem.fileList.slice(0,3):followItem.fileList"
							:key="'file'+j" @click="openPhoto(this.$store.state.baseUrl + file.fileServerPath)">
							<img :src="this.$store.state.baseUrl + file.fileServerPath">
						</div>
						<div class="followItem5_2" v-if="followItem.fileList.length>4&&!followItem.showAllPhoto"
							@click="followItem.showAllPhoto=true">
							<van-icon :name="require('../../assets/image/common_more.png')" color="#8C8C8C" size="21" />
						</div>
					</div>
					<div class="followItem6" v-if="followItem.serviceType=='01'&&followItem.visitAddress">
						<div class="followItem6_1">
							<van-icon :name="require('../../assets/image/common_dingwei_blue.png')" size="12"
								style="margin-right: 0.04rem;flex-shrink: 0;padding: 0.03rem 0;" />
							<span>{{followItem.visitAddress.split("------")[1]?followItem.visitAddress.split("------")[1]:followItem.visitAddress.split("------")[0]}}</span>
						</div>
						<div class="followItem6_2">
							{{followItem.visitAddress.split("------")[1]?followItem.visitAddress.split("------")[0]:""}}
						</div>
					</div>
					<div class="followItem3" v-if="i!=followMsg.length-1"></div>
					<div class="followItem4">
						<div class="followItem4_1">
							{{followItem.followupDt.slice(5,10).split("-").join("/")}}
						</div>
						<div class="followItem4_2">{{followItem.followupDt.slice(-8,-3)}}</div>
					</div>
					<template #active-icon>
						<div class="active-icon-out">
							<div class="active-icon-in"></div>
						</div>
					</template>
					<template #inactive-icon>
						<div class="inactive-icon"></div>
					</template>
				</van-step>
			</van-steps>
		</div>
		<div class="plate4" v-if="otherBusi.length">
			<div class="plateTitle">
				<div class="plateTitle1"></div>
				<div class="plateTitle2">他的其他商机</div>
			</div>
			<div class="otherBusi" v-for="(otherBusiItem,i) in otherBusi" :key="'otherBusiItem'+i">
				<div class="otherBusi1">
					<div class="otherBusi1_1">{{otherBusiItem.cmrcOpptSubclassNm}}</div>
					<div class="otherBusi1_2">到期日：{{otherBusiItem.cmrcOpptExpDay}}</div>
				</div>
				<div class="otherBusi2" @click="openOther(otherBusiItem)">查看详情</div>
				<div class="otherBusi3"></div>
			</div>
		</div>
		<div class="bottomZW"></div>
		<div style="height: 0.66rem;" v-if="$store.state.userMsg.roleId=='00000004'"></div>
		<div class="plate5" v-if="$store.state.userMsg.roleId=='00000004'">
			<div class="plate5_item" @click="openMbox">
				<div class="plate5_item_icon"
					:style="{'background-image': 'url('+require('../../assets/image/business_detail_message.png')+')'}">
				</div>
				<div class="plate5_item_text">发送短信</div>
			</div>
			<div class="plate5_item" @click="showCall=true">
				<div class="plate5_item_icon"
					:style="{'background-image': 'url('+require('../../assets/image/business_detail_call.png')+')'}">
				</div>
				<div class="plate5_item_text">拨打电话</div>
			</div>
			<div class="plate5_item" @click="openVisit">
				<div class="plate5_item_icon"
					:style="{'background-image': 'url('+require('../../assets/image/business_detail_visit.png')+')'}">
				</div>
				<div class="plate5_item_text">登门拜访</div>
			</div>
		</div>
		<van-overlay :show="changeScore">
			<div class="plate6">
				<div class="plate6_1">修改评分</div>
				<div class="plate6_2">
					<van-rate v-model="score_c" :size="27" color="#FFBA00" void-icon="star" void-color="#E0E0E0"
						allow-half />
				</div>
				<div class="plate6_3">
					<span class="plate6_3_1">{{score_c}}</span>
					<span class="plate6_3_2" v-if="score_c<=1">很差</span>
					<span class="plate6_3_2" v-else-if="score_c<=2">较差</span>
					<span class="plate6_3_2" v-else-if="score_c<=3">一般</span>
					<span class="plate6_3_2" v-else-if="score_c<=4">较好</span>
					<span class="plate6_3_2" v-else-if="score_c<=5">很好</span>
				</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="changeScore=false">取消</div>
					<div class="palte6_4_2" @click="saveScore">提交</div>
				</div>
			</div>
		</van-overlay>
		<van-overlay :show="showCall">
			<div class="plate6">
				<div class="plate6_1">提示</div>
				<div class="plate6_5">是否拨打电话：{{baseMsg.ctcTel}}</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showCall=false">取消</div>
					<div class="palte6_4_2" @click="callCust">确定</div>
				</div>
			</div>
		</van-overlay>
		<send-message ref="sendMessage" @commitSuccess="sendSuccess" />
		<van-popup v-model:show="showVisit" round position="bottom" z-index="99999" :close-on-click-overlay="false"
			style="background-color: #F8F8F8;height: 80%;">
			<div class="popTitle">
				<div class="popTitle1" @click="cancle">取消</div>
				<div class="popTitle2">登门拜访</div>
				<div class="popTitle3" @click="addVisit">添加</div>
			</div>
			<div class="popPlate1">
				<van-field v-model="followValue" type="textarea" placeholder="请输入拜访记录（非必填）" rows="5" autosize
					maxlength="150" />
			</div>
			<div class="popPlate2">
				<div class="cameraBox" v-for="(photo,i) in photoList" :key="'photo'+i">
					<van-icon class="delBtn" :name="require('../../assets/image/common_delete.png')" color="#8C8C8C"
						size="20" @click="delPhoto(i)" />
					<div class="imgBox" @click="openPhoto('data:image/jpeg;base64,' + photo.url)">
						<img :src="'data:image/jpeg;base64,' + photo.url">
					</div>
				</div>
				<div class="cameraBox" v-if="photoList.length<8" @click="openCamera">
					<van-icon name="photograph" color="#BFBFBF" size="32" />
				</div>
			</div>
			<div class="popPlate3">
				<van-icon :name="require('../../assets/image/common_dingwei_blue.png')" size="15"
					style="margin-right: 0.04rem;flex-shrink: 0;padding: 0.03rem 0;" />
				<div class="popPlate3_1" v-if="openLocation">
					<div class="popPlate3_1_1">
						{{dingwei.split("------")[1]?dingwei.split("------")[1]:dingwei.split("------")[0]}}</div>
					<div class="popPlate3_1_2">{{dingwei.split("------")[1]?dingwei.split("------")[0]:""}}</div>
				</div>
				<div class="popPlate3_1" v-else>
					<div class="popPlate3_1_1">未获取到定位信息！</div>
					<div class="popPlate3_1_2">请确认设备是否已开启APP定位权限及GPS信号是否正常</div>
				</div>
				<van-icon class="popPlate3_2" :name="require('../../assets/image/common_reset.png')" size="20"
					@click="getLocation" />
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		queryCustHoldPrdInfo
	} from "@/request/custinfo.js"
	import {
		formatNum
	} from "../../api/common.js";
	import {
		queryCmrcOpportunityDetail,
		queryOpportPractialInfo,
		saveOpportPractialInfo,
		queryOpportCustServList,
		queryCmrcOpportunityList,
		saveOpportCustServInfo,
		opportCustServUploadMpaas
	} from "../../request/market.js";
	import {
		Toast,
		ImagePreview
	} from "vant";
	import sendMessage from "../../components/common/sendMessage.vue";
	import {
		opportCustServUpload
	} from "../../api/api.js";
	import TabsList from "@/views/cust/components/TabsList.vue"
	export default {
		data() {
			return {
				baseMsg: {
					aumDifVal: 0,
					aumHistHestVal: 0,
					aumBal: 0,
					timeDpsitBal: 0,
					currDpsitBal: 0,
					loanBal: 0,
				},
				score: 0,
				scoreId: "",
				score_c: 0,
				haveScore: false,
				showScore: false,
				changeScore: false,
				showCall: false,
				followMsg: [],
				otherBusi: [],
				showVisit: false,
				followValue: "",
				photoList: [],
				dingwei: "",
				openLocation: true,
				prdList: [],
			}
		},
		components: {
			sendMessage,
			TabsList
		},
		methods: {
			formatNum,
			setting() {
				Toast("功能开发中");
			},
			saveScore() {
				if (!this.score_c) return;
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				saveOpportPractialInfo({
					sysId: this.baseMsg.sysId,
					scoreId: this.scoreId,
					cmrcOpptId: this.baseMsg.cmrcOpptId,
					cmrcOpptSubclass: this.baseMsg.cmrcOpptSubclass,
					score: this.score_c
				}, (res) => {
					if (res.data == "操作成功") {
						this.haveScore = true;
						Toast("发布成功~感谢您的评价");
						this.changeScore = false;
						this.getScore();
					}
				});
			},
			getBaseMsg() {
				queryCmrcOpportunityDetail({
					sysId: this.$route.params.sysId
				}, (res) => {
					this.baseMsg = res.data;
					this.queryCustHoldPrd(this.baseMsg.custNo);
				});
			},
			getScore() {
				queryOpportPractialInfo({
					sysId: this.$route.params.sysId
				}, (res) => {
					if (res.data && res.data.score) {
						this.score = res.data.score;
						this.scoreId = res.data.scoreId;
						this.haveScore = true;
					}
					this.showScore = true;
				});
			},
			getFollowMsg() {
				queryOpportCustServList({
					sysId: this.$route.params.sysId
				}, (res) => {
					this.followMsg = res.data;
					this.followMsg.forEach((item) => {
						item.showDesc = false;
						item.showAllPhoto = false;
					});
				})
			},
			getOtherBusi() {
				queryCmrcOpportunityList({
					pageNm: "1",
					pageSize: "999",
					custNo: this.$route.params.custNo,
					notSysId: this.$route.params.sysId
				}, (res) => {
					this.otherBusi = res.data.records;
				});
			},
			openOther(item) {
				this.baseMsg = {
					aumDifVal: 0,
					aumHistHestVal: 0,
					aumBal: 0,
					timeDpsitBal: 0,
					currDpsitBal: 0,
					loanBal: 0,
				};
				this.score = 0;
				this.scoreId = "";
				this.score_c = 0;
				this.haveScore = false;
				this.showScore = false;
				this.followMsg = [];
				this.otherBusi = [];
				this.$route.params.custNo = item.custNo;
				this.$route.params.sysId = item.sysId;
				this.getBaseMsg();
				this.getScore();
				this.getFollowMsg();
				this.getOtherBusi();
			},
			callCust() {
				if (isNaN(this.baseMsg.ctcTel)) {
					Toast.fail("电话号码格式有误");
					return;
				}
				AlipayJSBridge.call('callHandler', {
					phone: this.baseMsg.ctcTel
				}, (res1) => {
					if (res1.status == "000000") {
						saveOpportCustServInfo({
							sysId: this.baseMsg.sysId,
							custNum: this.baseMsg.custNo,
							cstNam: this.baseMsg.custNm,
							serviceType: "02",
							custOrg: this.baseMsg.belongOrg,
							custMgrNum: this.baseMsg.followUpPrsn,
							mobileNum: this.baseMsg.ctcTel,
						}, (res2) => {
							this.getFollowMsg();
							this.showCall = false;
						})
					} else {
						Toast.fail(res1.msg)
					}
				});
			},
			openMbox() {
				this.$refs.sendMessage.openMbox({
					type: "",
					searchData: {},
					list: [this.baseMsg],
					shrtmsgCnl: "8"
				})
			},
			sendSuccess(msg) {
				return;
				saveOpportCustServInfo({
					sysId: this.baseMsg.sysId,
					custNum: this.baseMsg.custNo,
					cstNam: this.baseMsg.custNm,
					serviceType: "03",
					serviceContent: msg,
					custOrg: this.baseMsg.belongOrg,
					custMgrNum: this.baseMsg.followUpPrsn,
					mobileNum: this.baseMsg.ctcTel,
				}, (res) => {
					this.getFollowMsg();
				})
			},
			openVisit() {
				this.followValue = "";
				this.photoList = [];
				this.dingwei = "";
				this.showVisit = true;
				this.getLocation();
			},
			cancle() {
				this.showVisit = false;
			},
			openCamera() {
				AlipayJSBridge.call('openPickerV', {
					openType: "0",
				}, (res1) => {
					if (res1.status == "000000") {
						Toast.loading({
							message: "正在上传",
							forbidClick: true,
							duration: 0
						});
						opportCustServUploadMpaas({
							file: res1.result
						}, (res2) => {
							Toast.success("上传成功");
							this.photoList.push({
								url: res1.result,
								tableKey: res2.data[0].tableKey
							})
						})
					} else if (res.status != "000004") {
						Toast.fail(res.msg)
					}
				});
			},
			delPhoto(i) {
				this.photoList.splice(i, 1)
			},
			getLocation() {
				this.openLocation = true;
				this.dingwei = "正在获取位置信息...";
				AlipayJSBridge.call('getLocation', {}, (res) => {
					if (res.status == "000000") {
						this.dingwei = res.result;
					} else {
						this.openLocation = false;
					}
				});
			},
			addVisit() {
				if (this.photoList.length < 1) {
					Toast.fail("请至少上传一张照片");
					return;
				}
				if (this.dingwei == "") {
					Toast.fail("请先获取定位信息");
					return;
				}
				if (this.dingwei == "正在获取位置信息...") return;
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				saveOpportCustServInfo({
					sysId: this.baseMsg.sysId,
					custNum: this.baseMsg.custNo,
					cstNam: this.baseMsg.custNm,
					serviceType: "01",
					serviceContent: this.followValue,
					visitAddress: this.dingwei,
					custOrg: this.baseMsg.belongOrg,
					custMgrNum: this.baseMsg.followUpPrsn,
					mobileNum: this.baseMsg.ctcTel,
					uploadIds: this.photoList.map(item => item.tableKey)
				}, (res) => {
					this.getFollowMsg();
					this.showVisit = false;
					Toast.clear();
				})
			},
			openPhoto(file) {
				ImagePreview({
					images: [file],
					showIndex: false
				});
			},
			/* 客户持有产品查询 */
			queryCustHoldPrd(custNo) {
				queryCustHoldPrdInfo({
					custNum: custNo
				}, res => {
					if (res && res.data && res.data.prdList) {
						let arr = [{
								name: '定期存款',
								key: 'HOLD_TIME_DPSIT',
								disabled: true
							},
							{
								name: '活期存款',
								key: 'HOLD_CURR_DPSIT',
								disabled: true
							},
							{
								name: '贷款',
								key: 'HOLD_LOAN',
								disabled: true
							},
							{
								name: '理财',
								key: 'HOLD_CFT',
								disabled: true
							},
							{
								name: '基金',
								key: 'HOLD_FND',
								disabled: true
							},
							{
								name: '保险',
								key: 'HOLD_INS',
								disabled: true
							},
							{
								name: '信托',
								key: 'HOLD_ENTRST',
								disabled: true
							}
						]
						res.data.prdList.forEach(item => {
							arr.forEach(i => {
								if (i.key == item) {
									i.disabled = false
								}
							})
						})
						this.prdList = arr
					}
				})
			},
		},
		mounted() {
			this.getBaseMsg();
			this.getScore();
			this.getFollowMsg();
			this.getOtherBusi();
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
		background-color: #F8F8F8;
	}

	.plate1 {
		width: 93.6%;
		margin: 0.12rem auto;
		padding: 0.12rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		position: relative;
	}

	.plate1_1 {
		width: 85%;
		height: 0.27rem;
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.27rem;
		font-weight: 500;
		margin-bottom: 0.08rem;
	}

	.plate1_2 {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.plate1_2_child {
		width: 50%;
	}

	.plate1_2_childName {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.02rem;
	}

	.plate1_2_childValue {
		width: 100%;
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		margin-bottom: 0.08rem;
	}

	.plate1_2_childValue1 {
		color: #026DFF;
	}

	.plate1_2_childValue2 {
		width: 0.6rem;
		height: 0.16rem;
		margin-left: 0.08rem;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: contain;
	}

	.plate1_3 {
		width: 100%;
		height: 0.01rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
		margin: 0.04rem 0 0.12rem;
	}

	.plate1_4 {
		width: 100%;
		font-family: PingFangSC-Regular;
		text-align: left;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.plate1_5 {
		width: 100%;
		height: 0.32rem;
		background: #F8F8F8;
		border-radius: 0.04rem;
		margin-top: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding: 0 0.12rem;
		position: relative;
	}

	.plate1_5_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
		margin-right: 0.12rem;
	}

	.plate1_5_2 {
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #FFBA00;
		letter-spacing: 0;
		font-weight: 500;
		margin-left: 0.12rem;
	}

	.plate1_5_3 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		font-weight: 400;
		position: absolute;
		right: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.plate1_6 {
		position: absolute;
		top: 0.18rem;
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

	.plateTitle {
		width: 100%;
		height: 0.44rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
		padding: 0 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	.plateTitle1 {
		width: 0.02rem;
		height: 0.14rem;
		background: #026DFF;
		border-radius: 0.02rem;
		margin-right: 0.05rem;
	}

	.plateTitle2 {
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 500;
	}

	.plate2 {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
		position: relative;
		padding-bottom: 0.12rem;
	}

	.plate2_1 {
		position: absolute;
		top: 0.09rem;
		right: 0.16rem;
		width: 0.52rem;
		height: 0.26rem;
		border-radius: 0.04rem;
		line-height: 0.26rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #FFFFFF;
		letter-spacing: 0;
		font-weight: 400;
	}

	.plate2_2 {
		width: 100%;
		height: 0.72rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		padding: 0 0.12rem;
	}

	.plate2_2_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 400;
		margin-right: 0.12rem;
	}

	.plate2_2_2,
	.plate6_3_1 {
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		color: #FFBA00;
		letter-spacing: 0;
		font-weight: 500;
		margin-left: 0.09rem;
	}

	.plate2_2_3,
	.plate6_3_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #595959;
		letter-spacing: 0;
		font-weight: 400;
		margin-left: 0.09rem;
	}

	.plate2_3 {
		width: 93.6%;
		height: 0.01rem;
		margin: 0 auto 0.12rem;
		box-shadow: inset 0 -0.005rem 0 0 rgba(0, 0, 0, 0.04);
	}

	.plate2_4 {
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #026DFF;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		padding: 0 0.12rem;
		text-align: left;
	}

	.plate3 {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
		padding-bottom: 0.3rem;
	}

	.plate4 {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}

	.plate5 {
		width: 100%;
		height: calc(constant(safe-area-inset-bottom) + 0.56rem);
		height: calc(env(safe-area-inset-bottom) + 0.56rem);
		background: rgba(255, 255, 255, 0.94);
		box-shadow: 0 -0.005rem 0 0 rgba(0, 0, 0, 0.3);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.05rem 0.4rem;
	}

	.plate5_item_icon {
		margin: 0 auto;
		width: 0.24rem;
		height: 0.24rem;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		margin-bottom: 0.04rem;
	}

	.plate5_item_text {
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
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

	.followItem1 {
		width: calc(100% - 0.12rem);
		height: 0.21rem;
		margin-bottom: 0.04rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.followItem1_1 {
		font-size: 0.14rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
	}

	.followItem1_2 {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		margin-right: 0.28rem;
	}

	.followItem2 {
		width: calc(100% - 0.12rem);
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.followItem3 {
		width: calc(100% - 0.12rem);
		height: 0.01rem;
		background: #EFEFEF;
		margin-top: 0.15rem;
	}

	:deep(.van-step--vertical:not(:last-child):after) {
		border-bottom-width: 0;
	}

	:deep(.van-step) {
		padding: 0 0 0.15rem 0.05rem;
		text-align: left;
	}

	:deep(.van-steps__items) {
		margin-left: 25%;
	}

	:deep(.van-step__circle-container) {
		position: absolute;
		top: 0.1rem;
		left: -0.14rem;
		z-index: 1;
		font-size: var(--van-step-icon-size);
		line-height: 1;
		transform: translate(-50%, -50%);
	}

	:deep(.van-step__line) {
		top: 0.1rem;
		left: -0.15rem;
		width: 0.02rem;
		height: 100%;
		background-color: #BFBFBF;
	}

	.followItem4 {
		text-align: right;
		position: absolute;
		top: 0;
		left: calc(-15% - var(--van-padding-xl));
	}

	.followItem4_1 {
		height: 0.2rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		text-align: right;
		line-height: 0.2rem;
		font-weight: 500;
	}

	.followItem4_2 {
		height: 0.16rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		text-align: right;
		line-height: 0.16rem;
		font-weight: 400;
	}

	.inactive-icon {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #BFBFBF;
	}

	.active-icon-out {
		width: 0.16rem;
		height: 0.16rem;
		padding: 0.04rem;
		border-radius: 0.08rem;
		background-color: rgba(2, 109, 255, 0.12);
	}

	.active-icon-in {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #026DFF;
	}

	.otherBusi {
		width: 100%;
		padding: 0.12rem;
		height: 0.66rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.otherBusi1_1 {
		height: 0.2rem;
		line-height: 0.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 400;
		margin-bottom: 0.04rem;
		text-align: left;
	}

	.otherBusi1_2 {
		text-align: left;
		height: 0.18rem;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.otherBusi2 {
		width: 0.83rem;
		height: 0.3rem;
		line-height: 0.3rem;
		border: 0.01rem solid #026DFF;
		border-radius: 0.15rem;
		text-align: center;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #026DFF;
		letter-spacing: 0.0023rem;
		text-align: center;
		font-weight: 500;
	}

	.otherBusi3 {
		width: calc(100% - 0.24rem);
		height: 0.01rem;
		box-shadow: inset 0px -0.005rem 0 0 rgba(0, 0, 0, 0.04);
		position: absolute;
		bottom: 0;
	}

	.popTitle {
		width: 100%;
		height: 0.51rem;
		background: #F8F8F8;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		font-family: PingFangSC-Regular;
		font-size: 0.16rem;
		letter-spacing: 0;
		font-weight: 400;
		position: relative;
	}

	.popTitle1 {
		position: absolute;
		left: 0.16rem;
		color: #8C8C8C;
	}

	.popTitle2 {
		color: #262626;
		font-size: 0.18rem;
		font-weight: 500;
	}

	.popTitle3 {
		position: absolute;
		right: 0.16rem;
		color: #026DFF;
	}

	.popPlate1 {
		width: calc(100% - 0.24rem);
		padding: 0.12rem;
		margin: 0.08rem 0.12rem 0;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}

	.popPlate2 {
		width: calc(100% - 0.24rem);
		padding: 0.12rem 0.12rem 0;
		margin: 0.12rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.popPlate3 {
		width: calc(100% - 0.24rem);
		padding: 0.12rem;
		margin: 0.12rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		position: relative;
	}

	.popPlate3_1 {
		max-width: 85%;
	}

	.popPlate3_1_1 {
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 500;
		text-align: left;
		margin-bottom: 0.02rem;
	}

	.popPlate3_1_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #8C8C8C;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
		text-align: left;
	}

	.popPlate3_2 {
		position: absolute;
		top: 0.12rem;
		right: 0.12rem;
	}

	.cameraBox {
		width: 0.73rem;
		height: 0.73rem;
		background: #F8F8F8;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin-bottom: 0.12rem;
		margin-right: calc(calc(100% - 2.92rem) / 3);
		position: relative;
	}

	.cameraBox:nth-child(4n) {
		margin-right: 0;
	}

	.imgBox {
		width: 100%;
		height: 100%;
		border-radius: 0.08rem;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.imgBox>img {
		width: 100%;
	}

	.delBtn {
		position: absolute;
		top: -0.06rem;
		right: -0.06rem;
	}

	.empty {
		width: 100%;
		height: 0.38rem;
		line-height: 0.5rem;
		font-size: 0.12rem;
		color: #E0E0E0;
		font-family: PingFangSC-Regular;
		letter-spacing: 0;
		font-weight: 400;
	}

	.followItem5 {
		width: calc(100% - 0.2rem);
		margin-top: 0.12rem;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: -0.12rem;
	}

	.followItem5_1 {
		width: 0.5rem;
		height: 0.5rem;
		margin-right: calc(calc(100% - 2rem) / 3);
		margin-bottom: 0.12rem;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.followItem5_1:nth-child(4n) {
		margin-right: 0;
	}

	.followItem5_1>img {
		width: 100%;
	}

	.followItem5_2 {
		width: 0.5rem;
		height: 0.5rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}

	.followItem6 {
		width: calc(100% - 0.12rem);
		margin-top: 0.12rem;
	}

	.followItem6_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.21rem;
		font-weight: 400;
		display: flex;
		flex-wrap: nowrap;
	}

	.followItem6_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #595959;
		letter-spacing: 0;
		line-height: 0.18rem;
		font-weight: 400;
	}

	.card {
		background: #fff;
		padding: 0.12rem;
		border-radius: 0.08rem;
	}

	.titleTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.titleL {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 0.2rem;
		text-align: left;
	}

	h3 {
		margin: 0 0.08rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
		font-weight: 500;
	}
</style>
