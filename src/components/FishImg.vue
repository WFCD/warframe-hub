<template>
  <HubImg
    :src="src"
    :name="title"
    :title="title"
    :height="height"
    :width="width"
    v-bind:class="{ invert: invert === 'true' }"
    fluid
    :alt="title"
  />
</template>

<script>
import HubImg from '@/components/HubImg';

export default {
  name: 'FishImg',
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
  components: {
    HubImg,
  },
  data() {
    return {
      imgs: {
        fish: {
          charceel: import('@/assets/img/fish/charceel.webp'),
          cuthol: import('@/assets/img/fish/cuthol.webp'),
          glappid: import('@/assets/img/fish/glappid.webp'),
          goopolla: import('@/assets/img/fish/goopolla.webp'),
          karkina: import('@/assets/img/fish/karkina.webp'),
          khutkhut: import('@/assets/img/fish/khutkhut.webp'),
          mawfish: import('@/assets/img/fish/mawfish.webp'),
          mortus: import('@/assets/img/fish/mortus.webp'),
          murkray: import('@/assets/img/fish/murkray.webp'),
          norg: import('@/assets/img/fish/norg.webp'),
          sharrac: import('@/assets/img/fish/sharrac.webp'),
          tralok: import('@/assets/img/fish/tralok.webp'),
          yogwun: import('@/assets/img/fish/yogwun.webp'),
          eyeeye: import('@/assets/img/fish/eyeeye.webp'),
          scrubber: import('@/assets/img/fish/scrubber.webp'),
          echowinder: import('@/assets/img/fish/echowinder.webp'),
          mirewinder: import('@/assets/img/fish/mirewinder.webp'),
          longwinder: import('@/assets/img/fish/longwinder.webp'),
          brickie: import('@/assets/img/fish/brickie.webp'),
          tink: import('@/assets/img/fish/tink.webp'),
          sapcaddy: import('@/assets/img/fish/sapcaddy.webp'),
          kriller: import('@/assets/img/fish/kriller.webp'),
          recaster: import('@/assets/img/fish/recaster.webp'),
          tromyzon: import('@/assets/img/fish/tromyzon.webp'),
          charamote: import('@/assets/img/fish/charamote.webp'),
          synathid: import('@/assets/img/fish/synathid.webp'),
          boot: import('@/assets/img/fish/boot.webp'),
          crewmensboot: import('@/assets/img/fish/crewmensboot.webp'),
          amniophysi: import('@/assets/img/fish/amniophysi.webp'),
          aquapulmo: import('@/assets/img/fish/aquapulmo.webp'),
          barbisteo: import('@/assets/img/fish/barbisteo.webp'),
          chondricord: import('@/assets/img/fish/chondricord.webp'),
          cryptosuctus: import('@/assets/img/fish/cryptosuctus.webp'),
          duroid: import('@/assets/img/fish/duroid.webp'),
          glutinox: import('@/assets/img/fish/glutinox.webp'),
          kymaeros: import('@/assets/img/fish/kymaeros.webp'),
          myxostomata: import('@/assets/img/fish/myxostomata.webp'),
          ostimyr: import('@/assets/img/fish/ostimyr.webp'),
          vitreospina: import('@/assets/img/fish/vitreospina.webp'),
        },
        parts: {
          antenna: import('@/assets/img/fish/part/antenna.webp'),
          bones: import('@/assets/img/fish/part/bones.webp'),
          brain: import('@/assets/img/fish/part/brain.webp'),
          electroplax: import('@/assets/img/fish/part/electroplax.webp'),
          eyes: import('@/assets/img/fish/part/eyes.webp'),
          horn: import('@/assets/img/fish/part/horn.webp'),
          liver: import('@/assets/img/fish/part/liver.webp'),
          sac: import('@/assets/img/fish/part/sac.webp'),
          shell: import('@/assets/img/fish/part/shell.webp'),
          spleen: import('@/assets/img/fish/part/spleen.webp'),
          stomach: import('@/assets/img/fish/part/stomach.webp'),
          teeth: import('@/assets/img/fish/part/teeth.webp'),
          tendrils: import('@/assets/img/fish/part/tendrils.webp'),
          rotoblade: import('@/assets/img/fish/part/rotoblade.webp'),
          exabrain: import('@/assets/img/fish/part/exabrain.webp'),
          anoscopicsensor: import('@/assets/img/fish/part/anoscopicsensor.webp'),
          parallelbiode: import('@/assets/img/fish/part/parallelbiode.webp'),
          lathecoagulant: import('@/assets/img/fish/part/lathecoagulant.webp'),
          muonbattery: import('@/assets/img/fish/part/muonbattery.webp'),
          dissipatorcoil: import('@/assets/img/fish/part/dissipatorcoil.webp'),
          venedocase: import('@/assets/img/fish/part/venedocase.webp'),
          thermallaser: import('@/assets/img/fish/part/thermallaser.webp'),
          neuralrelay: import('@/assets/img/fish/part/neuralrelay.webp'),
          entroplasma: import('@/assets/img/fish/part/entroplasma.webp'),
          saganmodule: import('@/assets/img/fish/part/saganmodule.webp'),
          ecosynthanalyzer: import('@/assets/img/fish/part/ecosynthanalyzer.webp'),
          crewmensboot: import('@/assets/img/fish/crewmensboot.webp'),
          dendrite: import('@/assets/img/fish/part/dendrite.webp'),
          spinal: import('@/assets/img/fish/part/spinal.webp'),
          muscle: import('@/assets/img/fish/part/muscle.webp'),
          pustulent: import('@/assets/img/fish/part/pustulent.webp'),
          sebum: import('@/assets/img/fish/part/sebum.webp'),
          foremount: import('@/assets/img/fish/part/foremount.webp'),
          filter: import('@/assets/img/fish/part/filter.webp'),
          sporulate: import('@/assets/img/fish/part/sporulate.webp'),
        },
        common: {
          standing: import('@/assets/img/general/standing.svg'),
          meat: import('@/assets/img/fish/common/fishmeat.webp'),
          scale: import('@/assets/img/fish/common/fishscale.webp'),
          oil: import('@/assets/img/fish/common/fishoil.webp'),
          scrap: import('@/assets/img/fish/common/scrap.webp'),
          common: import('@/assets/img/fish/common/common.webp'),
          uncommon: import('@/assets/img/fish/common/uncommon.webp'),
          rare: import('@/assets/img/fish/common/rare.webp'),
          legendary: import('@/assets/img/fish/common/legendary.webp'),
          peculiar: import('@/assets/img/fish/common/peculiar.webp'),
          lanzosm: import('@/assets/img/fish/common/lanzo-icon.webp'),
          tuloksm: import('@/assets/img/fish/common/tulok-icon.webp'),
          peramsm: import('@/assets/img/fish/common/peram-icon.webp'),
          spari: import('@/assets/img/fish/common/spari.webp'),
          ebisu: import('@/assets/img/fish/common/ebisu.webp'),
          gills: import('@/assets/img/fish/common/gills.webp'),
          tumor: import('@/assets/img/fish/common/tumor.webp'),
          bladder: import('@/assets/img/fish/common/bladder.webp'),
        },
        bait: {
          cuthol: import('@/assets/img/fish/bait/cuthol-bait.webp'),
          glappid: import('@/assets/img/fish/bait/glappid-bait.webp'),
          murkray: import('@/assets/img/fish/bait/murkray-bait.webp'),
          norg: import('@/assets/img/fish/bait/norg-bait.webp'),
          peppered: import('@/assets/img/fish/bait/peppered-bait.webp'),
          twilight: import('@/assets/img/fish/bait/twilight-bait.webp'),
          narrowspectrum: import('@/assets/img/fish/bait/narrowspectrum-bait.webp'),
          broadspectrum: import('@/assets/img/fish/bait/broadspectrum-bait.webp'),
          mirewinder: import('@/assets/img/fish/bait/mirewinder-bait.webp'),
          longwinder: import('@/assets/img/fish/bait/longwinder-bait.webp'),
          kriller: import('@/assets/img/fish/bait/kriller-bait.webp'),
          tromyzon: import('@/assets/img/fish/bait/tromyzon-bait.webp'),
          charamote: import('@/assets/img/fish/bait/charamote-bait.webp'),
          synathid: import('@/assets/img/fish/bait/synathid-bait.webp'),
          vome: import('@/assets/img/fish/bait/vome.webp'),
          fass: import('@/assets/img/fish/bait/fass.webp'),
        },
        guide: {
          guide1: import('@/assets/img/fish/guide/guide1.webp'),
          guide2: import('@/assets/img/fish/guide/guide2.webp'),
          guide3: import('@/assets/img/fish/guide/guide3.webp'),
          guide5: import('@/assets/img/fish/guide/guide5.webp'),
          clem: import('@/assets/img/fish/guide/clem.webp'),
          vallisguide1: import('@/assets/img/fish/guide/vallisguide1.webp'),
          vallisguide2: import('@/assets/img/fish/guide/vallisguide2.webp'),
          vallisguide3: import('@/assets/img/fish/guide/vallisguide3.webp'),
          vallisguide4: import('@/assets/img/fish/guide/vallisguide4.webp'),
        },
        time: {
          vome: import('@/assets/img/fish/times/vome.webp'),
          fass: import('@/assets/img/fish/times/fass.webp'),
        },
      },
      typeId: this.type,
      itemId: this.item,
      src: '',
    };
  },
  mounted: function() {
    this.getImg();
  },
  methods: {
    getImg: function() {
      this.imgs[this.typeId][this.itemId].then((img) => {
        this.src = img.default;
      });
    },
  },
};
</script>
