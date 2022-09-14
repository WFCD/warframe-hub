import { makeid } from '@/services/utilities';

export default {
  name: 'CollapsiblePanel',
  props: {
    headertext: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      id: 0,
    };
  },
  computed: {
    cid() {
      if (this.id) {
        return this.id;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.id = makeid();
      }
      return this.id;
    },
  },
  methods: {
    reflow() {
      // eslint-disable-next-line no-console
      console.error('triggered reflow --- this does nothing, needs to trigger the resize for the grid item');
    },
  },
  render() {
    return (
      <div>
        <b-btn v-b-toggle={`collapsible-${this.cid}`} variant="primary" style="margin-bottom: 4px">
          {this.headertext} <i class="fas fa-chevron-down"></i>
        </b-btn>
        <b-collapse id={`collapsible-${this.cid}`} hidden={this.reflow} shown={this.reflow}>
          <b-card>
            <slot></slot>
          </b-card>
        </b-collapse>
      </div>
    );
  },
};
