import routes from './home'
import {
	createRouter,
	createWebHashHistory
} from 'vue-router';

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

// 路由守卫
// router.beforeEach((to, from,next) => {
// 	if(to.path === '/cust'){
// 		next()
// 	}else{
// 		// 判断是否联网
// 		let status = madp.device.getNetWorkInfo()
// 		if (statu == -1){
// 			router.push('/noNetWork')
// 		}
// 	}
// })

export default router
