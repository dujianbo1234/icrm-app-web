<template>
	<div class="home">
		<nav-bar title="我的" />
		<div class="topPlace">
			<div class="message" @click="$router.push('/msgPage')"></div>
			<div class="userIcon"></div>
			<div class="userName">{{$store.state.userMsg.empname}}</div>
			<div class="userRole">「{{$store.state.userMsg.roleName}}」</div>
		</div>
		<div style="width: 100%;height: 1.56rem;"></div>
		<div class="msgPlace">
			<van-cell v-for="(item,i) in userInfo" :key="'userItem'+i" :title="item.name" :value="item.value||''"
				:icon="item.icon" :is-link="item.isLink" @click="touchCell(item)" />
		</div>
		<div class="btnPlace">
			<div class="mineBtn" @click="roleId_a=$store.state.userMsg.roleId;showRole=true">切换角色</div>
			<div class="mineBtn" @click="logOut">退出登录</div>
		</div>
		<van-dialog v-model:show="showDialog" title="系统建议" show-cancel-button @cancle="showDialog=false"
			@confirm="changeAdvice">
			<van-field v-model="advice" type="textarea" placeholder="请输入建议" />
		</van-dialog>
		<van-popup v-model:show="showRole" position="bottom">
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
	</div>
</template>

<script>
	import navBar from "../../components/common/navbar.vue";
	import {
		getRoleList,
		roleSwitch,
		loginout
	} from "../../request/login.js";
	import {
		getEmpInfo,
		addSysPrpslInfo
	} from "../../request/theme.js";
	import {
		Dialog,
		Toast
	} from "vant";
	export default {
		data() {
			return {
				userInfo: [{
						name: "员工号",
						value: "",
						icon: require("../../assets/image/mine_main_userId.png"),
						isLink: false
					},
					{
						name: "机构",
						value: "",
						icon: require("../../assets/image/mine_main_organization.png"),
						isLink: false
					},
					{
						name: "部门",
						value: "",
						icon: require("../../assets/image/mine_main_department.png"),
						isLink: false
					},
					{
						name: "邮箱",
						value: "",
						icon: require("../../assets/image/mine_main_email.png"),
						isLink: false
					},
					{
						name: "系统建议",
						value: "",
						icon: require("../../assets/image/mine_main_advice.png"),
						isLink: true
					},
					{
						name: "设置",
						value: "",
						icon: require("../../assets/image/mine_main_setting.png"),
						isLink: true
					},
				],
				showDialog: false,
				advice: "",
				showRole: false,
				roleList: [],
				roleId_a: ""
			}
		},
		methods: {
			touchCell(item) {
				if (item.isLink) {
					switch (item.name) {
						case "系统建议":
							this.advice = "";
							this.showDialog = true;
							break;
						case "设置":
							this.$router.push('/setting');
							break;
					}
				}
			},
			changeAdvice() {
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				addSysPrpslInfo({
					prpslCntnt: this.advice
				}, (res) => {
					this.showDialog = false;
					Toast.success("提交成功");
				})
			},
			changeRole(val) {
				Dialog.confirm({
					title: "确认信息",
					message: `确定切换到 ${val.roleName} 吗？`
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
			logOut() {
				Dialog.confirm({
					title: "确认信息",
					message: "您确定退出当前帐号吗？"
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
			}
		},
		mounted() {
			getEmpInfo({}, (res) => {
				if (res.data) {
					this.userInfo.forEach((item) => {
						switch (item.name) {
							case "员工号":
								item.value = res.data.empno;
								break;
							case "机构":
								item.value = res.data.orgName;
								break;
							case "部门":
								item.value = res.data.bumenName;
								break;
							case "邮箱":
								item.value = res.data.email;
								break;
							case "工作宣言":
								item.value = res.data.manifesto;
								break;
						}
					});
				} else {
					Toast.fail("用户信息数据为空");
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

	.home {
		width: 100%;
		height: 100%;
		background-color: #F6F7FA;
	}

	.topPlace {
		width: 100%;
		height: 1.6rem;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 0.46rem);
		top: calc(env(safe-area-inset-top) + 0.46rem);
		left: 0;
		z-index: 1;
		background: url(../../assets/image/mine_main_topBG.png) no-repeat center top;
		background-size: cover;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.message {
		width: 0.5rem;
		height: 0.5rem;
		position: absolute;
		top: 0;
		left: 0;
		background: url(../../assets/image/mine_main_message.png) no-repeat center;
		background-size: 50%;
	}

	.userIcon {
		width: 0.64rem;
		height: 0.64rem;
		background: url(../../assets/image/mine_main_userIcon.png) no-repeat center;
		background-size: contain;
		margin: 0 0.12rem;
	}

	.userName {
		font-size: 0.2rem;
		font-weight: 600;
		margin-left: 0.04rem;
	}

	.userRole {
		font-size: 0.12rem;
		letter-spacing: 1px;
	}

	.msgPlace {
		margin-top: 0.16rem;
		padding: 0 0.16rem;
		background-color: #FFFFFF;
	}

	:deep(.van-cell) {
		padding: 0.1rem 0;
		justify-content: space-around;
	}

	:deep(.van-cell__left-icon) {
		top: 4px;
		margin-right: 0.08rem;
	}

	:deep(.van-cell__title) {
		min-width: 25%;
		max-width: 25%;
		text-align: left;
		font-size: 0.15rem;
		font-weight: 500;
		color: #333333;
	}

	:deep(.van-cell__value) {
		text-align: right;
		font-size: 0.14rem;
		font-weight: 500;
		color: #888888;
	}

	.btnPlace {
		margin-top: 0.16rem;
	}

	.mineBtn {
		width: 100%;
		line-height: 0.4rem;
		background-color: #FFFFFF;
		text-align: center;
		margin-bottom: 0.1rem;
		font-size: 0.14rem;
		color: #888888;
	}

	:deep(.van-field__control) {
		width: 90%;
		margin: 0 auto;
		background-color: #F6F7FA;
		padding: 0.05rem 0.08rem;
		border-radius: 0.05rem;
		height: 1.2rem;
		overflow-y: auto;
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
		font-size: 0.14rem;
		border: solid 1px #e9e9e9;
		background-color: #f6f6f6;
		color: #787878;
	}

	.roleItem_a {
		border: solid 1px #86adc4;
		background-color: #e1f4fe;
		color: #5993b2;
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

	.roleBtnBox>div {
		width: 47%;
		line-height: 0.5rem;
		border-radius: 0.1rem;
	}

	.roleBtn_cancle {
		background-color: #ffffff;
		color: #AAAAAA;
		border: solid 1px #DDDDDD;
	}

	.roleBtn_confirm {
		background-color: #53b1f0;
		color: #FFFFFF;
	}
</style>
