<template>
	<div class="home">
		<nav-bar title="设置" leftIcon />
		<van-cell value="设备认证失败,无法开启指纹或人脸登录功能" v-if="touchType=='-1'" />
		<van-cell value="当前设备不支持指纹或人脸登录功能" v-else-if="touchType=='0'" />
		<van-cell center title="是否开启指纹验证登录" v-else-if="touchType=='1'">
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
		<div class="changePwd" @click="$router.push('/changePwd')">修改密码</div>
		<div style="width: 100%;height: 0.2rem;"></div>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		getEmpMultLoginFlag,
		updateEmpMultLoginFlag
	} from "../../request/login.js";
	export default {
		data() {
			return {
				zwChecked: false,
				rlChecked: false,
				zwLoading: false,
				rlLoading: false,
				touchType: "",
			}
		},
		methods: {
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
											value: this.touchType == "1" ? res2.data.fingerprint_enable_flag : res2.data.face_enable_flag
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
		created() {
			AlipayJSBridge.call('touchIDHandler', {
				type: "0",
			}, (res1) => {
				if (res1.result) {
					getEmpMultLoginFlag({}, (res2) => {
						if (res2.data) {
							this.zwChecked = res2.data.fingerprint_enable_flag == "1";
							this.rlChecked = res2.data.face_enable_flag == "1";
							this.touchType = res1.result;
						}
					})
				}
			});
		}
	}
</script>

<style scoped>
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
