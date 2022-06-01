export default [
  {
    path: '/MorningEvening',
    name: 'MorningEvening',
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
