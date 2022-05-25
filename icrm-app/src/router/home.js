import indexChildren from './indexChildren';
import teamFightChildren from './teamFightChildren';
import custChildren from './custChildren';
import businessChildren from './businessChildren';
import mineChildren from './mineChildren';

const routes = [{
	path: '/',
	component: () => import('@/views/tabbar.vue'),
	children: [{
			path: '/',
			redirect: '/index'
		},{
			path: '/index',
			name: 'index',
			component: () => import('@/views/index/index.vue')
		},
		...indexChildren,
		{
			path: '/teamFight',
			name: 'teamFight',
			component: () => import('@/views/teamFight/teamFight.vue')
		},
		...teamFightChildren,
		{
			path: '/cust',
			name: 'cust',
			component: () => import('@/views/cust/cust.vue')
		},
		...custChildren,
		{
			path: '/business',
			name: 'business',
			component: () => import('@/views/business/business.vue')
		},
		...businessChildren,
		{
			path: '/mine',
			name: 'mine',
			component: () => import('@/views/mine/mine.vue')
		},
		{
			path: '/mustDoList',
			name: 'mustDoList',
			component: () => import('@/views/mustDo/mustDoList.vue')
		},
		...mineChildren,
	]
}];

export default routes;
