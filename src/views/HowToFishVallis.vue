<template>
  <b-container fluid>
    <b-row class="text-center">
      <b-col md="8" offset="2">
        <h2>How do Fish?</h2>
        <br />
        <h3>The definitive guide to fishing in Warframe - Orb Vallis Edition</h3>
        <br />
        <h4>Created by MainlandHero, adapted from /u/cranem258 aka PepsiMan</h4>
        <FishImg type="guide" item="clem" name="Map" class="center-block" />
        <br />
        <br />
        <p>
          Welcome, if you're here, you want to know how to catch servofish in Orb Vallis, and what to do. So sit down
          and buckle up, because we're going on a ride. A grinding ride. Note that technically all water-like surfaces
          in Orb Vallis are flowing coolant liquid, but I shall refer to them as water.
        </p>
        <br />
        <h4>
          <b>Starting steps!</b>
        </h4>
        <p>
          Go to Orb Vallis, do some bounties (by talking to Eudico by the elevator) to increase your standing until you
          have at least 500, buy the first spear from The Businnes (fish icon on minimap, or you can fast travel there
          using ESC -> Fast Travel), it's called "Shockprod fishing spear". If you are coming here from Cetus,
          technically you can also use those old spears from Cetus, but they will not be as effective here, and grants
          you less standing.
        </p>
        <p>
          There are three kinds of water bodies: Lakes, Ponds/Rivers and Caves. They have their own fishes and the
          spawns are also warm-cold dependant.
        </p>
        <br />
        <br />
        <p>Here's the map for reference</p>
      </b-col>
      <b-col md="8" offset="2">
        <router-link to="/vallis/map">
          <b-btn variant="info" class="btn-block mb-3">Orb Vallis Map</b-btn>
        </router-link>
      </b-col>
      <b-col md="8" offset="2">
        <p>
          Equip your spear on your gear wheel, and enter Orb Vallis, and immediately outside of the spawn area, you can
          already start to fish:
        </p>
        <FishImg type="guide" item="vallisguide1" name="Vallis Guide 1" />
        <br />
        <br />
        <p>
          You can either farm here or do more bounties to level up your standing with Solaris United until you can get
          your second spear, which you get once you reach the Doer rank. There are only two fishing spears in Orb
          Vallis, and Stunna fishing spear is definitely the better one.
        </p>
        <p>
          From now on you should refer to the
          <router-link to="/vallis/fish">Super Fishing Reference Table</router-link>for whatever other information more
          specific on what/where/how to catch each fish. It contains EVERYTHING you need to know about them.
        </p>
        <br />
        <br />
        <h4>
          <b>Now let's fish!</b>
        </h4>
        <p>
          To catch some fish, switch to your spear by clicking it on your gear wheel, keep in mind that when you do so,
          your gear wheel will switch to the fishing wheel that contains your bait and dye (if you have them, probably
          not now). If you want to stop fishing, you can press F to switch weapons or press E to quick melee.
        </p>
        <p>
          Once you grab your spear, fish will start to spawn at random in close proximity to you, so keep your eyes
          peeled for movement. Once you hear a bubbling sound (you can hold aim to hear them a lot better), follow it
          and shortly a fish should be spawning where the sound came from. After spawning in, they will keep making the
          bubbling/swimming sound. Click to throw your spear and if it hits the fish, you'll catch it! (Maybe)
        </p>
        <p>
          Any splash effects produced in the water will scare the fish away, your sentinel can also cause them if it's
          close enough to the water.
        </p>
        <p>
          Remember that Fish are completely client-based, which means that different players will see different fish on
          the same session.
        </p>
        <br />
        <br />
        <h4>The catching mechanic!</h4>
        <p>
          The catching mechanic is currently based on how effectively you complete a minigame, please see below for an
          example:
        </p>
        <FishImg type="guide" item="vallisguide3" name="Vallis Guide 3" />
        <p>
          Once you have latched onto a servofish with your spear, you want to try and click again when the moving
          indicator reaches around the center of the red part. If you do not hit the red part of the bar, your catch
          will not be as effective. When you do hit the red part, it will send out a shockwave from the location where
          you caught the fish to stun other fish. Shockprod has a shorter stun duration than Stunna spear. Also in this
          picture is the item Luminous Dye that makes servofish easier to see, but you have to get them from the fish
          merchant in Cetus.
        </p>
        <br />
        <br />
        <h4>
          <b>Let's get better fish!</b>
        </h4>
        <p>
          Once you get enough standing and aquired the second fishing spear from The Business, you should consult the
          <router-link to="/vallis/map">Orb Vallis Map</router-link> for recommended fishing locations for all types of
          fish.
        </p>
        <br />
        <h4>
          <b id="hotspots">Hotspots</b>
        </h4>
        <p>Hotspots are glowing water that spawns at random in some locations, it looks like this:</p>
        <br />
        <FishImg type="guide" item="vallisguide2" name="Vallis Guide 2" />
        <br />
        <br />
        <video autoplay loop>
          <source src="@/assets/img/fish/guide/vallishotspot.webm" type="video/webm" />
          <source src="@/assets/img/fish/guide/vallishotspot.mp4" type="video/mp4" />
        </video>
        <br />
        <p>
          This is the time to learn to use your Dye and Bait. During cold cycle, you can catch Tromyzon, which gives an
          insane amount of standing and resources that you will need for later on. To do so, you need the appropriate
          bait to maximize the chances for those fish to spawn. Rare fishes do spawn in Orb Vallis without their
          respective bait, but definitely not as often compared to when you do use their bait. Again, you can refer to
          the <router-link to="/vallis/fish">Super Fishing Reference Table</router-link> for its specific bait.
        </p>
        <br />
        <p>
          So use the Tromyzon Bait
          <b>IN CLOSE PROXIMITY TO A HOTSPOT</b>, use the dye to see the fish better, and enjoy catching your Tromyzons.
        </p>
        <br />
        <p>Resource boosters and Smeeta Kavat's charm affect the fish catches, so it's highly recommended!</p>
        <br />
        <p style="color:firebrick">
          <b>
            Keep in mind that even though larger fishes give more standing, they don't give extra unique drops, so it's
            recommended to get the unique parts from the smaller ones, and save the larger fish for standing. Unless you
            really need standing.
          </b>
        </p>
        <br />
        <br />
        <FishImg type="guide" item="vallisguide4" name="Vallis Guide 4" />
        <p>Thanks for reading! Hope it helped.</p>
        <br />
        <h4>
          <b>Now go and fish on!</b>
        </h4>
      </b-col>
      <div class="row text-center"></div>
    </b-row>
  </b-container>
</template>

<style>
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
import FishImg from '@/components/FishImg.vue';

export default {
  name: 'HowToFishVallis',
  components: {
    FishImg,
  },
  methods: {
    track() {
      this.$ga.page('/vallis/fish/howto');
    },
  },
};
</script>
