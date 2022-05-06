<template ref="appBox">
	<div v-if="pageType=='0'">
		<div class="navbar">
			<div class="title">修改密码</div>
			<div class="leftIcon" @click="back">
				<van-icon size="0.24rem" name="arrow-left" color="#FFFFFF" />
			</div>
		</div>
		<div style="width: 100%;height: 0.95rem;"></div>
		<van-field v-model="oldPwd" type="password" label="原密码" placeholder="请输入原密码" :error-message="errMsg1"
			@focus="errMsg1=''" />
		<van-field v-model="newPwd1" type="password" label="新密码" placeholder="请设置新密码" :error-message="errMsg2"
			@focus="errMsg2=''" @blur="newPwdReg" />
		<van-field v-model="newPwd2" type="password" label="确认密码" placeholder="请再次输入新密码" :error-message="errMsg3"
			@focus="errMsg3=''" @blur="secondReg" />
		<div class="regMsg" style="margin-top: 0.1rem;">* 密码长度为8-20之间</div>
		<div class="regMsg">* 密码需包含至少一个数字</div>
		<div class="regMsg">* 密码需包含至少一个小写字母</div>
		<div class="regMsg">* 密码需包含至少一个大写字母</div>
		<div class="regMsg">* 密码需包含至少一个特殊符号</div>
		<div class="regMsg" style="color: #FF3333;" v-if="touchType=='-1'">* 设备认证失败,无法开启指纹或人脸登录功能</div>
		<!-- <div class="regMsg" style="color: #FF3333;" v-if="touchType=='0'">* 当前设备不支持指纹或人脸登录功能</div> -->
		<div class="btnBox">
			<div class="confirmBtn" v-if="touchType=='1'||touchType=='2'" @click="upNewPwd">下一步</div>
			<div class="confirmBtn" v-else @click="upNewPwd">提交</div>
		</div>
		<div class="bottomW"></div>
		<div class="shuiyin" v-if="showSY">
			<span style="margin-right: 1.9rem;" v-for="i of 100" :key="i">{{$store.state.userMsg.empname}}
				{{$store.state.userMsg.empno}} {{$store.state.userMsg.loginTime}}</span>
		</div>
	</div>
	<div v-else>
		<div class="navbar">
			<div class="title">指纹/人脸登录设置</div>
		</div>
		<div style="width: 100%;height: 0.7rem;"></div>
		<van-cell center title="是否开启指纹验证登录" v-if="touchType=='1'">
			<template #right-icon>
				<van-switch :model-value="zwChecked" @update:model-value="onUpdateValue" :loading="zwLoading"
					size="30" />
			</template>
		</van-cell>
		<van-cell center title="是否开启人脸验证登录" v-else-if="touchType=='2'">
			<template #right-icon>
				<van-switch :model-value="rlChecked" @update:model-value="onUpdateValue" :loading="rlLoading"
					size="30" />
			</template>
		</van-cell>
		<div class="btnBox">
			<div class="confirmBtn" @click="saveSet">保存</div>
		</div>
		<div class="bottomW"></div>
	</div>
</template>

<script>
	import {
		editPwd,
		loginout
	} from "./request/login.js";
	import {
		getEmpMultLoginFlag,
		updateEmpMultLoginFlag
	} from "./request/login.js";
	import {
		Toast,
		Dialog
	} from "vant";
	export default {
		data() {
			return {
				oldPwd: "",
				newPwd1: "",
				newPwd2: "",
				errMsg1: "",
				errMsg2: "",
				errMsg3: "",
				showSY: false,
				touchType: "",
				pageType: "0",
				zwChecked: false,
				rlChecked: false,
				zwLoading: false,
				rlLoading: false,
			}
		},
		methods: {
			newPwdReg() {
				var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,20}$/;
				if (!reg.test(this.newPwd1)) {
					this.errMsg2 = "密码格式不正确"
				};
				this.secondReg();
			},
			secondReg() {
				if (this.newPwd2 !== this.newPwd1) {
					this.errMsg3 = "两次输入的密码不一致"
				} else {
					this.errMsg3 = "";
				}
			},
			upNewPwd() {
				if (!this.oldPwd || !this.newPwd1 || !this.newPwd2) return;
				if (this.errMsg1 || this.errMsg2 || this.errMsg3) return;
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				editPwd({
					pwd: this.oldPwd,
					newPwd: this.newPwd1
				}, (res) => {
					Toast.clear();
					if (this.touchType == '1' || this.touchType == '2') {
						this.pageType = '1'
					} else {
						Dialog.alert({
							message: '设置完成，即将返回至登录页',
						}).then(() => {
							loginout({
								empNo: this.$store.state.userMsg.empno
							}, (res) => {
								Toast.clear()
								AlipayJSBridge.call('popWindow');
							})
						});
					}
				})
			},
			saveSet() {
				Dialog.alert({
					message: '设置完成，即将返回至登录页',
				}).then(() => {
					loginout({
						empNo: this.$store.state.userMsg.empno
					}, (res) => {
						Toast.clear()
						AlipayJSBridge.call('popWindow');
					})
				});
			},
			back() {
				Dialog.alert({
					message: '未完成首次密码修改，即将返回至登录页',
				}).then(() => {
					loginout({
						empNo: this.$store.state.userMsg.empno
					}, (res) => {
						Toast.clear()
						AlipayJSBridge.call('popWindow');
					})
				});
			},
			onUpdateValue() {
				if (this.touchType == "1") {
					this.zwLoading = true;
					var value = this.zwChecked ? "0" : "1";
					var errValue = "TouchID";
					var params = {
						faceEnableFlag: this.rlChecked ? "1" : "0",
						fingerprintEnableFlag: this.zwChecked ? "0" : "1"
					};
				} else if (this.touchType == "2") {
					this.rlLoading = true;
					var value = this.rlChecked ? "0" : "1";
					var errValue = "FaceID";
					var params = {
						faceEnableFlag: this.rlChecked ? "0" : "1",
						fingerprintEnableFlag: this.zwChecked ? "1" : "0"
					};
				};
				AlipayJSBridge.call('touchIDHandler', {
					type: "1",
				}, (res1) => {
					if (res1.result) {
						switch (res1.result) {
							// 0: 当前设备不支持TouchID/FaceID
							// 1: TouchID/FaceID 验证成功
							// 2: TouchID/FaceID 验证失败
							// 3: TouchID/FaceID 被用户手动取消
							// 4: 用户不使用TouchID/FaceID,选择手动输入密码
							// 5: TouchID/FaceID 被系统取消 (如来电,锁屏,按Home键等)
							// 6: TouchID/FaceID 无法启动,因为用户没有设置密码
							// 7: TouchID/FaceID 无法启动,因为用户未设置设置
							// 8: TouchID/FaceID 无效
							// 9: TouchID/FaceID 被锁定 (连续多次验证失败,系统需要用户手动输入密码)
							// 10: 当前软件被挂起并取消了授权 (如App进入了后台等)
							// 11: 当前软件被挂起并取消了授权
							// 12: 系统版本不支持TouchID/FaceID
							case "0":
								Toast.fail("当前设备不支持 " + errValue);
								break;
							case "1":
								updateEmpMultLoginFlag(params, (res2) => {
									if (res2.data) {
										this.zwChecked = res2.data.fingerprint_enable_flag == "1";
										this.rlChecked = res2.data.face_enable_flag == "1";
										this.zwLoading = false;
										this.rlLoading = false;
										AlipayJSBridge.call('setAPDataStorage', {
											type: "common",
											business: "business_userInfo",
											key: "kTouchID",
											value: this.touchType == "1" ? res2.data
												.fingerprint_enable_flag : res2.data
												.face_enable_flag
										});
										AlipayJSBridge.call('setAPDataStorage', {
											type: "common",
											business: "business_userInfo",
											key: "kLoginToken",
											value: res2.data.login_token
										});
									}
								});
								break;
							case "2":
								Toast.fail(errValue + " 验证失败");
								break;
							case "6":
								Toast.fail(errValue + " 无法启动,因为用户没有设置密码");
								break;
							case "7":
								Toast.fail(errValue + " 无法启动,因为用户未设置设置");
								break;
							case "8":
								Toast.fail(errValue + " 无效");
								break;
							case "9":
								Toast.fail(errValue + " 被锁定");
								break;
							case "12":
								Toast.fail("系统版本不支持 " + errValue);
								break;
						}
					}
				});
				this.zwLoading = false;
				this.rlLoading = false;
			}
		},
		beforeCreate() {
			AlipayJSBridge.call('getAPDataStorage', {
				type: "common",
				business: "business_userInfo",
				key: "kUserInfo",
			}, (res) => {
				if (res.success && res.data) {
					this.$store.commit("setUserMsg", JSON.parse(res.data));
				}
			});
		},
		mounted() {
			AlipayJSBridge.call('touchIDHandler', {
				type: "0",
			}, (res1) => {
				if (res1.result) {
					getEmpMultLoginFlag({}, (res2) => {
						if (res2.data) {
							this.zwChecked = res2.data.fingerprint_enable_flag == "1";
							this.rlChecked = res2.data.face_enable_flag == "1";
							this.touchType = res1.result;
							this.touchType = "0";
						}
					})
				}
			});
			Dialog.alert({
				message: '检测到您为第一次登录，请修改密码或返回至登录页',
			});
			setTimeout(() => {
				this.showSY = true
			}, 100)
		}
	}
</script>

<style>
	.home {
		background-color: #F5F6FA;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.van-dialog__header {
		padding: 13px 0 !important;
	}

	.van-dropdown-menu__bar {
		height: calc(0.5rem - 1px) !important;
		box-shadow: 0 0 0 0 !important;
		border-bottom: solid 1px #F5F6FA !important;
	}

	.van-dialog {
		top: calc(constant(safe-area-inset-top) + 45%) !important;
		top: calc(env(safe-area-inset-top) + 45%) !important;
	}

	.ycsl {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>

<style scoped>
	* {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		border: 0;
	}

	.navbar {
		background-color: #4477CC;
		color: #FFFFFF;
		height: 0.5rem;
		width: 100%;
		position: fixed;
		top: constant(safe-area-inset-top);
		top: env(safe-area-inset-top);
		left: 0;
		z-index: 99999;
	}

	.title {
		width: 100%;
		line-height: 0.5rem;
		font-size: 0.18rem;
		font-weight: 600;
		text-align: center;
		letter-spacing: 1.5px;
	}

	.leftIcon {
		width: 0.5rem;
		height: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
	}

	.shuiyin {
		position: fixed;
		top: -50%;
		left: -50%;
		z-index: 99998;
		pointer-events: none;
		width: 200%;
		height: 200%;
		transform: rotateZ(-30deg);
		font-size: 0.15rem;
		overflow: hidden;
		line-height: 0.8rem;
		opacity: .2;
	}

	:deep(.van-cell) {
		padding: 0.1rem 0.2rem;
	}

	.regMsg {
		width: 100%;
		font-size: 0.13rem;
		text-align: left;
		padding: 0.05rem 0.15rem;
		color: #999999;
	}

	.btnBox {
		width: 100%;
		height: 0.6rem;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
	}

	.confirmBtn {
		width: 93%;
		line-height: 0.4rem;
		border-radius: 0.2rem;
		margin: 0.1rem auto;
		font-size: 0.16rem;
		font-weight: 600;
		color: #FFFFFF;
		text-align: center;
		background-image: linear-gradient(120deg, #0088FF, #44CCFF);
		box-shadow: 2px 1px 6px -1px #0066FF;
	}

	.bottomW {
		width: 100%;
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	:deep(.van-cell__title) {
		text-align: left;
		font-size: 0.16rem;
	}

	:deep(.van-cell__value) {
		text-align: center;
		color: #FF5555;
	}

	.changePwd {
		width: 90%;
		margin: 0.2rem auto 0;
		font-size: 0.16rem;
		text-align: center;
		color: #333333;
		background-color: #FFFFFF;
		line-height: 0.4rem;
		border-radius: 0.05rem;
		box-shadow: 0 0 0.08rem -0.05rem #CCCCCC;
	}
</style>
