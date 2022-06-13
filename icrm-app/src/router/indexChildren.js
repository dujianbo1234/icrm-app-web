export default [
  {
    path: '/MorningEvening',
    name: 'MorningEvening',
    // meta: {
    //   keepAlive: true
    // },
    component: () => import('@/views/index/MorningEvening.vue')
  },
  {
    path: '/addNewRecord',
    name: 'addNewRecord',
    component: () => import('@/views/index/addNewRecord.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/index/message.vue')
  }];
