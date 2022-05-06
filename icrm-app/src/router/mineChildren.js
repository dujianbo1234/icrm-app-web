export default [{
	path: '/msgPage',
	name: 'msgPage',
	component: () => import('@/views/mine/msgPage.vue')
},{
	path: '/setting',
	name: 'setting',
	component: () => import('@/views/mine/setting.vue')
},{
	path: '/changePwd',
	name: 'changePwd',
	component: () => import('@/views/mine/changePwd.vue')
}];
