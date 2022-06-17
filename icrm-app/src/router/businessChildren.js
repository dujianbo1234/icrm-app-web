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
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/business/busiDetail.vue')
}, {
	path: '/cycpList',
	name: 'cycpList',
	component: () => import('@/views/business/cycpList.vue')
}];
