<template>
  <b-container fluid>
    <b-row class="text-center">
      <b-col md="8" offset-md="2" offset-sm="1">
        <h2>How do Fish?</h2>
        <br />
        <h3>The definitive guide to fishing in Warframe</h3>
        <br />
        <h4>Contributors</h4>
      </b-col>
      <b-col md="4" offset-md="4" offset-sm="2">
        <b-list-group class="center-block">
          <b-list-group-item class="d-flex justify-content-between align-items-center">
            cranem258 aka PepsiMan
            <b-badge variant="primary" pill>v1</b-badge>
          </b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-center">
            MainlandHero
            <b-badge variant="primary" pill>v2</b-badge>
          </b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-center">
            Tobiah
            <b-badge variant="primary" pill>fuuusion</b-badge>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="8" offset-md="2" offset-sm="1">
        <FishImg type="guide" item="clem" title="Clem... Clem!" class="center-block" />
        <br />
        <br />
        <p>
          Welcome, if you're here, you want to know how to fish, and what to do. So sit down and buckle up, because
          we're going on a ride. A grinding ride.
        </p>
        <br />
        <h4>
          <b>Starting steps! - Bounties</b>
        </h4>
        <div>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Cetus" :active="active === 'cetus'" @click="active = 'cetus'">
              <p>
                Go to Cetus, do some bounties (by talking to Konzu close to the main gate) to increase your standing
                have at least 500, buy the first spear from the fish trader (fish icon on minimap, close to Cetus
                entrance), it's called "Lanzo fishing spear".
              </p>
            </b-tab>
            <b-tab title="Vallis" :active="active === 'vallis'" @click="active = 'vallis'">
              <p>
                Go to Orb Vallis, do some bounties (by talking to Eudico by the elevator) to increase your standing
                until you have at least 500, buy the first spear from The Businnes (fish icon on minimap, or you can
                fast travel there using ESC -> Fast Travel), it's called "Shockprod fishing spear". If you are coming
                here from Cetus, technically you can also use those old spears from Cetus, but they will not be as
                effective here, and grants you less standing.
              </p>
            </b-tab>
          </b-tabs>
        </div>
        <p>
          There are different kinds of water bodies: Lakes, Ponds/Rivers, Caves, and Sea. They have their own fishes and
          the spawns are also day-night/warm-cold dependant.
        </p>
        <br />
        <br />
        <p>Here's the map for reference</p>
      </b-col>
      <b-col md="4" offset-md="2" offset-sm="1">
        <nuxt-link to="poe-map">
          <b-btn variant="info" class="btn-block mb-3">Plains of Eidolon Map</b-btn>
        </nuxt-link>
      </b-col>
      <b-col md="4">
        <nuxt-link to="vallis-map">
          <b-btn variant="info" class="btn-block mb-3">Orb Vallis Map</b-btn>
        </nuxt-link>
      </b-col>
      <b-col md="8" offset-md="2">
        <p>
          Equip your spear on your gear wheel, and enter the open world, let's go to this spot since it's the easier to
          farm fish in the beginning:
        </p>
        <div>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Cetus" :active="active === 'cetus'" @click="active = 'cetus'">
              <FishImg type="guide" item="guide1" name="Guide 1" />
              <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
            </b-tab>
            <b-tab title="Vallis" :active="active === 'vallis'" @click="active = 'vallis'">
              <FishImg type="guide" item="vallisguide1" name="Vallis Guide 1" />
              <br />
              <p>
                You can either farm here or do more bounties to level up your standing with Solaris United until you can
                get your second spear, which you get once you reach the Doer rank. There are only two fishing spears in
                Orb Vallis, and Stunna fishing spear is definitely the better one.
              </p>
            </b-tab>
          </b-tabs>
        </div>
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
          <nuxt-link to="poe-fish">Super Fishing Reference Table </nuxt-link>
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
        <h4>The catching mechanic!</h4>
        <b-tabs content-class="mt-3" fill>
          <b-tab title="Cetus" :active="active === 'cetus'" @click="active = 'cetus'">
            <h5>(This part is a bit complex so read carefully.)</h5>
            <p>
              The catching mechanic is currently based on HP (health points), so some fish have different amounts of HP,
              certain spears will deal different amounts of damage to different fish, and some low tiered fish have a
              very small amount of health, which means they can be caught with any spear. When you go to more uncommon
              fishes, you will need to pay attention to which spear deals the best damage so you can catch it with 1
              hit, and not let it swim away.
            </p>
            <p>
              In the <nuxt-link to="poe-fish">Super Fishing Reference Table</nuxt-link>, the "Spear" column represents
              the spear that can capture the fish in 1 hit.
            </p>
          </b-tab>
          <b-tab title="Vallis" :active="active === 'vallis'" @click="active = 'vallis'">
            <p>
              The catching mechanic is currently based on how effectively you complete a minigame, please see below for
              an example:
            </p>
            <FishImg type="guide" item="vallisguide3" name="Vallis Guide 3" />
            <p>
              Once you have latched onto a servofish with your spear, you want to try and click again when the moving
              indicator reaches around the center of the red part. If you do not hit the red part of the bar, your catch
              will not be as effective. When you do hit the red part, it will send out a shockwave from the location
              where you caught the fish to stun other fish. Shockprod has a shorter stun duration than Stunna spear.
              Also in this picture is the item Luminous Dye that makes servofish easier to see, but you have to get them
              from the fish merchant in Cetus.
            </p>
          </b-tab>
        </b-tabs>
        <p>Fishing is all about patience, so keep at it!</p>
        <br />
        <br />
        <h4>
          <b>Let's get better fish!</b>
        </h4>
        <b-tabs content-class="mt-3" fill>
          <b-tab title="Cetus" :active="active === 'cetus'" @click="active = 'cetus'">
            <p>
              Once you get enough standing, it's time to go to the Sea, so I'd recommend going here, you'll need a bunch
              of Goopola for resources, and they spawn quite consistently:
            </p>
            <FishImg type="guide" item="guide2" />
            <br />
            <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
            <br />
            <p>
              All the water surface around this island can spawn "Hotspots", which is the next topic I will explain.
            </p>
          </b-tab>
          <b-tab title="Vallis" :active="active === 'vallis'" @click="active = 'vallis'">
            <p>
              Once you get enough standing and aquired the second fishing spear from The Business, you should consult
              the
              <nuxt-link to="vallis-map">Orb Vallis Map</nuxt-link> for recommended fishing locations for all types of
              fish.
            </p>
          </b-tab>
        </b-tabs>

        <br />
        <br />
        <br />
        <h4>
          <b id="hotspots">Hotspots</b>
        </h4>
        <b-tabs content-class="mt-3" fill>
          <b-tab title="Cetus" :active="active === 'cetus'" @click="active = 'cetus'">
            <p>Hotspots are bubbly/wavy water that spawns at random in some locations, it looks like this:</p>
            <br />
            <FishImg type="guide" item="guide3" />
            <br />
            <h6 class="text-center">[Image by Narration]</h6>
            <br />
            <video autoplay muted loop>
              <source :src="cdn('webp/fish/guide/hotspot.webm')" type="video/webm" />
              <source :src="cdn('webp/fish/guide/hotspot.mp4')" type="video/mp4" />
            </video>
            <br />
            <h6 class="text-center">[Animated GIF by How4Much]</h6>
            <br />
            <p>
              This is the time to learn to use your Dye and Bait. At night, you can catch Murkray, which gives an insane
              amount of standing and resources that you will need for later on. To do so, you need the appropriate bait
              for fishes that "Require Bait" in the spreadsheet, take a look at it again to find the fish you're looking
              for and its specific bait (In this case, Murkray). For fishes that are not bait required, the proper bait
              specified will only attract them, making them easier to fish. To craft the Murkray Bait you'll need to
              catch Tralok, which are common in the sea at daytime.
            </p>
            <br />
            <p>
              So use the Murkray Bait <b>IN CLOSE PROXIMITY TO A HOTSPOT</b>, use the dye to see the fish better, and
              enjoy catching your Murkrays.
            </p>
            <br />
            <p>Resource boosters and Smeeta Kavat's charm affect the fish catches, so it's highly recommended!</p>
            <br />
            <p style="color: firebrick">
              <b>
                Keep in mind that even though larger fishes give more standing, they don't give extra unique drops, so
                it's recommended to get the drops (fillet) from the smaller ones, and save the larger fish for standing.
                Unless you really need standing.
              </b>
            </p>
            <br />
            <p>As Honorable mention: The Sentient Lake, the only "lake" in PoE (that we're aware of!).</p>
            <br />
            <FishImg type="guide" item="guide5" name="Guide 5" />
            <h6 class="text-center">[Screenshot by --Q--Shin]</h6>
            <p>Thanks for reading! Hope it helped.</p>
          </b-tab>
          <b-tab title="Vallis" :active="active === 'vallis'" @click="active = 'vallis'">
            <p>Hotspots are glowing water that spawns at random in some locations, it looks like this:</p>
            <br />
            <FishImg type="guide" item="vallisguide2" name="Vallis Guide 2" />
            <br />
            <br />
            <video autoplay muted loop>
              <source :src="cdn('webp/fish/guide/vallishotspot.webm')" type="video/webm" />
              <source :src="cdn('webp/fish/guide/vallishotspot.mp4')" type="video/mp4" />
            </video>
            <p>
              This is the time to learn to use your Dye and Bait. During cold cycle, you can catch Tromyzon, which gives
              an insane amount of standing and resources that you will need for later on. To do so, you need the
              appropriate bait to maximize the chances for those fish to spawn. Rare fishes do spawn in Orb Vallis
              without their respective bait, but definitely not as often compared to when you do use their bait. Again,
              you can refer to the <nuxt-link to="vallis-fish">Super Fishing Reference Table</nuxt-link> for its
              specific bait.
            </p>
            <br />
            <p>
              So use the Tromyzon Bait
              <b>IN CLOSE PROXIMITY TO A HOTSPOT</b>, use the dye to see the fish better, and enjoy catching your
              Tromyzons.
            </p>
            <br />
            <p>Resource boosters and Smeeta Kavat's charm affect the fish catches, so it's highly recommended!</p>
            <br />
            <p style="color: firebrick">
              <b>
                Keep in mind that even though larger fishes give more standing, they don't give extra unique drops, so
                it's recommended to get the unique parts from the smaller ones, and save the larger fish for standing.
                Unless you really need standing.
              </b>
            </p>
            <br />
            <br />
            <FishImg type="guide" item="vallisguide4" name="Vallis Guide 4" />
            <p>Thanks for reading! Hope it helped.</p>
            <br />
          </b-tab>
        </b-tabs>
        <br />
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8" offset-md="2" offset-sm="1">
        <h4>Recommended Equipment</h4>
      </b-col>
      <b-col md="8" offset-md="2" offset-sm="1">
        <div>
          <b-card-group columns>
            <codex-card
              :item="{
                name: 'Ivara',
                imageName: 'ivara.png',
              }"
              link="https://warframe.fandom.com/wiki/Ivara"
            >
              <t1>Ivara's Prowl can help you stay away from enemy awareness. </t1>
              <t2>Ivara's Dashwire can let you get a good angle above fish to throw spears at them</t2>
            </codex-card>
            <codex-card
              :item="{
                name: 'Banshee',
                imageName: 'banshee.png',
                description:
                  'Banshee\'s Sonarr allows you to see outlines of fish for a short time, but doesn\'t give weak points or waypoints.',
              }"
              link="https://warframe.fandom.com/wiki/Banshee"
            />
            <codex-card
              :item="{
                name: 'Limbo',
                imageName: 'limbo.png',
                description:
                  'Limbo in the rift will see an entity outline, but the spear won\'t be effective as the fish isn\'t in the rift',
              }"
              link="https://warframe.fandom.com/wiki/Limbo"
            />
            <codex-card
              :item="{
                name: 'Luminous Dye',
                imageName: 'luminous-dye.png',
                description: 'Luminous dye shows bright silhouettes of fish in the water, making them easier to catch.',
              }"
              link="https://warframe.fandom.com/wiki/Luminous_Dye"
            />
            <codex-card
              :item="{
                name: 'Oxylus',
                imageName: 'oxylus.png',
                description:
                  'Oxylus\'s Scan Aquatic Lifeforms provides a fish highlight similar to luminous dye, and provides waypoints on the map.',
              }"
              link="https://warframe.fandom.com/wiki/Oxylus"
              :link2="{ a: 'https://warframe.fandom.com/wiki/Scan_Aquatic_Lifeforms', title: 'Mod' }"
            />
          </b-card-group>
        </div>
      </b-col>
      <b-col md="8" offset-md="2">
        <h4>
          <b>Now go and fish on!</b>
        </h4>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import FishImg from '@/components/FishImg.vue';
import { cdn, wfcdn, optimize } from '@/services/utilities';

import CodexCard from '@/components/CodexCard';

export default {
  name: 'HowToFish',
  components: {
    FishImg,
    CodexCard,
  },
  data() {
    return {
      active: 'cetus',
    };
  },
  methods: {
    cdn,
    wfcdn,
    optimize,
  },
};
</script>
<style>
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
