export default [{
	path: '/chooseCust',
	name: 'chooseCust',
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/business/chooseCust.vue')
}, {
	path: '/busiDetail',
	name: 'busiDetail',
	component: () => import('@/views/business/busiDetail.vue')
}, ];
