<template>
  <HubImg
    :src="src"
    :name="title"
    :title="title"
    :height="height"
    :width="width"
    :class="{ invert: invert === 'true' }"
    fluid
    :alt="title"
  />
</template>

<script>
import HubImg from '@/components/HubImg';
import { optimize, cdn } from '@/services/utilities';

const imgs = {
  fish: {
    charceel: optimize(cdn('webp/fish/charceel.webp')),
    cuthol: optimize(cdn('webp/fish/cuthol.webp')),
    glappid: optimize(cdn('webp/fish/glappid.webp')),
    goopolla: optimize(cdn('webp/fish/goopolla.webp')),
    karkina: optimize(cdn('webp/fish/karkina.webp')),
    khutkhut: optimize(cdn('webp/fish/khutkhut.webp')),
    mawfish: optimize(cdn('webp/fish/mawfish.webp')),
    mortus: optimize(cdn('webp/fish/mortus.webp')),
    murkray: optimize(cdn('webp/fish/murkray.webp')),
    norg: optimize(cdn('webp/fish/norg.webp')),
    sharrac: optimize(cdn('webp/fish/sharrac.webp')),
    tralok: optimize(cdn('webp/fish/tralok.webp')),
    yogwun: optimize(cdn('webp/fish/yogwun.webp')),
    eyeeye: optimize(cdn('webp/fish/eyeeye.webp')),
    scrubber: optimize(cdn('webp/fish/scrubber.webp')),
    echowinder: optimize(cdn('webp/fish/echowinder.webp')),
    mirewinder: optimize(cdn('webp/fish/mirewinder.webp')),
    longwinder: optimize(cdn('webp/fish/longwinder.webp')),
    brickie: optimize(cdn('webp/fish/brickie.webp')),
    tink: optimize(cdn('webp/fish/tink.webp')),
    sapcaddy: optimize(cdn('webp/fish/sapcaddy.webp')),
    kriller: optimize(cdn('webp/fish/kriller.webp')),
    recaster: optimize(cdn('webp/fish/recaster.webp')),
    tromyzon: optimize(cdn('webp/fish/tromyzon.webp')),
    charamote: optimize(cdn('webp/fish/charamote.webp')),
    synathid: optimize(cdn('webp/fish/synathid.webp')),
    boot: optimize(cdn('webp/fish/boot.webp')),
    crewmensboot: optimize(cdn('webp/fish/crewmensboot.webp')),
    amniophysi: optimize(cdn('webp/fish/amniophysi.webp')),
    aquapulmo: optimize(cdn('webp/fish/aquapulmo.webp')),
    barbisteo: optimize(cdn('webp/fish/barbisteo.webp')),
    chondricord: optimize(cdn('webp/fish/chondricord.webp')),
    cryptosuctus: optimize(cdn('webp/fish/cryptosuctus.webp')),
    duroid: optimize(cdn('webp/fish/duroid.webp')),
    glutinox: optimize(cdn('webp/fish/glutinox.webp')),
    kymaeros: optimize(cdn('webp/fish/kymaeros.webp')),
    myxostomata: optimize(cdn('webp/fish/myxostomata.webp')),
    ostimyr: optimize(cdn('webp/fish/ostimyr.webp')),
    vitreospina: optimize(cdn('webp/fish/vitreospina.webp')),
    flagellocanth: optimize(cdn('webp/fish/flagellocanth.webp')),
    lobotriscid: optimize(cdn('webp/fish/lobotriscid.webp')),
  },
  parts: {
    antenna: optimize(cdn('webp/fish/part/antenna.webp')),
    bones: optimize(cdn('webp/fish/part/bones.webp')),
    brain: optimize(cdn('webp/fish/part/brain.webp')),
    electroplax: optimize(cdn('webp/fish/part/electroplax.webp')),
    eyes: optimize(cdn('webp/fish/part/eyes.webp')),
    horn: optimize(cdn('webp/fish/part/horn.webp')),
    liver: optimize(cdn('webp/fish/part/liver.webp')),
    sac: optimize(cdn('webp/fish/part/sac.webp')),
    shell: optimize(cdn('webp/fish/part/shell.webp')),
    spleen: optimize(cdn('webp/fish/part/spleen.webp')),
    stomach: optimize(cdn('webp/fish/part/stomach.webp')),
    teeth: optimize(cdn('webp/fish/part/teeth.webp')),
    tendrils: optimize(cdn('webp/fish/part/tendrils.webp')),
    rotoblade: optimize(cdn('webp/fish/part/rotoblade.webp')),
    exabrain: optimize(cdn('webp/fish/part/exabrain.webp')),
    anoscopicsensor: optimize(cdn('webp/fish/part/anoscopicsensor.webp')),
    parallelbiode: optimize(cdn('webp/fish/part/parallelbiode.webp')),
    lathecoagulant: optimize(cdn('webp/fish/part/lathecoagulant.webp')),
    muonbattery: optimize(cdn('webp/fish/part/muonbattery.webp')),
    dissipatorcoil: optimize(cdn('webp/fish/part/dissipatorcoil.webp')),
    venedocase: optimize(cdn('webp/fish/part/venedocase.webp')),
    thermallaser: optimize(cdn('webp/fish/part/thermallaser.webp')),
    neuralrelay: optimize(cdn('webp/fish/part/neuralrelay.webp')),
    entroplasma: optimize(cdn('webp/fish/part/entroplasma.webp')),
    saganmodule: optimize(cdn('webp/fish/part/saganmodule.webp')),
    ecosynthanalyzer: optimize(cdn('webp/fish/part/ecosynthanalyzer.webp')),
    crewmensboot: optimize(cdn('webp/fish/crewmensboot.webp')),
    dendrite: optimize(cdn('webp/fish/part/dendrite.webp')),
    spinal: optimize(cdn('webp/fish/part/spinal.webp')),
    muscle: optimize(cdn('webp/fish/part/muscle.webp')),
    pustulent: optimize(cdn('webp/fish/part/pustulent.webp')),
    sebum: optimize(cdn('webp/fish/part/sebum.webp')),
    foremount: optimize(cdn('webp/fish/part/foremount.webp')),
    filter: optimize(cdn('webp/fish/part/filter.webp')),
    sporulate: optimize(cdn('webp/fish/part/sporulate.webp')),
    stemroot: optimize(cdn('webp/fish/part/stemroot.webp')),
    tethermaw: optimize(cdn('webp/fish/part/tethermaw.webp')),
  },
  common: {
    standing: optimize(cdn('svg/standing.svg')),
    meat: optimize(cdn('webp/fish/common/fishmeat.webp')),
    scale: optimize(cdn('webp/fish/common/fishscale.webp')),
    oil: optimize(cdn('webp/fish/common/fishoil.webp')),
    scrap: optimize(cdn('webp/fish/common/scrap.webp')),
    common: optimize(cdn('webp/fish/common/common.webp')),
    uncommon: optimize(cdn('webp/fish/common/uncommon.webp')),
    rare: optimize(cdn('webp/fish/common/rare.webp')),
    legendary: optimize(cdn('webp/fish/common/legendary.webp')),
    peculiar: optimize(cdn('webp/fish/common/peculiar.webp')),
    lanzosm: optimize(cdn('webp/fish/common/lanzo-icon.webp')),
    tuloksm: optimize(cdn('webp/fish/common/tulok-icon.webp')),
    peramsm: optimize(cdn('webp/fish/common/peram-icon.webp')),
    spari: optimize(cdn('webp/fish/common/spari.webp')),
    ebisu: optimize(cdn('webp/fish/common/ebisu.webp')),
    gills: optimize(cdn('webp/fish/common/gills.webp')),
    tumor: optimize(cdn('webp/fish/common/tumor.webp')),
    bladder: optimize(cdn('webp/fish/common/bladder.webp')),
  },
  bait: {
    cuthol: optimize(cdn('webp/fish/bait/cuthol-bait.webp')),
    glappid: optimize(cdn('webp/fish/bait/glappid-bait.webp')),
    murkray: optimize(cdn('webp/fish/bait/murkray-bait.webp')),
    norg: optimize(cdn('webp/fish/bait/norg-bait.webp')),
    peppered: optimize(cdn('webp/fish/bait/peppered-bait.webp')),
    twilight: optimize(cdn('webp/fish/bait/twilight-bait.webp')),
    narrowspectrum: optimize(cdn('webp/fish/bait/narrowspectrum-bait.webp')),
    broadspectrum: optimize(cdn('webp/fish/bait/broadspectrum-bait.webp')),
    mirewinder: optimize(cdn('webp/fish/bait/mirewinder-bait.webp')),
    longwinder: optimize(cdn('webp/fish/bait/longwinder-bait.webp')),
    kriller: optimize(cdn('webp/fish/bait/kriller-bait.webp')),
    tromyzon: optimize(cdn('webp/fish/bait/tromyzon-bait.webp')),
    charamote: optimize(cdn('webp/fish/bait/charamote-bait.webp')),
    synathid: optimize(cdn('webp/fish/bait/synathid-bait.webp')),
    vome: optimize(cdn('webp/fish/bait/vome.webp')),
    fass: optimize(cdn('webp/fish/bait/fass.webp')),
    processedvome: optimize(cdn('webp/fish/bait/processed-vome.webp')),
    processedfass: optimize(cdn('webp/fish/bait/processed-fass.webp')),
  },
  guide: {
    guide1: optimize(cdn('webp/fish/guide/guide1.webp')),
    guide2: optimize(cdn('webp/fish/guide/guide2.webp')),
    guide3: optimize(cdn('webp/fish/guide/guide3.webp')),
    guide5: optimize(cdn('webp/fish/guide/guide5.webp')),
    clem: optimize(cdn('webp/fish/guide/clem.webp')),
    vallisguide1: optimize(cdn('webp/fish/guide/vallisguide1.webp')),
    vallisguide2: optimize(cdn('webp/fish/guide/vallisguide2.webp')),
    vallisguide3: optimize(cdn('webp/fish/guide/vallisguide3.webp')),
    vallisguide4: optimize(cdn('webp/fish/guide/vallisguide4.webp')),
  },
  time: {
    vome: optimize(cdn('webp/fish/times/vome.webp')),
    fass: optimize(cdn('webp/fish/times/fass.webp')),
  },
};

export default {
  name: 'FishImg',
  components: {
    HubImg,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Name',
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: 'auto',
    },
    invert: {
      type: String,
      default: 'false',
    },
  },
  data() {
    return {
      src: imgs[this.type][this.item],
    };
  },
};
</script>
