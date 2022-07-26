<template>
	<div class="home">
		<nav-bar type="2" title="必办" leftIcon />
		<div class="plate1" v-if="$store.state.userMsg.roleId!='00000004'">
			<div class="plate1_1" @click="$refs.orgList.showPopup();openOrgList=true;">
				<div class="plate1_1_value ycsl">{{chooseOrg.text}}</div>
				<van-icon v-if="openOrgList" name="arrow-up" size="14" color="#8C8C8C" />
				<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
			</div>
			<div class="plate1_1" @click="$refs.custList.showPopup();openCustList=true;">
				<div class="plate1_1_value ycsl">{{chooseCust.empName}}</div>
				<van-icon v-if="openCustList" name="arrow-up" size="14" color="#8C8C8C" />
				<van-icon v-else name="arrow-down" size="14" color="#8C8C8C" />
			</div>
		</div>
		<div class="firstTab">
			<van-tabs class="tabBarStyle" v-model:active="active" line-width="0" color="#0088FF" title-active-color="#026DFF"
				title-inactive-color="#262626" @click-tab="onClickTab">
				<van-tab  v-for="item in mustDoKind" :key="item.codeValue" :title="item.codeName"/>
		</van-tabs>
		</div>
		
		<div class="list">
            <van-tabs class="month" v-model:active="tageListActive" type="card" @click-tab="tageListChange">
				<van-tab v-for="item in mustDoNameList" :key="item.codeValue" :title="item.codeName">
				</van-tab>
            </van-tabs>
        </div>
		<div class="list">
            <van-tabs class="month" v-model:active="statusActive" type="card" @click-tab="statusListChange">
				<van-tab v-for="item in statusList" :key="item.codeValue" :title="item.codeName">
				</van-tab>
            </van-tabs>
        </div>
        <div class="dateRow">
            <div style="font-size:0.13rem;width: 0.6rem;text-align: left;">到期日</div>
			<div class="plate4_childBox">
				<div class="plate4_child" :class="beginDate?'plate4_child_a':''" style="min-width: 1.05rem;"
					@click="dateShow1 = true">
					<span style="margin-right: 0.06rem;">{{beginDate||"开始时间"}}</span>
					<van-icon :name="require('../../assets/image/common_date.png')"
						style="margin-bottom: 0.03rem;" />
				</div>
				<div style="font-size: 0.12rem;margin-right: 0.1rem;color: #8C8C8C">—</div>
				<div class="plate4_child" :class="endDate?'plate4_child_a':''" style="min-width: 1.05rem;"
					@click="dateShow2 = true">
					<span style="margin-right: 0.06rem;">{{endDate||"结束时间"}}</span>
					<van-icon :name="require('../../assets/image/common_date.png')"
						style="margin-bottom: 0.03rem;" />
				</div>
			</div>
            
        </div>
		<van-calendar v-model:show="dateShow1" :show-confirm="false" :show-cancle="false" color="#026DFF"
			:min-date="minDate" :max-date="maxDate" @confirm="chooseDate1">
			<template #title>
				<div class="calendarTitle">
					<div class="calendarTitle1" @click="dateShow1=false">取消</div>
					<div class="calendarTitle2" @click="resetDate1">重置</div>
				</div>
			</template>
		</van-calendar>
		<van-calendar v-model:show="dateShow2" :show-confirm="false" color="#026DFF" :max-date="maxDate"
			:min-date="minDate" @confirm="chooseDate2" title="结束时间">
			<template #title>
				<div class="calendarTitle">
					<div class="calendarTitle1" @click="dateShow2=false">取消</div>
					<div class="calendarTitle2" @click="resetDate2">重置</div>
				</div>
			</template>
		</van-calendar>
		<div class="total">
			<div>筛选结果：共{{allNum}}条数据</div>
		</div>
		<van-list id="listHeight" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="vanList" :style="{height:listHeight+'px'}">
			<div v-for="(mustDoItem, i) in mustDoList" :key="'mustDoItem' + i" class="msgCardOutBox">
				<div class="msgCardBox" @click="openDetail">
					<div class="msgCard">
						<div class="msgValue1">
							<div class="msgValue1Left ycsl">{{ mustDoItem.mastDoName }}</div>
							<div class="msgValue1Right" >
								<div class="msgValue1RightItem"
									:style="{'background-color':mustDoItem.mastDoSt == '01'? '#52C41A': mustDoItem.mastDoSt == '02'? '#E93030': '#bfbfbf',}">
									{{ mustDoItem.mastDoSt=='01'?'已办':mustDoItem.mastDoSt=='02'?'待办':'逾期未办'}}
								</div>
							</div>
						</div>
						<div class="msgValue2">
							<div class="msgValue2Left ycsl">
								<span class="daoqiDate">到期日：</span>
								<span class="daoqiDate">{{ mustDoItem.expDay }}</span>
							</div>
							<div class="msgValue3Right" >
								<van-icon @click="visitDetail(mustDoItem)" v-if="mustDoItem.mastDoSt == '01'" :name="require('@/assets/image/yiban.png')" size="24"/>
								<van-icon  @click="openVisit(mustDoItem)" v-if="mustDoItem.mastDoNm != '0101' && mustDoItem.mastDoSt == '02' && $store.state.userMsg.roleId=='00000004'" :name="require('@/assets/image/daiban.png')" size="24"/>
								<van-icon  @click="openTel(mustDoItem)" v-if="(mustDoItem.mastDoNm == '0101' && mustDoItem.mastDoSt == '02' && $store.state.userMsg.roleId=='00000004' && mustDoItem.isPhone=='1')||mustDoItem.isCall" :name="require('@/assets/image/daiban.png')" size="24"/>
								<van-icon  @click="gaveCall(mustDoItem)" v-if="mustDoItem.mastDoNm == '0101' && mustDoItem.mastDoSt == '02' && $store.state.userMsg.roleId=='00000004' && mustDoItem.isPhone=='0' && !mustDoItem.isCall" :name="require('@/assets/image/callPhone.png')" size="24"/>
								<van-icon v-if="mustDoItem.mastDoSt == '03' && $store.state.userMsg.roleId=='00000004'" :name="require('@/assets/image/daiban_gray.png')" size="24"/>
							</div>
						</div>
						<div>
							<div class="msgTitleColor" style="text-align:left">{{ mustDoItem.mastDoCntnt }}</div>
						</div>
						<div class="msgValue3"></div>
						<div class="msgValue4">
							<div class="msgValue4Left ycsl">
								<span class="msgTitleColor">机构名称：</span>
								<span class="msgContent">{{ mustDoItem.orgName }}</span>
							</div>
							<div class="msgValue4Right ycsl">
								<span class="msgTitleColor">客户经理：</span>
								<span class="msgContent">{{ mustDoItem.custMgrNm }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</van-list>
		<org-list ref="orgList" type="2" @close="openOrgList=false" @activeOrg="activeOrg" />
		<customer-list ref="custList" :orgId="chooseOrg.value" @close="openCustList=false" @activeCust="activeCust" />
		<van-popup v-model:show="showVisit" round position="bottom" z-index="99999" :close-on-click-overlay="false"
			style="background-color: #F8F8F8;height: 80%;">
			<div class="popTitle">
				<div class="popTitle1" @click="cancle">取消</div>
				<div class="popTitle2">现场定位核查</div>
				<div class="popTitle3" @click="addVisit">添加</div>
			</div>
			<div class="popPlate1" >
				<van-field v-model="followValue" type="textarea" placeholder="请输入拜访记录（非必填）" rows="5" autosize
					maxlength="150" />
			</div>
			
			<div class="popPlate2">
				<div class="cameraBox" v-for="(photo,i) in photoList" :key="'photo'+i">
					<van-icon class="delBtn" :name="require('../../assets/image/common_delete.png')" color="##8C8C8C"
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
					<div class="popPlate3_1_1">{{dingwei.split("------")[1]?dingwei.split("------")[1]:dingwei.split("------")[0]}}</div>
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
		<van-popup v-model:show="showVisit2" round position="bottom" z-index="99999" :close-on-click-overlay="false"
			style="background-color: #F8F8F8;height: 80%;">
			<div class="popTitle">
				<div class="popTitle1" @click="cancle">取消</div>
				<div class="popTitle2" v-if="followItem.isPhone=='1'">电话联系记录</div>
				<div class="popTitle2" v-else>现场定位核查记录</div>
			</div>
			<div class="popTime">
				<div class="popTimeDate">{{followItem.onsiteInspTm}}</div>
			</div>
			<div class="popPlate1">
				<van-field v-model="followItem.onsiteInspDsc" type="textarea" placeholder="" rows="5" autosize readonly
					maxlength="150" />
			</div>
			<div class="popPlate2" v-if="followItem.isPhone!='1'">
				<div class="followItem5_1"
					v-for="(file,j) in followItem.fileList"
					:key="'file'+j" @click="openPhoto($store.state.configInfo.icrmUrl + file.fileServerPath)">
					<img :src="$store.state.configInfo.icrmUrl + file.fileServerPath">
				</div>
			</div>
			<div class="popPlate3" v-if="followItem.isPhone!='1'">
				<van-icon :name="require('../../assets/image/common_dingwei_blue.png')" size="15"
					style="margin-right: 0.04rem;flex-shrink: 0;padding: 0.03rem 0;" />
				<div class="popPlate3_1">
					<div class="popPlate3_1_1">{{followItem.onsiteInspLctng.split("------")[1]?followItem.onsiteInspLctng.split("------")[1]:followItem.onsiteInspLctng.split("------")[0]}}</div>
					<div class="popPlate3_1_2">{{followItem.onsiteInspLctng.split("------")[1]?followItem.onsiteInspLctng.split("------")[0]:""}}</div>
				</div>
			</div>
			
		</van-popup>
		<van-popup v-model:show="showVisit3" round position="bottom" z-index="99999" :close-on-click-overlay="false"
			style="background-color: #F8F8F8;height: 80%;">
			<div class="popTitle">
				<div class="popTitle1" @click="cancle">取消</div>
				<div class="popTitle2">电话联系记录</div>
				<div class="popTitle3" @click="addTelInfo">添加</div>
			</div>
			<div class="popPlate1">
				<van-field v-model="followDesc" type="textarea" placeholder="请输入电话联系记录" rows="5" autosize
					maxlength="150" />
			</div>
		</van-popup>
		<van-overlay :show="showCall" z-index="100000">
			<div class="plate6">
				<div class="plate6_1">提示</div>
				<div class="plate6_5">是否拨打电话：{{callItem.merntCtaTel}}</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showCall=false">取消</div>
					<div class="palte6_4_2" @click="callCust">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		Toast,
		Dialog,
		Overlay,
		Button,
		ImagePreview
	} from "vant";
	import {
		queryEmployeeMustDoList,
		followEmployeeMustDo,
		opportCustServUploadMpaas,
		queryEmployeeMustDoDetail,
	} from "../../request/market.js";
	import {
		custServiceAdd
	} from "../../request/custinfo.js";
	import moment from "moment";
	import customerList from "../../components/common/customerList.vue";

	import {
		getSysCodeByType
	} from "../../request/common.js";
	export default {
		data() {
			return {
				isPhone:false,
				showCall:false,
				callItem: {},

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
				listHeight:'',
				finished:false,
				loading:false,
				beginDate:'',
				endDate:'',
				active:'',
                tageListActive: '',
				statusActive: '',
				statusList:[],
				dateShow1: false,
				dateShow2: false,
				isStartDate:false,
				isEndDate:false,
				minDate:new Date(2010, 0, 1),
				maxDate:new Date(2099,0,0),
                tageList: [
                    { key: '', title: "全部" },
                    { key: 0, title: "商户长期未交易" },
                    { key: 1, title: "调研" },
                ],
				finished: false,
				pageIndex: 0,
				mustDoNameList:[],
				mustDoKind:[],
				mustDoName:[],
				mastDoBclass:'',
				mastDoSt:'',
				mastDoNm:'',
				expDayStart:'',
				allNum:'',
				expDayEnd:'',
				mustDoList: [],
				showVisit: false,
				showVisit2: false,
				showVisit3:false,
				followValue: "",
				photoList: [],
				dingwei: "",
				openLocation: true,
				id:'',
				newVisit:false,
				followItem:{
					fileList: [],
					onsiteInspLctng:''
				},
				followDesc:'',
				custAddInfo:{},

			};
		},
		components: {customerList},
		methods: {
			gaveCall(item){
				if (isNaN(item.merntCtaTel)) {
					Toast.fail("电话号码格式有误");
					return;
				}
				if (!item.merntCtaTel) {
					Toast.fail("电话号码为空");
					return;
				}
				// item.isCall=true
				console.log('mustDoList',this.mustDoList)
				this.showCall = true;
				this.callItem = item;

			},
			callCust() {
				this.showCall = false;
				this.callItem.isCall = true;
				Toast.loading({
					message: "正在唤起",
					forbidClick: true,
					duration: 0
				});
				followEmployeeMustDo({
					isPhone: '1',
					id: this.callItem.id,

				}, (ress) => {
					Toast.clear();
					// this.isPhone=true
					AlipayJSBridge.call("callHandler", {
						phone: this.callItem.merntCtaTel
					}, (res) => {

					})
				});
				
			},
			chooseDate1(date) {
				var chooseDate = moment(date).format('YYYY-MM-DD');
				if (this.endDate && this.endDate != chooseDate && moment(this.endDate).isBefore(chooseDate)) {
					Toast("开始时间不能晚于结束时间");
					return;
				}
				this.beginDate = moment(date).format('YYYY-MM-DD');
				this.dateShow1 = false;
				this.pageIndex = 0;
				this.mustDoList = [];
				this.onLoad();
			},
			chooseDate2(date) {
				var chooseDate = moment(date).format('YYYY-MM-DD');
				if (this.beginDate && this.beginDate != chooseDate && moment(chooseDate).isBefore(this.beginDate)) {
					Toast("结束时间不能早于开始时间");
					return;
				}
				this.endDate = moment(date).format('YYYY-MM-DD');
				this.dateShow2 = false;
				this.pageIndex = 0;
				this.mustDoList = [];
				this.onLoad();
			},
			resetDate1() {
				this.beginDate = "";
				this.dateShow1 = false;
				this.pageIndex = 0;
				this.mustDoList = [];
				this.onLoad();
			},
			resetDate2() {
				this.endDate = "";
				this.dateShow2 = false;
				this.pageIndex = 0;
				this.mustDoList = [];
				this.onLoad();
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
				this.chooseCust={
					empName: "客户经理",
					empId: ""
				}
				this.openOrgList = false;
				this.pageIndex = 0;
				this.loading = true;
				this.mustDoList = [];
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
				this.mustDoList = [];
				this.onLoad();
			},
			tageListChange(el){
				if(this.mastDoBclass=='01'){
					if(el.name=='0'){
						this.mastDoNm=''
					}else{
						this.mastDoNm='0101'
					}
				}else if(this.mastDoBclass=='02'){
					if(el.name=='0'){
						this.mastDoNm=''
					}else{
						this.mastDoNm='0201'
					}
				}else{
					if(el.name=='0'){
						this.mastDoNm=''
					}else if(el.name=='1'){
						this.mastDoNm='0101'
					}else{
						this.mastDoNm='0201'
					}
				}
				this.pageIndex = 0;
				this.loading = true;
				this.mustDoList = [];
				this.onLoad();
			},
			statusListChange(el){
				if(el.name=='0'){
					this.mastDoSt=''
				}else if(el.name=='1'){
					this.mastDoSt='02'
				}else if(el.name=='2'){
					this.mastDoSt='01'
				}else{
					this.mastDoSt='03'
				}
				this.pageIndex = 0;
				this.loading = true;
				this.mustDoList = [];
				this.onLoad();
			},
			openVisit(el){
				this.newVisit=true
				this.id=el.id
				this.followValue = "";
				this.photoList = [];
				this.dingwei = "";
				this.custAddInfo=el
				this.showVisit = true;
				this.showVisit2 = false;
				this.getLocation();
			},
			addCustInfo(item,type){
				custServiceAdd({
					custName: item.cstName,
					custNo: item.custNum,
					mobileNum: item.merntCtaTel,
					communictionChannel: type,
					custManager:item.custMgrNm,
					serviceContent:this.followDesc,
					custOrgName:item.orgName,
					custType: '1',
					serviceChn: "10"
				}, (ress) => {
					Toast.clear();
					
				});
			},
			openTel(el){
				console.log(el)
				this.custAddInfo=el
				this.id=el.id
				this.followDesc = "";
				this.photoList = [];
				this.dingwei = "";
				this.showVisit3 = true;
				this.showVisit2 = false;
				this.showVisit = false;
			},
			openPhoto(file) {
				ImagePreview({
					images: [file],
					showIndex: false
				});
			},
			visitDetail(el){
				this.newVisit=false
				this.id=el.id
				this.showVisit = false;
				this.showVisit2 = true;
				this.getLocation();

				queryEmployeeMustDoDetail({
					id: this.id,
				}, (res) => {
					this.followItem=res.data
					console.log('this.followItem',this.followItem)
					this.followItem.showAllPhoto = false;
					Toast.clear();
				})
			},
			cancle() {
				this.showVisit = false;
				this.showVisit2 = false;
				this.showVisit3 = false;
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
				console.log(this.custAddInfo)
				if(this.custAddInfo.custNum){
					this.addCustInfo(this.custAddInfo,'01')
				}
				followEmployeeMustDo({
					id: this.id,
					mastDoSt:'01',
					onsiteInspLctng:this.dingwei,
					onsiteInspDsc:this.followValue,
					uploadIds: this.photoList.map(item => item.tableKey)
				}, (res) => {
					Toast.success(res.msg);
					this.showVisit = false;
					this.custAddInfo.mastDoSt='01'

					this.pageIndex = 0;
					this.loading = true;
					// this.mustDoList = [];
					// this.onLoad();
					Toast.clear();
				})
			},
			addTelInfo(){
				if(this.followDesc==''){
					Toast.fail("请输入拜访记录");
					return;
				}
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});

				if(this.custAddInfo.custNum){
					this.addCustInfo(this.custAddInfo,'02')
				}
				followEmployeeMustDo({
					id: this.id,
					mastDoSt:'01',
					onsiteInspLctng:this.dingwei,
					onsiteInspDsc:this.followDesc,
					uploadIds: []
				}, (res) => {
					Toast.success(res.msg);
					this.custAddInfo.mastDoSt='01'
					this.showVisit3 = false;
					this.pageIndex = 0;
					this.loading = true;

					// this.mustDoList = [];
					// this.onLoad();
					Toast.clear();
				})
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
						},(res2)=>{
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
			getHeight(){
				var mainHeight = document.documentElement.clientHeight;
				var listHeight = document.getElementById('listHeight');
				var toTop =  listHeight.offsetTop;
				this.listHeight = mainHeight-toTop
			},
			
			
			onClickTab(el){
				this.tageListActive='0'
				this.statusActive='0'
				this.mastDoNm=''
                if(el.name=='1'){
					this.mastDoBclass='01'
                    this.mustDoNameList=this.mustDoName.filter(item=>{
						return item.codeValue!='0201'
					})
                }else if(el.name=='2'){
					this.mastDoBclass='02'

                     this.mustDoNameList=this.mustDoName.filter(item=>{
						return item.codeValue!='0101'
					})
                }else{
					this.mastDoBclass=''
					this.mastDoSt=''
					this.mustDoNameList=this.mustDoName
				}
				this.pageIndex = 0;
				this.loading = true;
				this.mustDoList = [];
				this.onLoad();
            },
			onLoad() {
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				let params = {
					belongOrg: this.chooseOrg.value,
					belgCustMgr: this.chooseCust.empId,
					mastDoBclass:this.mastDoBclass,
					mastDoNm:this.mastDoNm,
					mastDoSt:this.mastDoSt,
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					expDayStart:this.beginDate.split("-").join(""),
					expDayEnd:this.endDate.split("-").join("")
				};
				this.params = JSON.stringify(params);
				queryEmployeeMustDoList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.allNum = res.data.total.toLocaleString();
						this.mustDoList = this.mustDoList.concat(res.data.records);
						if (this.mustDoList.length >= this.allNum) this.finished = true;
						console.log('this.mustDoList',this.mustDoList)
					} else {
						Toast.fail("必办列表为空");
						this.finished = true;
					}
					this.loading = false;
				});
			},
		},
		mounted() {
			this.getHeight()
			getSysCodeByType({
				codeType: "MUST_DO_TYPE"
			}, (res) => {
				if (res.data) {
					this.mustDoKind = res.data;
					this.mustDoKind.unshift({
						codeName: "全部",
						codeValue: ""
					})
				} else {
					Toast.fail("必办类别数据为空")
				}
			})
			getSysCodeByType({
				codeType: "MUST_DO_TYPE_NAME"
			}, (res) => {
				if (res.data) {
					this.mustDoName = res.data;
					this.mustDoName.unshift({
						codeName: "全部",
						codeValue: ""
					})
					this.mustDoNameList=this.mustDoName
				} else {
					Toast.fail("必办名称数据为空")
				}
			})
			getSysCodeByType({
				codeType: "MUST_DO_ST"
			}, (res) => {
				if (res.data) {
					this.statusList = res.data;
					this.statusList.unshift({
						codeName: "全部",
						codeValue: ""
					})
					this.statusList[1] = this.statusList.splice(2,1,this.statusList[1])[0]
					console.log('this.statusList',this.statusList)
				} else {
					Toast.fail("必办名称数据为空")
				}
			})
			
		},
	};
</script>

<style scoped lang="less">
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}
	:deep(.van-calendar__popup .van-popup__close-icon) {
		display: none;
	}

	:deep(.van-calendar__popup) {
		height: 60%;
	}
	.plate4_childBox::-webkit-scrollbar {
		display: none;
	}
	.plate4_childBox {
		width: 100%;
		flex-shrink: 1;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		overflow-x: auto;
	}
	.plate4_child {
		flex-shrink: 0;
		height: 0.28rem;
		min-width: 0.76rem;
		background: #F5F5F5;
		border-radius: 0.14rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.28rem;
		padding: 0 0.1rem;
		margin-right: 0.1rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
	.plate4_child_a {
		background: #E0EDFF;
		color: #026DFF;
	}
	.calendarTitle {
		width: 100%;
		padding: 0 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.calendarTitle1 {
		font-size: 0.15rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
	}

	.calendarTitle2 {
		font-size: 0.15rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #1D70F5;
	}

	.home {
		overflow: hidden;
		background-color: #fff;
	}
	.firstTab{
		width:93.6%;
		margin:0 auto;
		border-bottom: solid 1px #EFEFEF;
	  	padding: 0.08rem 0;

	}
	.tabBarStyle{
		// padding-top: 0.16rem;
	}
	.list {
      width: 93.6%;
	  margin: 0 auto;
	  padding: 0.16rem 0;
		border-bottom: solid 1px #EFEFEF;
	  
    //   padding: 0.01rem 0 0.15rem;
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
	.dateRow{
		display: flex;
		align-items: center;
		margin: 0.16rem 0.32rem;
	}
	
	
	
		.total {
		font-size: 0.1rem;
		color: #262626;
		height: 0.35rem;
		padding: 0 0.15rem;
		background-color: #F5F5F5;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}
	.vanList {
		// margin-top: 0.09rem;
		overflow: auto;
		background-color: #F5F5F5;

	}
	.msgCardOutBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
	}
	.msgCardBox {
		width: 100%;
		padding: 0.06rem 3%;
	}
	.msgCard {
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0 0 0.08rem -0.02rem #e0e0e0;
		border-radius: 0.1rem;
		font-size: 0.16rem;
		padding: 0.1rem 0.15rem;
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
		font-size: 0.16rem;
		font-weight: 500;
		flex-shrink: 1;
	}

	.msgValue1Right {
		display: flex;
		flex-shrink: 0;
	}

	.msgValue1RightItem {
		background-color: #2c3e50;
		color: #ffffff;
		font-size: 0.11rem;
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
		// width: 40%;
		flex-shrink: 1;
		font-weight: 400;
	}
	.daoqiDate{
		font-weight: 400;
		color: #262626;
		font-size: 0.12rem;
	}
	.msgContent{
		font-weight: 400;
	}
	.msgValue3 {
		border-bottom: solid 0.01rem #f5f5f5;
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
		font-size: 00.12rem;
		color: #999999;
	}
	
	.plate1 {
		width: 93.6%;
		margin: 0 auto;
		height: 0.54rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		border-bottom: solid 1px #EFEFEF;
	}

	.plate1_1 {
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		max-width: 40%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-right: 0.24rem;
	}

	.plate1_1_value {
		margin-right: 0.04rem;
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
	.popTime{
		text-align: right;
	}
	.popTimeDate{
		font-size: 0.14rem;
		color: #262626;
		margin-right: 0.16rem;
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
	.followItem5 {
		width: calc(100% - 0.2rem);
		margin: 0.12rem auto 0;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: -0.12rem;
	}

	.followItem5_1 {
		width: 0.75rem;
		height: 0.75rem;
		margin-right: calc(calc(100% - 3rem) / 3);
		margin-bottom: 0.12rem;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.followItem5_1:nth-child(4n) {
		margin-right: 0;
	}

	.followItem5_1>img {
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
</style>
