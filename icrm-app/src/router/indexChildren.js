export default [
  {
    path: '/MorningEvening',
    name: 'MorningEvening',
    component: () => import('@/views/index/MorningEvening.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/index/message.vue')
  }];
