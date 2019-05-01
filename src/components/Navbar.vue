<template>
  <nav class="flex items-center justify-between flex-wrap bg-page py-6 px-2">
    <div class=" group flex items-center flex-no-shrink mr-6">
      <svg
        class="group-hover:fill-hover fill-default  h-8 w-8 mr-2 text-red-100 "
        width="54"
        height="54"
        viewBox="0 0 54 54"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
        />
      </svg>
      <span
        class="font-semibold  group-hover:text-hover text-default text-xl tracking-tight"
        >Warframe Hub</span
      >
    </div>
    <div class="block sm:hidden">
      <button
        @click="toggle"
        class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white"
      >
        <svg
          class="fill-current h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div
      :class="open ? 'block' : 'hidden'"
      class="z-50 w-full flex-grow sm:flex sm:items-center sm:w-auto"
    >
      <div class="  text-sm sm:flex-grow">
        <router-link
          to="/"
          exact
          class=" block mt-4 sm:inline-block sm:mt-0 text-default hover:text-hover mr-4"
          ><i class="fas fa-clock faIconStyle"></i> Timers</router-link
        >
        <!-- Plains -->
        <div
          class="group no-underline block mt-4 sm:inline-block sm:mt-0  hover:text-hover text-default hover:text-white mr-4"
        >
          <div class="flex items-center cursor-pointer py-1">
            <button class="bg-blue  ">
              <span>Plains</span>
            </button>
          </div>
          <div
            class="items-center absolute border border-t-0 rounded rounded-t-none bg-page invisible group-hover:visible"
          >
            <ul class="list-reset ">
              <li>
                <router-link
                  to="/poe/map"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-map-marker-alt faIconStyle"></i>
                  Map</router-link
                >
              </li>
              <li>
                <router-link
                  to="/poe/map"
                  class="px-2 py-2 block text-default hover:text-hover"
                  exact
                  ><i class="fas  fa-fish faIconStyle"></i> Fishing
                  Data</router-link
                >
              </li>
              <li>
                <router-link
                  to="/poe/fish/howto"
                  class="px-2 py-2 block text-default hover:text-hover"
                  exact
                  ><i class="fas  fa-info faIconStyle"></i> How to
                  Fish</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <!-- Orb Valis -->
        <div
          class="group no-underline block mt-4 sm:inline-block sm:mt-0  hover:text-hover text-default hover:text-white mr-4"
        >
          <div class="flex items-center cursor-pointer py-1">
            <button class="bg-blue  ">
              <span>Orb Valis</span>
            </button>
          </div>
          <div
            class="items-center absolute border border-t-0 rounded rounded-t-none bg-page invisible group-hover:visible"
          >
            <ul class="list-reset ">
              <li>
                <router-link
                  to="/vallis/map"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-map-marker-alt faIconStyle"></i>
                  Map</router-link
                >
              </li>
              <li>
                <router-link
                  to="/vallis/fish"
                  class="px-2 py-2 block text-default hover:text-hover"
                  exact
                  ><i class="fas  fa-fish faIconStyle"></i> Fishing
                  Data</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <!-- Projects -->
        <div
          class="group no-underline block mt-4 sm:inline-block sm:mt-0  hover:text-hover text-default hover:text-white mr-4"
        >
          <div class="flex items-center cursor-pointer py-1">
            <button class="bg-blue  ">
              <span>Projects</span>
            </button>
          </div>
          <div
            class="items-center absolute border border-t-0 rounded rounded-t-none bg-page invisible group-hover:visible"
          >
            <ul class="list-reset ">
              <li>
                <a
                  href="https://drops.warframestat.us"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-download faIconStyle"></i> Drops</a
                >
              </li>
              <li>
                <a
                  href="https://genesis.warframestat.us"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-robot faIconStyle"></i> Genesis</a
                >
              </li>
              <li>
                <a
                  href="https://docs.warframestat.us"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-terminal faIconStyle"></i> API Docs</a
                >
              </li>
              <li>
                <a
                  href="https://warframestat.us"
                  class="px-2 py-2 block text-default  hover:text-hover"
                  exact
                  ><i class="fas fa-tachometer-alt faIconStyle"></i>Status</a
                >
              </li>
            </ul>
          </div>
        </div>
        <router-link
          to="/riven/data"
          exact
          class=" block mt-4 sm:inline-block sm:mt-0 text-default hover:text-hover mr-4"
          >Riven Data (Alpha)</router-link
        >
        <router-link
          to="/riven/data"
          exact
          class=" block mt-4 sm:inline-block sm:mt-0 text-default hover:text-hover mr-4"
          ><i class="fas fa-cog faIconStyle"></i>Settings</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
import DropdownItem from '@/components/DropdownNavItem.vue';

export default {
  name: 'Navbar',
  components: {
    DropdownItem
  },
  methods: {
    toggle() {
      this.open = !this.open;
    }
  },
  data() {
    return {
      open: false,
      navItemParent: {
        display: 'flex',
        'justify-content': 'space-between',
        padding: '10px 0',
        'text-align': 'center'
      }
    };
  }
};
</script>
