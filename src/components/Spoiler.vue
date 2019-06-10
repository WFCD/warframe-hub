<template>
  <div>
    <b-collapse :id="`spoiler-${this.cid}`" @hidden="reflow();downArrow();" @shown="reflow();upArrow();">
      <slot></slot>
    </b-collapse>
    <b-btn variant="primary" v-b-toggle="`spoiler-${this.cid}`" style="margin: 3px 0px;">
      {{headertext}} <i class="fas fa-chevron-down" ref="arrow"></i>
    </b-btn>
  </div>
</template>
<script>
  import util from '@/utilities';

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
        console.error('triggered reflow --- this does nothing, needs to trigger the resize for the grid item');
      },
      makeid: function() {
        return util.makeid();
      },
      upArrow: function() {
        this.$refs.arrow.className='fas fa-chevron-up';
      },
      downArrow: function() {
        this.$refs.arrow.className='fas fa-chevron-down';
      }
    },
    computed: {
      cid: function() {
        if (this.id) {
          return this.id;
        } else {
          this.id = this.makeid(); // eslint-disable-line vue/no-side-effects-in-computed-properties
        }
        return this.id;
      }
    }
  };
</script>