<template>
  <img :src="src" :name="name" :height="height" :width="width" :alt="name" />
</template>

<!--  -->
<script>
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
    name: {
      type: String,
      default: 'Name'
    },
    width: {
      type: String,
      default: '12px',
    },
    height: {
      type: String,
      default: '12px',
    }
  },
  data() {
    return {
      imgs: {
        fish: {
          charceel: import('@/assets/img/fish/charceel.png'),
          cuthol: import('@/assets/img/fish/cuthol.png'),
          glappid: import('@/assets/img/fish/glappid.png'),
          goopola: import('@/assets/img/fish/goopola.png'),
          karkina: import('@/assets/img/fish/karkina.png'),
          khutkhut: import('@/assets/img/fish/khutkhut.png'),
          mawfish: import('@/assets/img/fish/mawfish.png'),
          mortus: import('@/assets/img/fish/mortus.png'),
          murkray: import('@/assets/img/fish/murkray.png'),
          norg: import('@/assets/img/fish/norg.png'),
          sharrac: import('@/assets/img/fish/sharrac.png'),
          tralok: import('@/assets/img/fish/tralok.png'),
          yogwun: import('@/assets/img/fish/yogwun.png'),
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
        },
        bait: {
          cuthol: import('@/assets/img/fish/bait/cuthol-bait.png'),
          glappid: import('@/assets/img/fish/bait/glappid-bait.png'),
          murkray: import('@/assets/img/fish/bait/murkray-bait.png'),
          norg: import('@/assets/img/fish/bait/norg-bait.png'),
          peppered: import('@/assets/img/fish/bait/peppered-bait.png'),
          twilight: import('@/assets/img/fish/bait/twilight-bait.png'),
        },
        misc: {
          hotspot: import('@/assets/img/fish/guide/hotspot.gif'),
          map: import('@/assets/img/fishmap.png'),
        },
        guide: {
          guide1: import('@/assets/img/fish/guide/guide1.png'),
          guide2: import('@/assets/img/fish/guide/guide2.png'),
          guide3: import('@/assets/img/fish/guide/guide3.png'),
          guide5: import('@/assets/img/fish/guide/guide5.png'),
          clem: import('@/assets/img/fish/guide/clem.png'),
        }
      },
      typeId: this.type,
      itemId: this.item,
      src: ''
    };
  },
  mounted: function() {
    this.getImg();
  },
  methods: {
    getImg: function() {
      this.imgs[this.typeId][this.itemId]
        .then((img) => {
          this.src = img.default;
        });
    }
  }
};
</script>
