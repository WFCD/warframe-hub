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
      meta: {
        title: 'Warframe Hub',
        metaTags: [
          {
            name: 'description',
            content: 'Warframe hub strives to be the community center of the Warframe game.'
          },
          {
            name: 'og:description',
            content: 'Warframe hub strives to be the community center of the Warframe game.'
          },
        ],
      },
    },
    {
      path: '/timer',
      name: 'timer',
      component: Timer,
      meta: {
        title: 'Warframe Hub',
        metaTags: [
          {
            name: 'description',
            content: 'Warframe hub strives to be the community center of the Warframe game.'
          },
          {
            name: 'og:description',
            content: 'Warframe hub strives to be the community center of the Warframe game.'
          },
        ],
      },
    },
    {
      path: '/poe/map',
      name: 'Plains of Eidolon Map',
      component: PoEMap,
      meta: {
        title: 'Warframe Hub | PoE Map',
        metaTags: [
          {
            name: 'description',
            content: 'Overworld map for the Plains of Eidolon'
          },
          {
            name: 'og:description',
            content: 'Overworld map for the Plains of Eidolon'
          },
        ],
      },
    },
    {
      path: '/poe/fish',
      name: 'Plains of Eidolon Fish',
      component: PoEFish,
      meta: {
        title: 'Warframe Hub | PoE Fish',
        metaTags: [
          {
            name: 'description',
            content: 'Fish Information and resources for the Plains of Eidolon'
          },
          {
            name: 'og:description',
            content: 'Fish Information and resources for the Plains of Eidolon'
          },
        ],
      },
    },
    {
      path: '/poe/fish/howto',
      name: 'howtofish',
      component: HowToFish,
      meta: {
        title: 'Warframe Hub | How to Fish',
        metaTags: [
          {
            name: 'description',
            content: 'Guide on how to fish on the Plains of Eidolon'
          },
          {
            name: 'og:description',
            content: 'Guide on how to fish on the Plains of Eidolon'
          },
        ],
      },
    },
    {
      path: '/vallis/fish',
      name: 'Vallis Fish',
      component: VallisFish,
      meta: {
        title: 'Warframe Hub | Orb Vallis Fish',
        metaTags: [
          {
            name: 'description',
            content: 'Fish Information and resources for the Ob Vallis'
          },
          {
            name: 'og:description',
            content: 'Fish Information and resources for the Ob Vallis'
          },
        ],
      },
    },
    {
      path: '/vallis/map',
      name: 'Orb Vallis Map',
      component: VallisMap,
      meta: {
        title: 'Warframe Hub | Orb Vallis Map',
        metaTags: [
          {
            name: 'description',
            content: 'Overworld map for the Orb Vallis'
          },
          {
            name: 'og:description',
            content: 'Overworld map for the Orb Vallis'
          },
        ],
      },
    },
    {
      path: '/404',
      name: 'Not Found',
      component: error404,
    },
    {
      path: '*',
      redirect: '/404'
    },
  ],
});
