import Vue from 'vue';
import Router from 'vue-router';

import Timer from './views/Timer.vue';

import PoEMap from './views/PoEMap.vue';
import PoEFish from './views/Fish.vue';
import HowToFish from './views/HowToFish.vue';

import VallisFish from './views/VallisFish.vue';
import VallisMap from './views/VallisMap.vue';

import error404 from './views/404.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Timer,
    },
    {
      path: '/timer',
      name: 'timer',
      component: Timer,
    },
    {
      path: '/poe/map',
      name: 'Plains of Exile Map',
      component: PoEMap,
    },
    {
      path: '/poe/fish',
      name: 'fish',
      component: PoEFish,
    },
    {
      path: '/poe/fish/howto',
      name: 'howtofish',
      component: HowToFish,
    },
    {
      path: '/vallis/fish',
      name: 'Vallis Fish',
      component: VallisFish,
    },
    {
      path: '/vallis/map',
      name: 'Orb Vallis Map',
      component: VallisMap,
    },
    {
      path: '/404',
      name: 'Not Found',
      component: error404,
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
