<template>
  <div>
    <div class="max-w-sm rounded overflow-hidden">
      <img
        class="w-full"
        src="https://tailwindcss.com/img/card-top.jpg"
        alt="Sunset in the mountains"
      />
      <div class="relative px-4 -mt-16">
        <fa-layers
          @click="switchreroll()"
          class="fa-2x absolute right-0 -mt-4 mr-10"
          fixed-width
        >
          <fa
            icon="redo"
            size="xs"
            :style="{
              color: 'black'
            }"
          />
          <fa
            v-if="!rerolled"
            icon="ban"
            flip="horizontal"
            size="md"
            :style="{
              color: 'red'
            }"
          />
        </fa-layers>
        <div class="bg-white rounded-lg px-4 py-4 shadow-lg">
          <div class="font-bold text-xl mb-2">{{ test }}</div>
          <div class="flex w-full flex-wrap">
            <div class="w-1/2 text-gray-700 text-base">
              max: {{ property[rerolled].max }}<br />
              median: {{ property[rerolled].median }}<br />
              min: {{ property[rerolled].min }}<br />
            </div>
            <div class="w-1/2 text-gray-700 text-base">
              avg: {{ property[rerolled].avg }}<br />
              pop: {{ property[rerolled].pop }}<br />
              stddev: {{ property[rerolled].stddev }}<br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['property', 'test'],
  data() {
    return {
      rerolled: 0
    }
  },
  methods: {
    checkreroll() {
      const x = 1 - this.rerolled
      if (this.$props.property[x]) {
        return true
      }
      return false
    },
    switchreroll() {
      // eslint-disable-next-line
      console.log('click1')
      const x = 1 - this.rerolled
      if (this.$props.property[x]) {
        this.rerolled = x
      }
      // eslint-disable-next-line
      console.log(this.rerolled)

      // eslint-disable-next-line
      console.log(x)
    }
  },
  computed: {
    formattedPrice() {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })

      return formatter.format(this.property.price / 100)
    }
  }
}
</script>
