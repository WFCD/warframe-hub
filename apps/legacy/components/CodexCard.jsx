import { cdn, wfcdn, optimize } from '@/services/utilities';

export default {
  name: 'CodexCard',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: 'Ancient Retribution',
          imageName: 'ancient-retribution.png',
        };
      },
    },
    description: {
      type: String,
      default: () => 'Link',
    },
    link: {
      type: String,
      default: () => 'https://hub.warframestat.us/',
    },
    link2: {
      type: Object,
      default: () => {
        return undefined;
      },
    },
  },
  methods: {
    cdn,
    wfcdn,
    optimize,
  },
  render() {
    return (
      <b-card no-body header={this.item.name}>
        <b-card-img src={wfcdn(this.item.imageName)} alt={this.item.name} top />
        <b-card-body>
          <b-card-text>
            <slot name="t1">{this.description || this.item.description || ''}</slot>
          </b-card-text>
          <b-card-text>
            <slot name="t2"></slot>
          </b-card-text>
          {this.link ? (
            <b-button href={this.link} target="_blank" variant="primary">
              Wiki <i className="fas fa-link" />
            </b-button>
          ) : (
            <span />
            // <b-button onClick={modal.open()}>
            //   Wiki <i className="fas fa-link" />
            // </b-button>
          )}
          {!!this.link2 && (
            <b-button href={this.link2.a} target="_blank" variant="primary">
              {this.link2.title} <i className="fas fa-link" />
            </b-button>
          )}
        </b-card-body>
      </b-card>
    );
  },
};
