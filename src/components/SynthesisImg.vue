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
        'Ancient Disruptor': import('@/assets/img/synthesis/ancient_disruptor.png'),
        'Ancient Healer': import('@/assets/img/synthesis/ancient_healer.png'),
        'Anti MOA [Research]': import('@/assets/img/synthesis/anti_moa.png'),
        'Arid Eviscerator [Research]': import('@/assets/img/synthesis/arid_eviscerator.png'),
        Ballista: import('@/assets/img/synthesis/ballista.png'),
        Boiler: import('@/assets/img/synthesis/boiler.png'),
        Bombard: import('@/assets/img/synthesis/bombard.png'),
        'Brood Mother': import('@/assets/img/synthesis/brood_mother.png'),
        Butcher: import('@/assets/img/synthesis/butcher.png'),
        Charger: import('@/assets/img/synthesis/charger.png'),
        Commander: import('@/assets/img/synthesis/commander.png'),
        'Corrupted Ancient [Research]': import('@/assets/img/synthesis/corrupted_ancient.png'),
        'Corrupted Bombard': import('@/assets/img/synthesis/corrupted_bombard.png'),
        'Corrupted Butcher': import('@/assets/img/synthesis/corrupted_butcher.png'),
        'Corrupted Crewman': import('@/assets/img/synthesis/corrupted_crewman.png'),
        'Corrupted Heavy Gunner': import('@/assets/img/synthesis/corrupted_heavy_gunner.png'),
        'Corrupted Lancer': import('@/assets/img/synthesis/corrupted_lancer.png'),
        'Corrupted Nullifier': import('@/assets/img/synthesis/corrupted_nullifier.png'),
        Crawler: import('@/assets/img/synthesis/crawler.png'),
        'Crewman [Research]': import('@/assets/img/synthesis/crewman.png'),
        'Drahk Master': import('@/assets/img/synthesis/drahk_master.png'),
        'Elite Crewman': import('@/assets/img/synthesis/elite_crewman.png'),
        Eviscerator: import('@/assets/img/synthesis/eviscerator.png'),
        'Fusion MOA': import('@/assets/img/synthesis/fusion_moa.png'),
        'Guardsman [Research]': import('@/assets/img/synthesis/guardsman.png'),
        'Heavy Gunner': import('@/assets/img/synthesis/heavy_gunner.png'),
        Hellion: import('@/assets/img/synthesis/hellion.png'),
        'Lancer [Research]': import('@/assets/img/synthesis/lancer.png'),
        Leaper: import('@/assets/img/synthesis/leaper.png'),
        MOA: import('@/assets/img/synthesis/moa.png'),
        Napalm: import('@/assets/img/synthesis/napalm.png'),
        'Nullifier Crewman': import('@/assets/img/synthesis/nullifier_crewman.png'),
        'Runner [Research]': import('@/assets/img/synthesis/runner.png'),
        Scorch: import('@/assets/img/synthesis/scorch.png'),
        Scorpion: import('@/assets/img/synthesis/scorpion.png'),
        'Seeker / Frontier Seeker': import('@/assets/img/synthesis/seeker.png'),
        'Shield Lancer': import('@/assets/img/synthesis/shield_lancer.png'),
        'Swarm-Mutalist MOA': import('@/assets/img/synthesis/swarm-mutalist_moa.png'),
        Trooper: import('@/assets/img/synthesis/trooper.png'),
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
