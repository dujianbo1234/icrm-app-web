export default [{
		path: '/clCustList',
		name: 'clCustList',
		meta: {
			keepAlive: true
		},
		component: () => import('@/views/cust/clCustList.vue')
	},
	{
		path: '/clCustomerView',
		name: 'clCustomerView',
		component: () => import('@/views/cust/clCustomerView.vue')
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
		path: '/gtghList',
		name: 'gtghList',
		component: () => import('@/views/cust/gtghList.vue')
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
	},
	{
		path: '/messageSend',
		name: 'messageSend',
		component: () => import('@/views/message/messageSend.vue')
	},
	{
		path: '/shangJiHot',
		name: 'shangJiHot',
		component: () => import('@/views/business/shangJiHot.vue')
	},
	{
		path: '/baiFangList',
		name: 'baiFangList',
		component: () => import('@/views/cust/baiFangList.vue')
	},
	{
		path: '/jiushuWebview',
		name: 'jiushuWebview',
		component: () => import('@/views/cust/jiushuWebview.vue')
	}
];
