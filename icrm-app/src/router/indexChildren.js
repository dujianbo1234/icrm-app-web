export default [{
		path: '/MorningEvening',
		name: 'MorningEvening',
		component: () => import('@/views/index/MorningEvening.vue')
	},
	{
		path: '/message',
		name: 'message',
		meta: {
			keepAlive: true
		},
		component: () => import('@/views/index/message.vue')
	}
];
