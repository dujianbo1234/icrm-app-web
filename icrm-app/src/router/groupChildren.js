export default [{
	path: '/myGroup',
	name: 'myGroup',
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/group/myGroup.vue')
}, {
	path: '/groupDetail',
	name: 'groupDetail',
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/group/groupDetail.vue')
}, {
	path: '/groupAddCust',
	name: 'groupAddCust',
	component: () => import('@/views/group/groupAddCust.vue')
}, {
	path: '/filterGroup',
	name: 'filterGroup',
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/group/filterGroup.vue')
}, {
	path: '/groupSearchResult',
	name: 'groupSearchResult',
	meta: {
		keepAlive: true
	},
	component: () => import('@/views/group/groupSearchResult.vue')
}];
