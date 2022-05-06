<template>
	<div>
		<nav-bar title="修改密码" leftIcon />
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
		<div class="btnBox">
			<div class="confirmBtn" @click="upNewPwd">提交</div>
		</div>
		<div class="bottomW"></div>
	</div>
</template>

<script>
	import {
		editPwd,
		loginout
	} from "../../request/login.js";
	import {
		Dialog,
		Toast
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
				}else{
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
				}, (res1) => {
					Toast.clear();
					Dialog.alert({
						message: '密码修改成功，即将返回至登录页',
					}).then(() => {
						loginout({
							empNo: this.$store.state.userMsg.empno
						}, (res2) => {
							Toast.clear()
							AlipayJSBridge.call('popWindow');
						})
					});
				})
			},
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
</style>
