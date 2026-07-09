import fetch from 'node-fetch';
import { makeid, wfcdn, optimize } from '@/services/utilities';

const asyncThumb = {
  pointerEvents: 'inherit',
};

export default {
  name: 'ItemThumb',
  props: {
    alt: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 20,
    },
    ikey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: makeid(),
      img: null,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const stripped = (this.ikey || this.alt)
        .replace(/\d+\s+/i, '')
        .replace('Blueprint', '')
        .replace('Receiver', '')
        .replace('Hilt', '')
        .replace('Blade', '')
        .replace('Stock', '')
        .trim();
      const url = `https://api.warframestat.us/items/search/${stripped.toLowerCase()}`;
      const data = (await fetch(url).then((d) => d.json())).filter((d) => d.name === stripped);
      if (!data || !data[0]?.imageName || '') {
        // empty on purpose?
      } else {
        this.img = optimize(wfcdn(data[0].imageName), this.width * 8);
      }
    },
  },
  render() {
    return (
      <span>
        {this.img ? (
          <div>
            <img id={this.id} src={this.img} alt={this.alt} style={asyncThumb} width={`${this.width}px`} />
            <b-tooltip target={this.id} triggers="hover" placement="bottom">
              <img id={this.id} src={this.img} alt={this.alt} className="async-thumb" width={`${this.width * 5}px`} />
              <div>{this.alt}</div>
            </b-tooltip>
          </div>
        ) : (
          <div>{this.alt}</div>
        )}
      </span>
    );
  },
};
