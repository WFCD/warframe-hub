import { makeid } from '@/services/utilities';

export default {
  name: 'SpoilerComponent',
  props: {
    headertext: {
      type: String,
      default: () => '',
    },
    init: {
      type: Boolean,
      default: () => false,
    },
    toggle: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  },
  data() {
    return {
      id: makeid(),
    };
  },
  computed: {
    initialArrow() {
      if (this.init) {
        return 'fas fa-chevron-up';
      }
      return 'fas fa-chevron-down';
    },
  },
  methods: {
    toggled() {
      this.$emit('toggle');
    },
    upArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-up';
    },
    downArrow() {
      this.$refs.arrow.className = 'fas fa-chevron-down';
    },
  },
  render() {
    return (
      <div>
        <b-collapse
          id={`spoiler-${this.id}`}
          visible={this.init}
          onHidden={() => {
            this.toggled();
            this.downArrow();
          }}
          onShown={() => {
            this.toggled();
            this.upArrow();
          }}
        >
          {this.$slots.default}
        </b-collapse>
        <b-btn v-b-toggle={`spoiler-${this.id}`} variant="primary" class="mb-1 py-0">
          {this.headertext} <i ref="arrow" class={this.initialArrow}></i>
        </b-btn>
      </div>
    );
  },
};
