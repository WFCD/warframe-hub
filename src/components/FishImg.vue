<template>
  <HubImg
    :src="src"
    :name="title"
    :title="title"
    :height="height"
    :width="width"
    v-bind:class="{ invert: invert === 'true' }"
    fluid
    :alt="name"
  />
</template>

<!--  -->
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
          charceel: import('@/assets/img/fish/charceel.png'),
          cuthol: import('@/assets/img/fish/cuthol.png'),
          glappid: import('@/assets/img/fish/glappid.png'),
          goopolla: import('@/assets/img/fish/goopolla.png'),
          karkina: import('@/assets/img/fish/karkina.png'),
          khutkhut: import('@/assets/img/fish/khutkhut.png'),
          mawfish: import('@/assets/img/fish/mawfish.png'),
          mortus: import('@/assets/img/fish/mortus.png'),
          murkray: import('@/assets/img/fish/murkray.png'),
          norg: import('@/assets/img/fish/norg.png'),
          sharrac: import('@/assets/img/fish/sharrac.png'),
          tralok: import('@/assets/img/fish/tralok.png'),
          yogwun: import('@/assets/img/fish/yogwun.png'),
          eyeeye: import('@/assets/img/fish/eyeeye.png'),
          scrubber: import('@/assets/img/fish/scrubber.png'),
          echowinder: import('@/assets/img/fish/echowinder.png'),
          mirewinder: import('@/assets/img/fish/mirewinder.png'),
          longwinder: import('@/assets/img/fish/longwinder.png'),
          brickie: import('@/assets/img/fish/brickie.png'),
          tink: import('@/assets/img/fish/tink.png'),
          sapcaddy: import('@/assets/img/fish/sapcaddy.png'),
          kriller: import('@/assets/img/fish/kriller.png'),
          recaster: import('@/assets/img/fish/recaster.png'),
          tromyzon: import('@/assets/img/fish/tromyzon.png'),
          charamote: import('@/assets/img/fish/charamote.png'),
          synathid: import('@/assets/img/fish/synathid.png'),
          boot: import('@/assets/img/fish/boot.png'),
          crewmensboot: import('@/assets/img/fish/crewmensboot.png'),
        },
        parts: {
          antenna: import('@/assets/img/fish/part/antenna.png'),
          bones: import('@/assets/img/fish/part/bones.png'),
          brain: import('@/assets/img/fish/part/brain.png'),
          electroplax: import('@/assets/img/fish/part/electroplax.png'),
          eyes: import('@/assets/img/fish/part/eyes.png'),
          horn: import('@/assets/img/fish/part/horn.png'),
          liver: import('@/assets/img/fish/part/liver.png'),
          sac: import('@/assets/img/fish/part/sac.png'),
          shell: import('@/assets/img/fish/part/shell.png'),
          spleen: import('@/assets/img/fish/part/spleen.png'),
          stomach: import('@/assets/img/fish/part/stomach.png'),
          teeth: import('@/assets/img/fish/part/teeth.png'),
          tendrils: import('@/assets/img/fish/part/tendrils.png'),
          rotoblade: import('@/assets/img/fish/part/rotoblade.png'),
          exabrain: import('@/assets/img/fish/part/exabrain.png'),
          anoscopicsensor: import('@/assets/img/fish/part/anoscopicsensor.png'),
          parallelbiode: import('@/assets/img/fish/part/parallelbiode.png'),
          lathecoagulant: import('@/assets/img/fish/part/lathecoagulant.png'),
          muonbattery: import('@/assets/img/fish/part/muonbattery.png'),
          dissipatorcoil: import('@/assets/img/fish/part/dissipatorcoil.png'),
          venedocase: import('@/assets/img/fish/part/venedocase.png'),
          thermallaser: import('@/assets/img/fish/part/thermallaser.png'),
          neuralrelay: import('@/assets/img/fish/part/neuralrelay.png'),
          entroplasma: import('@/assets/img/fish/part/entroplasma.png'),
          saganmodule: import('@/assets/img/fish/part/saganmodule.png'),
          ecosynthanalyzer: import('@/assets/img/fish/part/ecosynthanalyzer.png'),
          crewmensboot: import('@/assets/img/fish/crewmensboot.png'),
        },
        common: {
          standing: import('@/assets/img/general/standing.svg'),
          meat: import('@/assets/img/fish/common/fishmeat.png'),
          scale: import('@/assets/img/fish/common/fishscale.png'),
          oil: import('@/assets/img/fish/common/fishoil.png'),
          scrap: import('@/assets/img/fish/common/scrap.png'),
          common: import('@/assets/img/fish/common/common.png'),
          uncommon: import('@/assets/img/fish/common/uncommon.png'),
          rare: import('@/assets/img/fish/common/rare.png'),
          legendary: import('@/assets/img/fish/common/legendary.png'),
          peculiar: import('@/assets/img/fish/common/peculiar.png'),
          lanzosm: import('@/assets/img/fish/common/lanzo-icon.png'),
          tuloksm: import('@/assets/img/fish/common/tulok-icon.png'),
          peramsm: import('@/assets/img/fish/common/peram-icon.png'),
        },
        bait: {
          cuthol: import('@/assets/img/fish/bait/cuthol-bait.png'),
          glappid: import('@/assets/img/fish/bait/glappid-bait.png'),
          murkray: import('@/assets/img/fish/bait/murkray-bait.png'),
          norg: import('@/assets/img/fish/bait/norg-bait.png'),
          peppered: import('@/assets/img/fish/bait/peppered-bait.png'),
          twilight: import('@/assets/img/fish/bait/twilight-bait.png'),
          narrowspectrum: import('@/assets/img/fish/bait/narrowspectrum-bait.png'),
          broadspectrum: import('@/assets/img/fish/bait/broadspectrum-bait.png'),
          mirewinder: import('@/assets/img/fish/bait/mirewinder-bait.png'),
          longwinder: import('@/assets/img/fish/bait/longwinder-bait.png'),
          kriller: import('@/assets/img/fish/bait/kriller-bait.png'),
          tromyzon: import('@/assets/img/fish/bait/tromyzon-bait.png'),
          charamote: import('@/assets/img/fish/bait/charamote-bait.png'),
          synathid: import('@/assets/img/fish/bait/synathid-bait.png'),
        },
        guide: {
          guide1: import('@/assets/img/fish/guide/guide1.png'),
          guide2: import('@/assets/img/fish/guide/guide2.png'),
          guide3: import('@/assets/img/fish/guide/guide3.png'),
          guide5: import('@/assets/img/fish/guide/guide5.png'),
          clem: import('@/assets/img/fish/guide/clem.png'),
          vallisguide1: import('@/assets/img/fish/guide/vallisguide1.png'),
          vallisguide2: import('@/assets/img/fish/guide/vallisguide2.png'),
          vallisguide3: import('@/assets/img/fish/guide/vallisguide3.png'),
          vallisguide4: import('@/assets/img/fish/guide/vallisguide4.png'),
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
