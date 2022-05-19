<template>
	<div class="outBox">
		<van-popup v-model:show="showMBox"
			style="width: 91.5%;background: #FFFFFF;border-radius: 0.08rem;padding-bottom: 0.15rem;">
			<div class="plate1">短信发送</div>
			<div class="plate2"></div>
			<div class="plate3">
				<div class="plate3_1">
					<span style="font-size: 0.16rem;color: #026DFF;margin-top: 0.03rem;margin-right: 0.04rem;">*</span>
					<span>模板类型</span>
				</div>
				<div class="plate3_2" @click="showMBLX = true">
					<span v-if="MBLXName">{{MBLXName}}</span>
					<span v-else style="color: #C7C7C7;">点击选择模板类型</span>
				</div>
			</div>
			<div class="plate3">
				<div class="plate3_1">
					<span style="font-size: 0.16rem;color: #026DFF;margin-top: 0.03rem;margin-right: 0.02rem;">*</span>
					<span>模板名称</span>
				</div>
				<div class="plate3_2">
					<span v-if="!MBLXName" style="color: #C7C7C7;">请先选择模板类型</span>
					<span v-else-if="GMParams.tplNm" @click="showMBMC=true">{{GMParams.tplNm}}</span>
					<span v-else style="color: #C7C7C7;" @click="showMBMC=true">点击选择模板名称</span>
				</div>
			</div>
			<div class="plate3">
				<div class="plate3_1">
					<span style="font-size: 0.16rem;color: #026DFF;margin-top: 0.03rem;margin-right: 0.02rem;">*</span>
					<span>短信内容</span>
				</div>
				<div class="msgValue" ref="messageValue"></div>
			</div>
			<div class="plate3" style="flex-wrap: nowrap;" v-if="!haveTest">
				<div class="plate3_1" style="flex-shrink: 0;">
					<span style="font-size: 0.16rem;color: #026DFF;margin-top: 0.03rem;margin-right: 0.02rem;">*</span>
					<span>发送本人确认</span>
				</div>
				<van-field v-model="testTel" type="number" input-align="right" maxlength="11" placeholder="请输入联系电话" />
			</div>
			<div class="plate3" style="box-shadow: 0 0 0 0;">
				<div class="plate3_1">
					<span style="font-size: 0.16rem;color: #026DFF;margin-top: 0.03rem;margin-right: 0.02rem;">*</span>
					<span style="color: #BFBFBF;">系统会自动添加“如需退订，请回复TD”，无需人工填写</span>
				</div>
			</div>
			<div class="plate4">
				<div class="palte4_1" @click="cancle">取消</div>
				<div class="palte4_2" v-if="haveTest" @click="sendMsg">提交</div>
				<div class="palte4_2" v-else @click="testMsg">发送</div>
			</div>
		</van-popup>
		<van-popup v-model:show="showMBLX" position="bottom" style="max-height: 50%;">
			<div class="MBLXItem" v-for="(mblx,i) of mbTypeList" :key="'mblx'+i" @click="selectMBLX(mblx)">
				{{mblx.text}}
			</div>
			<div class="bottomZW"></div>
		</van-popup>
		<van-popup v-model:show="showMBMC" position="bottom" style="max-height: 50%;">
			<div class="MBItem" v-for="(mb,i) of mbList" :key="'mblx'+i" @click="selectMBMC(mb)">
				<div class="MBItemTitle">{{mb.text}}</div>
				<div class="MBItemValue">{{mb.value.split("$param$").join("**").split("$phone$").join("**")}}</div>
			</div>
			<div class="bottomZW"></div>
		</van-popup>
	</div>
</template>

<script>
	/**
	 * 引入请求函数
	 * @variable: getSysCodeByType 码值查询
	 * @variable: queryMessageTemplateListForOption 获取短信模板列表
	 * @variable: addMessageSendInfo 添加短信发送
	 * @variable: addCustSearchMessageSend 发送全部
	 * @variable: queryMessageKeyWordCheck 短信关键字校验
	 * @variable: addEsbMessageSendInfo ESB短信发送
	 */
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		queryMessageTemplateListForOption,
		addMessageSendInfo,
		queryMessageKeyWordCheck,
		addEsbMessageSendInfo,
    addCustSearchMessageSend
	} from "../../request/custinfo.js";
	/**
	 * 引入vant组件
	 * @variable: Toast 轻提示组件
	 */
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				mbTypeList: [],
				mbList: [],
				showMBox: false,
				showMBLX: false,
				showMBMC: false,
				MBLXName: "",
				baseValue: "",
				GMParams: {
					tplTp: "",
					tplNo: "",
					tplNm: "",
					shrtmsgCntnt: "",
					shrtmsgCnl: "8",
					custList: [],
					searchData: {},
					acsry: ""
				},
				haveTest: false,
				testTel: "",
				messageValue: "",
				msgType: ""
			}
		},
		methods: {
			/**
			 * @param {Object} msg
			 * 调用该方法打开短信发送弹框
			 * msg.type 类型值，用于判断发送短信用于何处
			 * msg.searchData 筛选条件，用于全部发送时的条件筛选
			 * msg.list 批量发送时的item数组，单个发送时传入长度为1的数组即可
			 */
			openMbox(msg) {
				this.msgType = msg.type;
				this.mbList = [];
				this.MBLXName = "";
				this.baseValue = "";
				this.GMParams = {
					tplTp: "",
					tplNo: "",
					tplNm: "",
					shrtmsgCntnt: "",
					shrtmsgCnl: msg.shrtmsgCnl,
					custList: [],
					searchData: {},
					acsry: msg.list[0].sysId
				};
				switch (msg.type) {
					case "CLCustListSendAll":
            this.GMParams = Object.assign(this.GMParams, msg.searchData)
						break;
					case "QZCustListSendAll":
						this.GMParams.searchData = msg.searchData;
						break;
					case "messageListSendAll":
						this.GMParams.searchData = msg.searchData;
						break;
					case "SJListSendAll":
						this.GMParams.searchData = msg.searchData;
						break;
					default:
						this.GMParams.custList = msg.list.map((item) => {
							return {
								custNum: item.custNo || item.custNum,
								cstName: item.custName || item.cstName|| item.custNm,
								mobileNum: item.ctcTel || item.phoneNo || item.telPhone
							}
						});
						break;
				}
				this.haveTest = false;
				this.testTel = "";
				this.showMBox = true;
			},
			selectMBLX(action) {
				Toast.loading({
					message: "正在获取短信模板",
					forbidClick: true,
					duration: 0
				});
				this.MBLXName = action.text;
				this.GMParams.tplTp = action.value;
				this.GMParams.tplNo = "";
				this.showMBLX = false;
				queryMessageTemplateListForOption({
					tplTp: action.value,
					pageNum: "1",
					pageSize: "10000"
				}, (res) => {
					Toast.clear();
					this.mbList = res.data.records.map((item) => {
						return {
							text: item.tplNm,
							code: item.sysId,
							value: item.tplCntnt,
							ioinAdr: item.ioinAdr,
							ioinCtcTel: item.ioinCtcTel,
							ioinCustMgr: item.ioinCustMgr,
							ioinDtl: item.ioinDtl
						}
					})
					if (!this.mbList.length) {
						this.mbList = [{
							text: "",
							code: "",
							value: "该模板类型为空",
							ioinAdr: "",
							ioinCtcTel: "",
							ioinCustMgr: "",
							ioinDtl: ""
						}]
					}
				})
			},
			selectMBMC(action) {
				if (!action.code) {
					this.showMBMC = false;
					return;
				};
				this.GMParams.tplNm = action.text;
				this.GMParams.tplNo = action.code;
				this.baseValue = action.value;
				let outTelValue = this.baseValue.split("$phone$").join(
					"<input id='custTel' type='number' maxlength='11'>");
				let outInputValue = outTelValue.split("$param$").join("<input class='msgInput' name='aaa' type='text'>");
				this.$refs.messageValue.innerHTML = outInputValue;
				var doms = this.$refs.messageValue.getElementsByTagName("input");
				for (let dom of doms) {
					dom.style.width = '92%';
					dom.style.margin = '0.05rem 4%';
					dom.style.padding = '0 0.15rem';
					dom.style.height = '0.25rem';
					dom.style.border = 'solid 0.01rem #F8F8F8';
					dom.style.borderRadius = '0.25rem';
					dom.style.backgroundColor = '#F8F8F8';
					dom.style.boxSizing = 'border-box';
				}
				this.showMBMC = false;
			},
			cancle() {
				this.$refs.messageValue.innerHTML = "";
				this.showMBox = false;
			},
			testMsg() {
				if (this.GMParams.tplTp && this.GMParams.tplNo && this.testTel) {
					let telValue = document.getElementById("custTel");
					let outTelValue = "";
					if (telValue) {
						outTelValue = this.baseValue.split("$phone$").join(telValue.value);
					} else {
						outTelValue = this.baseValue;
					}
					let inputHtml = this.$refs.messageValue.getElementsByClassName("msgInput");
					let outInputValue = outTelValue.split("$param$");
					this.messageValue = "";
					for (var i = 0; i < inputHtml.length; i++) {
						if (!inputHtml[i].value || inputHtml[i].value == "") {
							Toast.fail("请先完善短信内容");
							return done(false);
						}
						this.messageValue += outInputValue[i] + inputHtml[i].value;
					}
					if (outInputValue.length > inputHtml.length) this.messageValue += outInputValue[outInputValue.length - 1];
					this.GMParams.shrtmsgCntnt = this.messageValue + "如需退订，请回复TD。";
					Toast.loading({
						message: "正在发送",
						forbidClick: true,
						duration: 0
					});
					queryMessageKeyWordCheck({
						shrtmsgCntnt: this.messageValue + "如需退订，请回复TD。"
					},(res1)=>{
						if (res1.data) {
							Toast.fail("短信内容包含敏感词，请修改！");
						} else {
							addEsbMessageSendInfo({
								shrtmsgCntnt: this.messageValue + "如需退订，请回复TD。",
								mobileNum: this.testTel
							},(res2)=>{
								Toast.success("短信已发送至当前号码，请查收并确认是否符合预期！");
								this.haveTest = true;
							})
						}
					})
				} else {
					Toast.fail("请先完善信息");
				}
			},
			sendMsg() {
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				switch (this.msgType) {
					case "CLCustListSendAll":
            this.sendMessage(addCustSearchMessageSend)
						break;
					default:
            this.sendMessage(addMessageSendInfo)
						break;
				}
			},
      sendMessage(type){
				type(this.GMParams,(res)=>{
					Toast.success("提交成功");
					this.$refs.messageValue.innerHTML = "";
					this.$emit("closeBatchSendBtn");
					this.$emit("commitSuccess",this.messageValue + "如需退订，请回复TD。");
					this.showMBox = false;
				})
      }
		},
		mounted() {
			getSysCodeByType({
				codeType: "TPL_TP"
			}, (res) => {
				if (res.data) {
					this.mbTypeList = res.data.map((item) => {
						return {
							text: item.codeName,
							value: item.codeValue
						}
					})
				} else {
					Toast.fail("模板类型数据为空")
				}
			})
		}
	}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		border: 0;
		box-sizing: border-box;
	}

	.mainBox {
		width: 91.5%;
		height: 4.73rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
	}

	.plate1 {
		width: 100%;
		height: 0.5rem;
		font-family: PingFangSC-Regular;
		font-size: 0.16rem;
		color: #262626;
		text-align: center;
		line-height: 0.5rem;
		font-weight: 400;
	}

	.plate2 {
		width: 100%;
		height: 0.01rem;
		background: #EFEFEF;
	}

	.plate3 {
		width: 91.8%;
		padding: 0.15rem 0;
		margin: 0 auto;
		box-shadow: inset 0 -0.005rem 0 0 rgba(229, 229, 229, 1);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
	}

	.plate3_1,
	.plate3_2 {
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 400;
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-start;
		line-height: 0.22rem;
		height: 0.22rem;
		text-align: left;
	}

	.msgValue {
		width: 100%;
		min-height: 0.4rem;
		max-height: 1.2rem;
		font-family: PingFangSC-Regular;
		font-size: 0.14rem;
		color: #262626;
		letter-spacing: 0;
		font-weight: 400;
		margin-left: 0.1rem;
		margin-top: 0.03rem;
		line-height: 0.22rem;
		text-align: left;
		overflow: auto;
		word-break: break-all;
	}

	.plate4 {
		width: 100%;
		padding: 0 0.52rem;
		height: 0.3rem;
		margin-top: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.palte4_1 {
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

	.palte4_2 {
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

	.MBLXItem {
		width: 90%;
		margin: 0 auto;
		padding: 0.15rem 0;
		border-bottom: solid 0.01rem #F6F6F6;
		font-size: 0.14rem;
		text-align: center;
	}

	.MBItem {
		width: 90%;
		margin: 0.08rem auto 0;
		padding: 0.08rem;
		border-radius: 0.04rem;
		box-shadow: 0 0 0.08rem 0 rgba(223, 223, 223, 0.7);
	}

	.MBItemTitle {
		font-size: 0.14rem;
		color: #333333;
		font-weight: 600;
		margin-bottom: 0.03rem;
		text-align: left;
	}

	.MBItemValue {
		font-size: 0.12rem;
		color: #888888;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-align: left;
	}
</style>
