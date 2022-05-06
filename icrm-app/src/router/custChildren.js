export default [{
		path: '/clCustList',
		name: 'clCustList',
		component: () => import('@/views/cust/clCustList.vue')
	},
	{
		path: '/qzCustList',
		name: 'qzCustList',
		component: () => import('@/views/cust/qzCustList.vue')
	},
	{
		path: '/statisticForm',
		name: 'statisticForm',
		component: () => import('@/views/cust/statisticForm.vue')
	},
	{
		path: '/impQZCust',
		name: 'impQZCust',
		component: () => import('@/views/cust/impQZCust.vue')
	},
	{
		path: '/impQZCustAdd',
		name: 'impQZCustAdd',
		component: () => import('@/views/cust/impQZCustAdd.vue')
	},
	{
		path: '/impQZCustDetail',
		name: 'impQZCustDetail',
		component: () => import('@/views/cust/impQZCustDetail.vue')
	}
];
