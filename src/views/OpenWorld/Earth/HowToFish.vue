<template>
  <b-container fluid>
    <b-row class="text-center">
      <b-col md="8" offset="2">
        <h2>How do Fish?</h2>
        <br />
        <h3>The definitive guide to fishing in Warframe</h3>
        <br />
        <h4>By /u/cranem258 aka PepsiMan</h4>
        <FishImg type="guide" item="clem" name="Map" class="center-block" />
        <br />
        <br />
        <p>
          Welcome, if you're here, you want to know how to fish, and what to do. So sit down and buckle up, because
          we're going on a ride. A grinding ride.
        </p>
        <br />
        <h4>
          <b>Starting steps!</b>
        </h4>
        <p>
          Go to Cetus, do some bounties (by talking to Konzu close to the main gate) to increase your standing until you
          have at least 500, buy the first spear from the fish trader (fish icon on minimap, close to Cetus entrance),
          it's called "Lanzo fishing spear".
        </p>
        <p>
          There are three kinds of water bodies: Lakes, Ponds and Sea. They have their own fishes and the spawns are
          also day-night dependant.
        </p>
        <br />
        <br />
        <p>Here's the map for reference</p>
      </b-col>
      <b-col md="8" offset="2">
        <router-link to="/poe/map">
          <b-btn variant="info" class="btn-block mb-3">Plains of Eidolon Map</b-btn>
        </router-link>
      </b-col>
      <b-col md="8" offset="2">
        <p>
          Equip your spear on your gear wheel, and enter the plains, let's go to this spot since it's the easier to farm
          fish in the beginning:
        </p>
        <FishImg type="guide" item="guide1" name="Guide 1" />
        <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
        <br />
        <br />
        <p>
          Stand on top of that rock on the middle of the pond, you'll have a 360° view of the pond around you, making it
          easy to farm fishes.
        </p>
        <p>
          You will be farming here until you get your second (and maybe third) spear, which you get once you reach the
          next title with the Ostrun, you can farm multiple fishes here but the best one is the Mortus Lungfish, it
          gives a great amount of standing and resources, but I'd recommend gathering a bunch of them and using them to
          max your standing until you level up your title. Currently fishing isn't so great for standing farming, so
          let's just hope they fix the bounty system.
        </p>
        <p>
          From now on you should refer to the
          <router-link to="/poe/fish">Super Fishing Reference Table </router-link>
          for whatever other information more specific on what/where/how to catch each fish. It contains EVERYTHING you
          need to know about them.
        </p>
        <br />
        <br />
        <h4>
          <b>Now let's fish!</b>
        </h4>
        <p>
          To catch some fish, switch to your spear by clicking it on your gear wheel, keep in mind that when you do so,
          your gear wheel will switch to the fishing wheel that contains your bait and dye (if you have them, probably
          not now), so the only way to unequip the spear is pressing F (<del>to pay respects</del>to switch to your
          weapons) or E to quick melee.
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
        <h4>The catching mechanic! (This part is a bit complex so readcarefully.)</h4>
        <p>
          The catching mechanic is currently based on HP (health points), so some fish have different amounts of HP,
          certain spears will deal different amounts of damage to different fish, and some low tiered fish have a very
          small amount of health, which means they can be caught with any spear. When you go to more uncommon fishes,
          you will need to pay attention to which spear deals the best damage so you can catch it with 1 hit, and not
          let it swim away.
        </p>
        <p>
          In the <router-link to="/poe/fish">Super Fishing Reference Table</router-link>, the "Spear" column represents
          the spear that can capture the fish in 1 hit.
        </p>
        <p>Fishing is all about patience, so keep at it!</p>
        <br />
        <br />
        <h4>
          <b>Let's get better fish!</b>
        </h4>
        <p>
          Once you get enough standing, it's time to go to the Sea, so I'd recommend going here, you'll need a bunch of
          Goopola for resources, and they spawn quite consistently:
        </p>
        <FishImg type="guide" item="guide2" />
        <br />
        <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
        <br />
        <p>
          All the water surface around this island can spawn "Hotspots", which is the next topic I will explain.
        </p>
        <br />
        <br />
        <br />
        <h4>
          <b id="hotspots">Hotspots</b>
        </h4>
        <br />
        <p>
          Hotspots are bubbly/wavy water that spawns at random in some locations, it looks like this:
        </p>
        <br />
        <FishImg type="guide" item="guide3" />
        <br />
        <h6 class="text-center">[Image by Narration]</h6>
        <br />
        <video autoplay loop>
          <source src="@/assets/img/fish/guide/hotspot.webm" type="video/webm" />
          <source src="@/assets/img/fish/guide/hotspot.mp4" type="video/mp4" />
        </video>
        <br />
        <h6 class="text-center">[Animated GIF by How4Much]</h6>
        <br />
        <p>
          This is the time to learn to use your Dye and Bait. At night, you can catch Murkray, which gives an insane
          amount of standing and resources that you will need for later on. To do so, you need the appropriate bait for
          fishes that "Require Bait" in the spreadsheet, take a look at it again to find the fish you're looking for and
          its specific bait (In this case, Murkray). For fishes that are not bait required, the proper bait specified
          will only attract them, making them easier to fish. To craft the Murkray Bait you'll need to catch Tralok,
          which are common in the sea at daytime.
        </p>
        <br />
        <p>
          So use the Murkray Bait <b>IN CLOSE PROXIMITY TO A HOTSPOT</b>, use the dye to see the fish better, and enjoy
          catching your Murkrays.
        </p>
        <br />
        <p>
          Resource boosters and Smeeta Kavat's charm affect the fish catches, so it's highly recommended!
        </p>
        <br />
        <p style="color:firebrick">
          <b>
            Keep in mind that even though larger fishes give more standing, they don't give extra unique drops, so it's
            recommended to get the drops (fillet) from the smaller ones, and save the larger fish for standing. Unless
            you really need standing.
          </b>
        </p>
        <br />
        <p>
          As Honorable mention: The Sentient Lake, the only "lake" in PoE (that we're aware of!).
        </p>
        <br />
        <FishImg type="guide" item="guide5" name="Guide 5" />
        <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
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
  name: 'HowToFish',
  components: {
    FishImg,
  },
  methods: {
    track() {
      this.$ga.page('/poe/fish/howto');
    },
  },
};
</script>
