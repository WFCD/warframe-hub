<template>
  <HubImg :src="src" :name="name" :title="name" :height="height" :width="width" fluid :alt="name" />
</template>

<!--  -->
<script>
import HubImg from '@/components/HubImg';
import { optimize, cdn } from '@/utilities';

const imgs = {
  'Ancient Disruptor': optimize(cdn('webp/synthesis/ancient_disruptor.webp')),
  'Ancient Healer': optimize(cdn('webp/synthesis/ancient_healer.webp')),
  'Anti MOA [Research]': optimize(cdn('webp/synthesis/anti_moa.webp')),
  'Arid Eviscerator [Research]': optimize(cdn('webp/synthesis/arid_eviscerator.webp')),
  Ballista: optimize(cdn('webp/synthesis/ballista.webp')),
  Boiler: optimize(cdn('webp/synthesis/boiler.webp')),
  Bombard: optimize(cdn('webp/synthesis/bombard.webp')),
  'Brood Mother': optimize(cdn('webp/synthesis/brood_mother.webp')),
  Butcher: optimize(cdn('webp/synthesis/butcher.webp')),
  Charger: optimize(cdn('webp/synthesis/charger.webp')),
  Commander: optimize(cdn('webp/synthesis/commander.webp')),
  'Corrupted Ancient [Research]': optimize(cdn('webp/synthesis/corrupted_ancient.webp')),
  'Corrupted Bombard': optimize(cdn('webp/synthesis/corrupted_bombard.webp')),
  'Corrupted Butcher': optimize(cdn('webp/synthesis/corrupted_butcher.webp')),
  'Corrupted Crewman': optimize(cdn('webp/synthesis/corrupted_crewman.webp')),
  'Corrupted Heavy Gunner': optimize(cdn('webp/synthesis/corrupted_heavy_gunner.webp')),
  'Corrupted Lancer': optimize(cdn('webp/synthesis/corrupted_lancer.webp')),
  'Corrupted Nullifier': optimize(cdn('webp/synthesis/corrupted_nullifier.webp')),
  Crawler: optimize(cdn('webp/synthesis/crawler.webp')),
  'Crewman [Research]': optimize(cdn('webp/synthesis/crewman.webp')),
  'Drahk Master': optimize(cdn('webp/synthesis/drahk_master.webp')),
  'Elite Crewman': optimize(cdn('webp/synthesis/elite_crewman.webp')),
  Eviscerator: optimize(cdn('webp/synthesis/eviscerator.webp')),
  'Fusion MOA': optimize(cdn('webp/synthesis/fusion_moa.webp')),
  'Guardsman [Research]': optimize(cdn('webp/synthesis/guardsman.webp')),
  'Heavy Gunner': optimize(cdn('webp/synthesis/heavy_gunner.webp')),
  Hellion: optimize(cdn('webp/synthesis/hellion.webp')),
  'Lancer [Research]': optimize(cdn('webp/synthesis/lancer.webp')),
  Leaper: optimize(cdn('webp/synthesis/leaper.webp')),
  MOA: optimize(cdn('webp/synthesis/moa.webp')),
  Napalm: optimize(cdn('webp/synthesis/napalm.webp')),
  'Nullifier Crewman': optimize(cdn('webp/synthesis/nullifier_crewman.webp')),
  'Runner [Research]': optimize(cdn('webp/synthesis/runner.webp')),
  Scorch: optimize(cdn('webp/synthesis/scorch.webp')),
  Scorpion: optimize(cdn('webp/synthesis/scorpion.webp')),
  'Seeker / Frontier Seeker': optimize(cdn('webp/synthesis/seeker.webp')),
  'Shield Lancer': optimize(cdn('webp/synthesis/shield_lancer.webp')),
  'Swarm-Mutalist MOA': optimize(cdn('webp/synthesis/swarm-mutalist_moa.webp')),
  Trooper: optimize(cdn('webp/synthesis/trooper.webp')),
};

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
      target: this.name,
      src: imgs[this.name],
    };
  },
};
</script>
