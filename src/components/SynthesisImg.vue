<template>
  <HubImg :src="src" :name="name" :title="name" :height="height" :width="width" fluid :alt="name" />
</template>

<!--  -->
<script>
import HubImg from '@/components/HubImg';

export default {
  name: 'SynthesisImg',
  props: {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: '100px',
    },
  },
  components: {
    HubImg,
  },
  data() {
    return {
      imgs: {
        'Ancient Disruptor': import('@/assets/img/synthesis/ancient_disruptor.webp'),
        'Ancient Healer': import('@/assets/img/synthesis/ancient_healer.webp'),
        'Anti MOA [Research]': import('@/assets/img/synthesis/anti_moa.webp'),
        'Arid Eviscerator [Research]': import('@/assets/img/synthesis/arid_eviscerator.webp'),
        Ballista: import('@/assets/img/synthesis/ballista.webp'),
        Boiler: import('@/assets/img/synthesis/boiler.webp'),
        Bombard: import('@/assets/img/synthesis/bombard.webp'),
        'Brood Mother': import('@/assets/img/synthesis/brood_mother.webp'),
        Butcher: import('@/assets/img/synthesis/butcher.webp'),
        Charger: import('@/assets/img/synthesis/charger.webp'),
        Commander: import('@/assets/img/synthesis/commander.webp'),
        'Corrupted Ancient [Research]': import('@/assets/img/synthesis/corrupted_ancient.webp'),
        'Corrupted Bombard': import('@/assets/img/synthesis/corrupted_bombard.webp'),
        'Corrupted Butcher': import('@/assets/img/synthesis/corrupted_butcher.webp'),
        'Corrupted Crewman': import('@/assets/img/synthesis/corrupted_crewman.webp'),
        'Corrupted Heavy Gunner': import('@/assets/img/synthesis/corrupted_heavy_gunner.webp'),
        'Corrupted Lancer': import('@/assets/img/synthesis/corrupted_lancer.webp'),
        'Corrupted Nullifier': import('@/assets/img/synthesis/corrupted_nullifier.webp'),
        Crawler: import('@/assets/img/synthesis/crawler.webp'),
        'Crewman [Research]': import('@/assets/img/synthesis/crewman.webp'),
        'Drahk Master': import('@/assets/img/synthesis/drahk_master.webp'),
        'Elite Crewman': import('@/assets/img/synthesis/elite_crewman.webp'),
        Eviscerator: import('@/assets/img/synthesis/eviscerator.webp'),
        'Fusion MOA': import('@/assets/img/synthesis/fusion_moa.webp'),
        'Guardsman [Research]': import('@/assets/img/synthesis/guardsman.webp'),
        'Heavy Gunner': import('@/assets/img/synthesis/heavy_gunner.webp'),
        Hellion: import('@/assets/img/synthesis/hellion.webp'),
        'Lancer [Research]': import('@/assets/img/synthesis/lancer.webp'),
        Leaper: import('@/assets/img/synthesis/leaper.webp'),
        MOA: import('@/assets/img/synthesis/moa.webp'),
        Napalm: import('@/assets/img/synthesis/napalm.webp'),
        'Nullifier Crewman': import('@/assets/img/synthesis/nullifier_crewman.webp'),
        'Runner [Research]': import('@/assets/img/synthesis/runner.webp'),
        Scorch: import('@/assets/img/synthesis/scorch.webp'),
        Scorpion: import('@/assets/img/synthesis/scorpion.webp'),
        'Seeker / Frontier Seeker': import('@/assets/img/synthesis/seeker.webp'),
        'Shield Lancer': import('@/assets/img/synthesis/shield_lancer.webp'),
        'Swarm-Mutalist MOA': import('@/assets/img/synthesis/swarm-mutalist_moa.webp'),
        Trooper: import('@/assets/img/synthesis/trooper.webp'),
      },
      target: this.name,
      src: '',
    };
  },
  mounted: function() {
    this.getImg();
  },
  methods: {
    getImg: function() {
      this.imgs[this.name].then((img) => {
        this.src = img.default;
      });
    },
  },
};
</script>
