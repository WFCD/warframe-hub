import Vue from 'vue';
import Router from 'vue-router';

import Timer from './views/Timer.vue';
import Fish from './views/Fish.vue';
import HowToFish from './views/HowToFish.vue';
import error404 from './views/404.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Timer
    },
    {
      path: '/timer',
      name: 'timer',
      component: Timer
    },
    {
      path: '/fish',
      name: 'fish',
      component: Fish
    },
    {
      path: '/howtofish',
      name: 'howtofish',
      component: HowToFish
    },
    {
      path: '/404',
      name: 'Not Found',
      component: error404
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});

'/howtofish';
