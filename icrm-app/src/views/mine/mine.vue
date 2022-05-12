<template>
	<div class="home">
		<nav-bar title="我的" type="2" />
		<div class="plate1">
			<div class="plate1_1">
				<van-icon :name="require('../../assets/image/mine_main_userIcon.png')" size="60" />
				<div class="plate1_1_msgBox">
					<div class="plate1_1_empname">
						<span>{{$store.state.userMsg.empname}}</span>
					</div>
					<div class="plate1_1_roleName">{{$store.state.userMsg.roleName}}岗</div>
				</div>
			</div>
			<div class="plate1_2">
				<div class="plate1_2_1">
					<van-icon :name="require('../../assets/image/mine_main_custId.png')" style="margin-right: 0.06rem;"
						size="18" />
					<span>工号:{{userInfo.empno}}</span>
				</div>
				<div class="plate1_2_1" style="min-width: 50%;max-width: 70%;">
					<van-icon :name="require('../../assets/image/mine_main_org.png')" style="margin-right: 0.06rem;"
						size="18" />
					<span class="ycsl">机构:{{userInfo.orgName}}</span>
				</div>
			</div>
		</div>
		<div style="height: 1.47rem;"></div>
		<div class="plate2">
			<van-cell center title="指纹/人脸登录" :icon="require('../../assets/image/mine_main_item1.png')"
				v-if="touchType=='1'||touchType=='2'">
				<template #right-icon v-if="touchType=='1'">
					<van-icon @click="onUpdateValue" v-if="zwChecked"
						:name="require('../../assets/image/mine_main_s_1.png')" size="25" />
					<van-icon @click="onUpdateValue" v-else :name="require('../../assets/image/mine_main_s_0.png')"
						size="25" />
				</template>
				<template #right-icon v-else>
					<van-icon @click="onUpdateValue" v-if="rlChecked"
						:name="require('../../assets/image/mine_main_s_1.png')" size="25" />
					<van-icon @click="onUpdateValue" v-else :name="require('../../assets/image/mine_main_s_0.png')"
						size="25" />
				</template>
			</van-cell>
			<van-cell center title="意见反馈" :icon="require('../../assets/image/mine_main_item2.png')">
				<template #right-icon>
					<van-icon @click="showPopup1=true" :name="require('../../assets/image/mine_main_edit.png')"
						size="20" />
				</template>
			</van-cell>
			<van-cell center title="工作宣言" :icon="require('../../assets/image/mine_main_item3.png')">
				<template #right-icon>
					<van-icon @click="manifesto=userInfo.manifesto;showPopup2=true;"
						:name="require('../../assets/image/mine_main_edit.png')" size="20" />
				</template>
			</van-cell>
		</div>
		<div class="bottomBtns">
			<div class="bottomBtn" style="color: #FFFFFF;background: #026DFF;margin-bottom: 0.15rem;"
				@click="roleId_a=$store.state.userMsg.roleId;showRole=true">切换角色</div>
			<div class="bottomBtn" style="color: #026DFF;background: #FFFFFF;" @click="logOut">退出登录</div>
			<div class="bottomZW"></div>
		</div>
		<van-popup v-model:show="showPopup1" round z-index="100002" :close-on-click-overlay="false">
			<div class="popPlate yjfk">
				<div class="popPlate1">意见反馈</div>
				<van-field v-model="advice" type="textarea" placeholder="请输入..." />
				<div class="popPlate3">
					<div class="popPlate3_1" @click="showPopup1=false;advice=''">取消</div>
					<div class="popPlate3_2" @click="commitAdvice">提交</div>
				</div>
			</div>
		</van-popup>
		<van-popup v-model:show="showPopup2" round z-index="100002" :close-on-click-overlay="false">
			<div class="popPlate">
				<div class="popPlate1">工作宣言</div>
				<van-field v-model="manifesto" type="textarea" maxlength="15" show-word-limit placeholder="请输入工作宣言" />
				<div class="popPlate3">
					<div class="popPlate3_1" @click="showPopup2=false;manifesto=''">取消</div>
					<div class="popPlate3_2" @click="commitManifesto">保存</div>
				</div>
			</div>
		</van-popup>
		<van-popup v-model:show="showRole" position="bottom" z-index="100002">
			<div class="roleBox">
				<div class="roleItem" :class="item.roleId==roleId_a?'roleItem_a':''" v-for="(item,i) in roleList"
					:key="'roleItem'+i" @click="roleId_a=item.roleId">{{item.roleName}}</div>
				<div class="roleBtnBox">
					<div class="roleBtn_cancle" @click="showRole=false">取消</div>
					<div class="roleBtn_confirm" @click="changeRole(roleList.find(item=>item.roleId==roleId_a))">确认切换
					</div>
				</div>
			</div>
			<div class="bottomZW"></div>
		</van-popup>
		<!-- <van-popup v-model:show="pageShow" :overlay-style="{'background-color': 'rgba(255, 255, 255, 0.5)', 'z-index': '100002'}"/> -->
	</div>
</template>

<script>
	import {
		getEmpInfo,
		addSysPrpslInfo,
		updateModifyEmpInformation
	} from "../../request/theme.js";
	import {
		getEmpMultLoginFlag,
		updateEmpMultLoginFlag,
		loginout,
		getRoleList,
		roleSwitch
	} from "../../request/login.js";
	import {
		Toast,
		Dialog
	} from "vant";
	export default {
		data() {
			return {
				userInfo: {},
				zwChecked: false,
				rlChecked: false,
				touchType: "",
				showPopup1: false,
				showPopup2: false,
				advice: "",
				manifesto: "",
				showRole: false,
				roleList: [],
				roleId_a: "",
				// pageShow: true
			}
		},
		methods: {
			onUpdateValue() {
				if (this.touchType == "1") {
					var value = this.zwChecked ? "0" : "1";
					var errValue = "TouchID";
					var params = {
						faceEnableFlag: this.rlChecked ? "1" : "0",
						fingerprintEnableFlag: this.zwChecked ? "0" : "1"
					};
				} else if (this.touchType == "2") {
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
			},
			commitAdvice() {
				if (this.advice) {
					Toast.loading({
						message: "正在提交",
						forbidClick: true,
						duration: 0
					});
					addSysPrpslInfo({
						prpslCntnt: this.advice
					}, (res) => {
						this.showPopup1 = false;
						Toast.success("提交成功");
					})
				}
			},
			commitManifesto() {
				if (this.manifesto) {
					Toast.loading({
						message: "正在保存",
						forbidClick: true,
						duration: 0
					});
					updateModifyEmpInformation({
						manifesto: this.manifesto
					}, (res) => {
						this.showPopup2 = false;
						this.userInfo.manifesto = this.manifesto;
						Toast.success("保存成功");
					})
				}
			},
			logOut() {
				Dialog.confirm({
					title: "确认信息",
					message: "您确定退出当前帐号吗？",
					confirmButtonColor: "#026DFF",
					cancelButtonColor: "#999999"
				}).then(() => {
					Toast.loading({
						message: "正在注销登录",
						forbidClick: true,
						duration: 0
					});
					loginout({
						empNo: this.$store.state.userMsg.empno
					}, (res) => {
						Toast.clear()
						AlipayJSBridge.call('popWindow');
					})
				})
			},
			changeRole(val) {
				Dialog.confirm({
					title: "确认信息",
					message: `确定切换到 ${val.roleName} 吗？`,
					confirmButtonColor: "#026DFF",
					cancelButtonColor: "#999999"
				}).then(() => {
					Toast.loading({
						message: "正在切换",
						forbidClick: true,
						duration: 0
					});
					roleSwitch({
						orgId: this.$store.state.userMsg.orgid,
						empNo: this.$store.state.userMsg.empno,
						roleId: val.roleId
					}, (res) => {
						this.$store.commit("changeUserMsgRole", val);
						this.showRole = false;
						Toast.success("切换成功");
					})
				})
			},
		},
		mounted() {
			// this.pageShow = false;
			getEmpInfo({}, (res) => {
				if (res.data) {
					this.userInfo = res.data;
				} else {
					Toast.fail("用户信息数据为空");
				}
			});
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
			getRoleList({}, (res) => {
				if (res.data) {
					this.roleList = [];
					res.data.forEach(list => list.roleList.forEach(item => this.roleList.push({
						roleType: item.roleType,
						roleId: item.roleId,
						roleName: item.roleName
					})));
					this.beginRoleIndex = this.roleList.indexOf(this.roleList.find(item => item.roleId == this
						.$store.state.userMsg.roleId))
				} else {
					Toast.fail("用户角色列表数据为空");
				}
			})
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
	
	:deep(.van-overlay) {
		z-index: 100002;
	}

	.plate1 {
		width: 100%;
		height: 1.37rem;
		background: #FFFFFF;
		box-shadow: 0 0.01rem 0.02rem 0 rgba(244, 244, 244, 0.66);
		position: fixed;
		z-index: 100000;
		padding: 0 0.26rem;
	}

	.plate1_1 {
		width: 100%;
		height: 0.97rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		border-bottom: solid 1px #EFEFEF;
		;
	}

	.plate1_1_msgBox {
		margin-left: 0.15rem;
	}

	.plate1_1_empname {
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		line-height: 0.25rem;
		color: #20243A;
		letter-spacing: 0;
		text-align: center;
		font-weight: 500;
		text-align: left;
	}

	.plate1_1_roleName {
		margin-top: 0.02rem;
		opacity: 0.7;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #555555;
		letter-spacing: 0;
		font-weight: 400;
		text-align: left;
	}

	.plate1_2 {
		width: 100%;
		height: 0.4rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.plate1_2_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		color: #20243A;
		letter-spacing: 0;
		text-align: center;
		font-weight: 400;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.plate2 {
		width: 93.6%;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 0.08rem;
		padding: 0 0.12rem;
	}

	.plate2:deep(.van-cell) {
		line-height: 0.2rem;
		padding: 0.15rem 0;
		align-items: center;
		border-bottom: solid 1px #EDEDED;
	}

	:deep(.van-cell__left-icon) {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding-bottom: 0.02rem;
		margin-right: 0.12rem;
	}

	:deep(.van-cell:last-child) {
		border: 0;
	}

	:deep(.van-cell::after) {
		border-bottom: 0;
	}

	:deep(.van-cell__title) {
		font-size: 0.14rem;
		color: #20243A;
		text-align: left;
	}

	.checkBox {
		width: 0.25rem;
		height: 0.15rem;
		background-color: pink;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popPlate {
		width: 3rem;
		background: #FFFFFF;
		border-radius: 0.08rem;
		padding: 0.2rem 0.24rem;
	}

	.popPlate1 {
		width: 100%;
		height: 0.22rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 500;
		margin-bottom: 0.2rem;
	}

	.popPlate3 {
		width: 100%;
		height: 0.3rem;
		margin-top: 0.24rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.popPlate3_1 {
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

	.popPlate3_2 {
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

	.yjfk:deep(.van-field__control) {
		height: 1.2rem;
	}

	.popPlate:deep(.van-field__value) {
		background-color: #F6F7FA;
		border-radius: 0.05rem;
		overflow: hidden;
	}

	:deep(.van-field__control) {
		margin: 0 auto;
		background-color: #F6F7FA;
		padding: 0.05rem 0.08rem;
		border-top-left-radius: 0.05rem;
		border-top-right-radius: 0.05rem;
		height: 0.6rem;
		overflow-y: auto;
	}

	:deep(.van-field__word-limit) {
		width: 90%;
		margin: 0 auto 0.05rem;
	}

	.bottomBtns {
		width: 100%;
		position: fixed;
		bottom: 0.88rem;
	}

	.bottomBtn {
		width: 91.5%;
		height: 0.45rem;
		margin: 0 auto;
		box-shadow: inset 0 -0.005rem 0 0 rgba(220, 220, 220, 0.5);
		border-radius: 0.08rem;
		font-family: PingFangSC-Medium;
		font-size: 0.16rem;
		color: #FFFFFF;
		background: #026DFF;
		letter-spacing: 0;
		text-align: center;
		line-height: 0.45rem;
		font-weight: 500;
	}

	.roleBox {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0.3rem 5% 0.3rem;
	}

	.roleItem {
		width: 47%;
		line-height: 0.35rem;
		margin-bottom: 0.15rem;
		border-radius: 0.05rem;
		font-size: 0.13rem;
		border: solid 1px #EFEFEF;
		background-color: #F8F8F8;
		color: #999999;
	}

	.roleItem_a {
		border: solid 1px #026DFF;
		background-color: #DFEEFF;
		color: #026DFF;
	}

	.roleBtnBox {
		width: 100%;
		height: 0.5rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		font-size: 0.14rem;
		margin-top: 0.1rem;
	}

	.roleBtn_cancle {
		width: 47%;
		height: 0.4rem;
		border: 0.01rem solid #EFEFEF;
		border-radius: 0.2rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #999999;
		text-align: center;
		line-height: 0.4rem;
		font-weight: 500;
	}

	.roleBtn_confirm {
		width: 47%;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.2rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #FFFFFF;
		text-align: center;
		line-height: 0.4rem;
		font-weight: 500;
	}
</style>
