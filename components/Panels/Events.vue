<template>
  <div class="w-1/3 xl:max-w-lg h-auto overflow-hidden border-transparent">
    <div class="text-primary text-center text-4xl mt-1">
      Events
    </div>
    <div class="bg-box text-primary pt-0 border-box border-b-2 rounded ">
      <div v-if="!events" class="text-primary ">
        <div
          class="bg-transparent border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong class="font-bold">No Events active at the moment</strong>
        </div>
      </div>
      <div v-else>
        <div v-for="event in events" :key="event.id">
          <div v-if="event.description === 'Thermia Fractures'">
            <ThermiaEvent :eventdata="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.popper {
  @apply bg-black !important;
  @apply text-white;
  @apply border-0;
  @apply text-xs;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  width: auto;
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-weight: normal;
  z-index: 200000;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
}
.popper .popper__arrow {
  color: black !important;
}
.popper[x-placement^='top'] .popper__arrow {
  border-color: black transparent transparent transparent !important;
}
</style>

<script>
import ThermiaEvent from '~/components/Panels/PanelParts/ThermiaEvent.vue'

export default {
  name: 'EventsPanel',
  // eslint-disable-next-line
  components: {
    ThermiaEvent
  },
  props: ['events'],
  data() {
    return {
      platinum: 'platinum',
      test: false
    }
  }
}
</script>
