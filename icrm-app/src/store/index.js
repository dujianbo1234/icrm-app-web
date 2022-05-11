import {
	createStore
} from 'vuex'

export default createStore({
	state() {
		return {
			userMsg: {},
			baseUrl: "",
		}
	},
	getters: {},
	mutations: {
		setUserMsg(state,userMsg) {
			state.userMsg = userMsg;
		},
		setBaseUrl(state,baseUrl) {
			state.baseUrl = baseUrl;
		},
		changeUserMsgRole(state,value) {
			state.userMsg.roleId = value.roleId;
			state.userMsg.roleName = value.roleName;
		}
	},
	actions: {},
	modules: {}
})
