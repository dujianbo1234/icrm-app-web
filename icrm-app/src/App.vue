<template ref="appBox">
	<router-view />
	<div class="shuiyin" v-if="showSY">
		<span style="margin-right: 1rem" v-for="i of 100" :key="i">{{ $store.state.userMsg.empname }}
			{{ $store.state.userMsg.empno }}{{ $store.state.userMsg.loginTime }}</span>
	</div>
	<van-popup v-model:show="showSecret" round :close-on-click-overlay="false"
		:overlay-style="{ 'background-color': '#888888' }">
		<div class="secretBox">
			<div class="secretTitle">数据安全保护承诺书</div>
			<div class="secretValue">
				<div style="margin-bottom: 0.1rem">我承诺：</div>
				<div>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在九银爱客的使用过程中，自觉做好应用内数据安全保护，不通过截屏录屏等方式泄露数据信息，如有违背，将承担相应数据泄露责任。
				</div>
				<div style="text-align: right; margin-top: 0.1rem">
					承诺人：{{ $store.state.userMsg.empname }}
				</div>
				<div style="text-align: right; margin-bottom: 0.1rem">
					工号：{{ $store.state.userMsg.empid }}
				</div>
				<van-checkbox class="checkbox" v-model="checked" icon-size="0.16rem" label-disabled>我已阅读并同意上述承诺书内容
				</van-checkbox>
			</div>
			<div class="secretBtn">
				<div class="secretBtn_cancle" @click="cancleSecret">取消</div>
				<div :class="checked ? 'secretBtn_confirm_a' : 'secretBtn_confirm'" @click="confirmSecret">
					确认
				</div>
			</div>
		</div>
	</van-popup>
</template>

<script>
	import {
		updateFirstSignFlag,
		loginout,
		getIcrmConfigInfo,
	} from "./request/login.js";
	import {
		Toast,
		Dialog
	} from "vant";
	import AES from "./api/AES.js";
	export default {
		data() {
			return {
				showSY: false,
				showSecret: false,
				checked: false,
			};
		},
		methods: {
			cancleSecret() {
				loginout({
						empNo: this.$store.state.userMsg.empno,
					},
					(res) => {
						Toast.clear();
						AlipayJSBridge.call("popWindow");
					}
				);
			},
			confirmSecret() {
				if (this.checked) {
					updateFirstSignFlag({}, (res) => {
						this.showSecret = false;
					});
				}
			},
		},
		beforeCreate() {
			var Base64 = require('js-base64').Base64;
			AlipayJSBridge.call("getAPDataStorage", {
				type: "common",
				business: "business_userInfo",
				key: "kUserInfo",
			}, (res) => {
				if (res.success && res.data) {
					// 判断手机机型
					var u = navigator.userAgent;
					if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
						//安卓手机
						res.data = Base64.decode(res.data);
					} else if (u.indexOf('iPhone') > -1) {
						//苹果手机
					} else if (u.indexOf('Windows Phone') > -1) {
						//winphone手机
					}
					this.$store.commit("setUserMsg", JSON.parse(res.data));
					this.showSecret =
						AES.decrypt(JSON.parse(res.data).firstSignFlag) == "0";
				}
			});

			getIcrmConfigInfo({}, (res) => {
				this.$store.commit("setBaseUrl", res.data.icrmUrl);
			});

			document.addEventListener(
				"back",
				(e) => {
					e.preventDefault();
					this.$router.go(-1);
				},
				false
			);

			document.addEventListener(
				"pause",
				(e) => {
					e.preventDefault();
				},
				false
			);
		},
		mounted() {
			setTimeout(() => {
				this.showSY = true;
			}, 100);
		},
	};
</script>

<style>
	.zIndex {
		z-index: 999999 !important;
	}

	.home {
		background-color: #f5f5f5;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		user-select: none;
	}

	.van-dialog__header {
		padding: 13px 0 !important;
	}

	.van-dropdown-menu__bar {
		height: calc(0.5rem - 1px) !important;
		box-shadow: 0 0 0 0 !important;
		border-bottom: solid 1px #f5f6fa !important;
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

	.bottomZW {
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom);
	}
</style>

<style scoped>
	.shuiyin {
		position: fixed;
		top: -50%;
		left: -50%;
		z-index: 99998;
		pointer-events: none;
		width: 200%;
		height: 200%;
		transform: rotateZ(-20deg);
		font-size: 0.12rem;
		overflow: hidden;
		line-height: 0.8rem;
		opacity: 0.08;
	}

	.secretBox {
		width: 80vw;
	}

	.secretTitle {
		line-height: 0.5rem;
		border-bottom: solid 1px #dfdfdf;
		font-weight: 500;
		font-size: 0.18rem;
	}

	.secretValue {
		font-size: 0.16rem;
		padding: 0.1rem 0.2rem;
		text-align: left;
	}

	.secretBtn {
		display: flex;
		flex-wrap: nowrap;
		font-size: 0.16rem;
		line-height: 0.5rem;
	}

	.secretBtn>div {
		width: 50%;
	}

	.secretBtn_cancle {
		border-top: solid 1px #dfdfdf;
		color: #999999;
	}

	.secretBtn_confirm_a {
		background-color: #0088ff;
		color: #ffffff;
	}

	.secretBtn_confirm {
		background-color: #cccccc;
		color: #ffffff;
	}

	.checkbox:deep(*) {
		box-sizing: border-box;
	}

	.checkbox {
		height: 0.3rem;
		font-size: 0.14rem;
	}

	:deep(.van-checkbox__icon) {
		height: 0.3rem !important;
		padding: 0.06rem 0 !important;
	}

	:deep(.van-checkbox__label) {
		color: #0066ff;
		height: 0.3rem !important;
		line-height: 0.3rem;
	}
</style>
