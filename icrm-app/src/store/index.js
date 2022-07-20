import {
	createStore
} from 'vuex'

export default createStore({
	state() {
		return {
			userMsg: {},
			configInfo: {},
		}
	},
	getters: {},
	mutations: {
		setUserMsg(state,userMsg) {
			state.userMsg = userMsg;
		},
		setConfigInfo(state,configInfo) {
			state.configInfo = configInfo;
		},
		changeUserMsgRole(state,value) {
			state.userMsg.roleId = value.roleId;
			state.userMsg.roleName = value.roleName;
		}
	},
	actions: {},
	modules: {}
})
