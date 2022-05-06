import {
	createStore
} from 'vuex'

export default createStore({
	state() {
		return {
			userMsg: {},
		}
	},
	getters: {},
	mutations: {
		setUserMsg(state,userMsg) {
			state.userMsg = userMsg;
		},
		changeUserMsgRole(state,value) {
			state.userMsg.roleId = value.roleId;
			state.userMsg.roleName = value.roleName;
		}
	},
	actions: {},
	modules: {}
})
