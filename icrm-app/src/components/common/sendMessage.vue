<template>
	<div class="outBox">
		<van-dialog v-model="showMBox" title="短信发送" :showCancelButton="true" :confirmButtonText="haveTest?'提交':'发送'"
			:before-close="upMessage">
			<van-field readonly clickable name="picker" :left-icon="x_icon" :value="MBLXName" label="模板类型"
				placeholder="点击选择模板类型" @click="showMBLX = true" />
			<van-field readonly clickable name="picker" :left-icon="x_icon" :value="GMParams.tplNm" label="模板名称"
				placeholder="点击选择模板名称" @click="Boolean(mbList.length)?(showMBMC = true):''" />
			<van-field :left-icon="x_icon" rows="1" readonly label="短信内容" type="text" />
			<div class="msgValuePlace" ref="messageValue"></div>
			<van-field v-show="!haveTest" v-model="testTel" :left-icon="x_icon" label="发送本人确认" type="number"
				maxlength="11" placeholder="请输入联系电话" />
			<div style="width: 85%;margin: 10px auto;color: #999999;font-size: 13px;display: flex;">
				<div style="color: red;padding: 0 5px;">*</div>系统会自动添加“如需退订，请回复TD”，无需人工填写
			</div>
		</van-dialog>
		<van-popup v-model="showMBLX" position="bottom" style="max-height: 50%;">
			<div class="MBLXItem" v-for="(mblx,i) of mbTypeList" :key="'mblx'+i" @click="selectMBLX(mblx)">{{mblx.text}}
			</div>
		</van-popup>
		<van-popup v-model="showMBMC" position="bottom" style="max-height: 50%;">
			<div class="MBItem" v-for="(mb,i) of mbList" :key="'mblx'+i" @click="selectMBMC(mb)">
				<div class="MBItemTitle">{{mb.text}}</div>
				<div class="MBItemValue">{{mb.value.split("$param$").join("**").split("$phone$").join("**")}}</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	/**
	 * 引入请求函数
	 * @variable: getSysCodeByType 码值查询
	 * @variable: queryMessageTemplateListForOption 获取短信模板列表
	 * @variable: addMessageSendInfo 添加短信发送
	 * @variable: queryMessageKeyWordCheck 短信关键字校验
	 * @variable: addEsbMessageSendInfo ESB短信发送
	 */
	import {
		getSysCodeByType,
		queryMessageTemplateListForOption,
		addMessageSendInfo,
		queryMessageKeyWordCheck,
		addEsbMessageSendInfo,
	} from "../../request/custinfo.js";
	/**
	 * 引入vant组件
	 * @variable: Toast 轻提示组件
	 */
	import {
		Toast
	} from "vant";
	export default {
		name: "sendMessage",
		props: {
			title: {
				type: String,
				required: false,
				default: () => {
					return "短信发送"
				}
			}
		},
		data() {
			return {
				mbTypeList: [],
				mbList: [],
				showMBox: true,
				showMBLX: false,
				showMBMC: false,
				MBLXName: "请选择模板类型",
				baseValue: "",
				GMParams: {
					tplTp: "",
					tplNo: "",
					tplNm: "请先选择模板类型",
					shrtmsgCntnt: "",
					shrtmsgCnl: "5",
					custList: [],
					searchData: {}
				},
				haveTest: false,
				testTel: "",
				x_icon: require('../../assets/image/tabbar_cust_main_messagePoint.png'),
				messageValue: "",
				msgType: ""
			}
		},
		methods: {
			openMbox(msg) {
				this.msgType = msg.type;
				this.mbList = [];
				this.MBLXName = "请选择模板类型";
				this.baseValue = "";
				this.GMParams = {
					tplTp: "",
					tplNo: "",
					tplNm: "请先选择模板类型",
					shrtmsgCntnt: "",
					shrtmsgCnl: "5",
					custList: [],
					searchData: {}
				};
				switch (msg.type) {
					case "CLCustListSendAll":
						this.GMParams.searchData = msg.searchData;
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
								cstName: item.custName || item.cstName,
								mobileNum: item.ctcTel || item.phoneNo || item.telPhone
							}
						});
						break;
				}
				this.haveTest = false;
				this.testTel = "";
				this.showMBox = true;
			},
			async selectMBLX(action) {
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
				},(res)=>{
					Toast.clear();
					if (res.data.records.length) {
						this.mbList = [];
						for (let item of res.data.records) {
							let obj = {
								text: item.tplNm,
								code: item.sysId,
								value: item.tplCntnt,
								ioinAdr: item.ioinAdr,
								ioinCtcTel: item.ioinCtcTel,
								ioinCustMgr: item.ioinCustMgr,
								ioinDtl: item.ioinDtl
							};
							this.mbList.push(obj)
						}
						this.GMParams.tplNm = "请选择短信模板";
					} else {
						this.GMParams.tplNm = "该模板类型为空";
						this.mbList = [];
					}
				})
			},
			selectMBMC(action) {
				this.GMParams.tplNm = action.text;
				this.GMParams.tplNo = action.code;
				this.baseValue = action.value;
				let outTelValue = this.baseValue.split("$phone$").join(
					"<input id='custTel' type='number' maxlength='11'>");
				let outInputValue = outTelValue.split("$param$").join("<input class='msgInput' type='text'>");
				this.$refs.messageValue.innerHTML = outInputValue;
				this.$refs.messageValue.getElementsByTagName("input").forEach((item) => {
					item.style.width = '96%';
					item.style.margin = '0.133262rem 2%';
					item.style.padding = '0 0.133262rem';
					item.style.height = '0.666311rem';
					item.style.border = 'solid 1px #666666';
				});
				this.showMBMC = false;
			},

			async upMessage(action, done) {
				if (action === "confirm") {
					if (this.haveTest) {
						Toast.loading({
							message: "正在提交",
							forbidClick: true,
							duration: 0
						});
						addMessageSendInfo(this.GMParams,(res)=>{
							Toast.success("提交成功");
							this.$refs.messageValue.innerHTML = "";
							this.$emit("closeBatchSendBtn");
							return done();
						})
					} else {
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
							if (outInputValue.length > inputHtml.length) this.messageValue += outInputValue[
								outInputValue.length - 1];
							this.GMParams.shrtmsgCntnt = this.messageValue + "如需退订，请回复TD。";
							Toast.loading("正在发送");
							var res1 = await queryMessageKeyWordCheck({
								shrtmsgCntnt: this.messageValue + "如需退订，请回复TD。"
							});
							if (res1.code == 0) {
								if (res1.data) {
			  				Toast.fail("短信内容包含敏感词，请修改！");
									return done(false);
								} else {
									var res2 = await addEsbMessageSendInfo({
										shrtmsgCntnt: this.messageValue + "如需退订，请回复TD。",
										mobileNum: this.testTel
									});
									if (res2.code == 0) {
										Toast.success("短信已发送至当前号码，请查收并确认是否符合预期！");
										this.haveTest = true;
										return done(false);
									} else {
										Toast.fail("发送失败：" + res.msg);
			 					}
									return done(false);
								}
							} else {
								Toast.fail("发送失败：" + res.msg);
			  			return done(false);
							}
						} else {
			 			Toast.fail("请先完善信息");
							return done(false);
						}
					}
				} else {
					this.$refs.messageValue.innerHTML = "";
					return done()
				}
			}
		},

		async mounted() {
			let res = await getSysCodeByType({
				codeType: "TPL_TP"
			});
			if (res && res.code == 0) {
				for (let i in res.data) {
					let obj = {
						text: res.data[i].codeName,
						value: res.data[i].codeValue
					};
					this.mbTypeList.push(obj)
				}
			} else {
				Toast.fail('查询参数出错');
			}
		}
	}
</script>

<style scoped>
	/deep/ .van-cell::before {
		content: normal;
	}

	/deep/ .van-cell::after {
		content: normal;
	}

	/deep/ .van-cell {
		width: 100%;
		border-bottom: 1px solid rgba(90, 90, 90, 0.2);
	}

	/deep/ .van-popover__wrapper {
		width: 100%;
	}

	.MBLXItem {
		width: 90%;
		margin: 0 auto;
		padding: 0.399786rem 0;
		border-bottom: solid 1px #F6F6F6;
		font-size: 0.373134rem;
		text-align: center;
	}

	.MBItem {
		width: 90%;
		margin: 0.213219rem auto 0;
		padding: 0.213219rem;
		border-radius: 0.133262rem;
		box-shadow: 0 0 0.213219rem 0 rgba(223, 223, 223, 0.7);
	}

	.MBItemTitle {
		font-size: 0.373134rem;
		color: #333333;
		font-weight: 600;
		margin-bottom: 0.079957rem;
	}

	.MBItemValue {
		font-size: 0.319829rem;
		color: #888888;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.msgValuePlace {
		width: 88%;
		margin: 0 auto;
		padding: 0.266524rem;
		border-bottom: 1px solid rgba(90, 90, 90, 0.2);
		font-size: 0.319829rem;
		line-height: 0.533049rem;
		max-height: 3.997867rem;
		min-height: 1.066098rem;
		overflow: auto;
	}
</style>
