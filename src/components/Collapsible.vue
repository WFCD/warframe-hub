<template>
  <div>
    <b-btn variant="primary" v-b-toggle="`collapsible-${this.cid}`">
      {{headertext}} <i class="fas fa-chevron-down"></i>
    </b-btn>
    <b-collapse :id="`collapsible-${this.cid}`" @hidden="reflow()" @shown="reflow()">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
  import {packeryEvents} from 'vue-packery-plugin';

  export default {
    name: 'Collapsible',
    props: ['headertext'],
    data: function() {
      return {
        id: 0
      };
    },
    methods: {
      reflow: function() {
        // eslint-disable-next-line no-console
        console.log('triggered reflow');
        packeryEvents.$emit('layout', this.$refs.timerComponentGrid);
      },
      makeid: function() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
      }
    },
    computed: {
      cid: function() {
        if (this.id) {
          return id;
        }
        this.id = this.makeid();
        return this.id;
      }
    }
  };
</script>
