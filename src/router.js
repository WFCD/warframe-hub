import Vue from 'vue';
import Router from 'vue-router';

import Timer from './views/Timer.vue';

import PoEMap from './views/PoEMap.vue';
import PoEFish from './views/Fish.vue';
import HowToFish from './views/HowToFish.vue';

import VallisFish from './views/VallisFish.vue';
import VallisMap from './views/VallisMap.vue';
import HowToFishVallis from './views/HowToFishVallis.vue';

import RivenData from './views/RivenData.vue';
import Synthesis from './views/Synthesis.vue';

import error404 from './views/404.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Timer,
    meta: {
      title: 'Warframe Hub',
      metaTags: [
        {
          name: 'description',
          content: 'Warframe hub strives to be the community center of the Warframe game.',
        },
        {
          name: 'og:description',
          content: 'Warframe hub strives to be the community center of the Warframe game.',
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
          content: 'Warframe hub strives to be the community center of the Warframe game.',
        },
        {
          name: 'og:description',
          content: 'Warframe hub strives to be the community center of the Warframe game.',
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
          content: 'Overworld map for the Plains of Eidolon',
        },
        {
          name: 'og:description',
          content: 'Overworld map for the Plains of Eidolon',
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
          content: 'Fish Information and resources for the Plains of Eidolon',
        },
        {
          name: 'og:description',
          content: 'Fish Information and resources for the Plains of Eidolon',
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
          content: 'Guide on how to fish on the Plains of Eidolon',
        },
        {
          name: 'og:description',
          content: 'Guide on how to fish on the Plains of Eidolon',
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
          content: 'Fish Information and resources for the Orb Vallis',
        },
        {
          name: 'og:description',
          content: 'Fish Information and resources for the Orb Vallis',
        },
      ],
    },
  },
  {
    path: '/vallis/fish/howto',
    name: 'howtofishvallis',
    component: HowToFishVallis,
    meta: {
      title: 'Warframe Hub | OV - How to Fish',
      metaTags: [
        {
          name: 'description',
          content: 'Guide on how to fish in Orb Vallis',
        },
        {
          name: 'og:description',
          content: 'Guide on how to fish in Orb Vallis',
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
          content: 'Overworld map for the Orb Vallis',
        },
        {
          name: 'og:description',
          content: 'Overworld map for the Orb Vallis',
        },
      ],
    },
  },
  {
    path: '/riven/data',
    name: 'Riven Data',
    component: RivenData,
    meta: {
      title: 'Warframe Hub | Riven Data',
      metaTags: [
        {
          name: 'description',
          content: 'Riven trading data provided by Digital Extremes',
        },
        {
          name: 'og:description',
          content: 'Riven trading data provided by Digital Extremes',
        },
      ],
    },
  },
  {
    path: '/synthesis',
    name: 'Synthesis Targets',
    component: Synthesis,
    meta: {
      title: 'Warframe Hub | Synthesis Targets',
      metaTags: [
        {
          name: 'description',
          content: 'Synthesis Target mission lookup information',
        },
        {
          name: 'og:description',
          content: 'Synthesis Target mission lookup information',
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
    redirect: '/404',
  },
];

const router = new Router({
  routes,
  mode: 'hash',
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
  },
});

// From https://alligator.io/vuejs/vue-router-modify-head/
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);
  // eslint-disable-next-line no-unused-vars
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) {
    return next();
  }

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
