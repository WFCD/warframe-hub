'use client';

import { useState, type FC } from 'react';
import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';
import { cdn } from '@/lib/shared';
import { Chip } from '@heroui/react';
import ContentPage from '@/components/pages/ContentPage';
import ContentLinkButton from '@/components/pages/ContentPage/ContentLinkButton';
import GuideContentSection from '@/components/pages/ContentPage/GuideContentSection';
import OpenWorldGuideTabList from '@/components/pages/ContentPage/OpenWorldGuideTabList';
import CodexCard from '@/components/ui/CodexCard';
import FishImg from '@/components/media/FishImg';

const HowToFishView: FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('cetus');
  const pageChrome = (
    <OpenWorldGuideTabList active={active} onSelect={setActive} ariaLabel={t('howto.regionAria')} />
  );

  return (
    <ContentPage
      title={t('howto.title')}
      subtitle={t('howto.subtitle')}
      variant='article'
      pageChromeLabel={t('howto.pageChrome')}
      pageChrome={pageChrome}
      actions={
        <>
          <ContentLinkButton href='/poe/map' tone='header' aria-label={t('howto.links.poeMapAria')}>
            {t('howto.links.poeMap')}
          </ContentLinkButton>
          <ContentLinkButton href='/vallis/map' tone='header' aria-label={t('howto.links.vallisMapAria')}>
            {t('howto.links.vallisMap')}
          </ContentLinkButton>
        </>
      }
    >
      <div className='hub-content-prose'>
        <h4>{t('howto.contributors.heading')}</h4>
        <ul className='hub-content-contributor-list'>
          <li>
            {t('howto.contributors.cranem258')}
            <Chip size='sm' variant='soft' color='accent'>
              {t('howto.contributors.v1')}
            </Chip>
          </li>
          <li>
            {t('howto.contributors.mainlandHero')}
            <Chip size='sm' variant='soft' color='accent'>
              {t('howto.contributors.v2')}
            </Chip>
          </li>
          <li>
            {t('howto.contributors.tobiah')}
            <Chip size='sm' variant='soft' color='accent'>
              {t('howto.contributors.fuuusion')}
            </Chip>
          </li>
        </ul>
        <FishImg type='guide' item='clem' title={t('howto.images.clem')} className='hub-content-hero-img' />
        <p>{t('howto.sections.welcome')}</p>
        <GuideContentSection
          heading={
            <h4>
              <b>{t('howto.sections.startingSteps')}</b>
            </h4>
          }
          active={active}
          cetus={<p>{t('howto.sections.cetusBounties')}</p>}
          vallis={<p>{t('howto.sections.vallisBounties')}</p>}
        />
        <p>{t('howto.sections.waterBodies')}</p>
        <br />
        <br />
        <p>{t('howto.sections.mapReference')}</p>
        <p>{t('howto.sections.equipSpear')}</p>
        <GuideContentSection
          active={active}
          cetus={
            <>
              <FishImg type='guide' item='guide1' title={t('howto.images.guide1')} />
              <h6 className='text-center'>{t('howto.credits.shin')}</h6>
            </>
          }
          vallis={
            <>
              <FishImg type='guide' item='vallisguide1' title={t('howto.images.vallisGuide1')} />
              <br />
              <p>{t('howto.sections.vallisFarmSpot')}</p>
            </>
          }
        />
        <br />
        <br />
        <p>{t('howto.sections.pondRock')}</p>
        <p>{t('howto.sections.secondSpear')}</p>
        <p>
          <Trans i18nKey='howto.sections.referenceTable' components={{ a: <Link href='/poe/fish' /> }} />
        </p>
        <br />
        <br />
        <h4>
          <b>{t('howto.sections.nowFish')}</b>
        </h4>
        <p>
          <Trans
            i18nKey='howto.sections.gearWheel'
            components={{ del: <del /> }}
          />
        </p>
        <p>{t('howto.sections.spawnFish')}</p>
        <p>{t('howto.sections.splashEffects')}</p>
        <p>{t('howto.sections.clientBased')}</p>
        <br />
        <br />
        <GuideContentSection
          heading={<h4>{t('howto.sections.catchingMechanic')}</h4>}
          active={active}
          cetus={
            <>
              <h5>{t('howto.sections.catchingComplex')}</h5>
              <p>{t('howto.sections.catchingHp')}</p>
              <p>
                <Trans
                  i18nKey='howto.sections.catchingSpearColumn'
                  components={{ a: <Link href='/poe/fish' /> }}
                />
              </p>
            </>
          }
          vallis={
            <>
              <p>{t('howto.sections.catchingMinigame')}</p>
              <FishImg type='guide' item='vallisguide3' title={t('howto.images.vallisGuide3')} />
              <p>{t('howto.sections.catchingMinigameDetail')}</p>
            </>
          }
        />
        <p>{t('howto.sections.patience')}</p>
        <br />
        <br />
        <GuideContentSection
          heading={
            <h4>
              <b>{t('howto.sections.betterFish')}</b>
            </h4>
          }
          active={active}
          cetus={
            <>
              <p>{t('howto.sections.cetusSea')}</p>
              <FishImg type='guide' item='guide2' title={t('howto.images.guide2')} />
              <br />
              <h6 className='text-center'>{t('howto.credits.shin')}</h6>
              <br />
              <p>{t('howto.sections.cetusHotspotsIntro')}</p>
            </>
          }
          vallis={
            <p>
              <Trans
                i18nKey='howto.sections.vallisBetterFish'
                components={{ a: <Link href='/vallis/map' /> }}
              />
            </p>
          }
        />

        <br />
        <br />
        <br />
        <GuideContentSection
          id='hotspots'
          heading={
            <h4>
              <b>{t('howto.sections.hotspots')}</b>
            </h4>
          }
          active={active}
          cetus={
            <>
              <p>{t('howto.sections.cetusHotspotsDesc')}</p>
              <br />
              <FishImg type='guide' item='guide3' title={t('howto.images.guide3')} />
              <br />
              <h6 className='text-center'>{t('howto.credits.narration')}</h6>
              <br />
              <video autoPlay muted loop>
                <source src={cdn('webp/fish/guide/hotspot.webm')} type='video/webm' />
                <source src={cdn('webp/fish/guide/hotspot.mp4')} type='video/mp4' />
              </video>
              <br />
              <h6 className='text-center'>{t('howto.credits.how4much')}</h6>
              <br />
              <p>{t('howto.sections.cetusMurkray')}</p>
              <br />
              <p>
                <Trans
                  i18nKey='howto.sections.cetusMurkrayBait'
                  components={{ b: <b /> }}
                />
              </p>
              <br />
              <p>{t('howto.sections.boosters')}</p>
              <br />
              <p className='hub-content-callout hub-content-callout--warning'>
                <b>{t('howto.sections.cetusSizeWarning')}</b>
              </p>
              <br />
              <p>{t('howto.sections.sentientLake')}</p>
              <br />
              <FishImg type='guide' item='guide5' title={t('howto.images.guide5')} />
              <h6 className='text-center'>{t('howto.credits.shin')}</h6>
              <p>{t('howto.sections.thanks')}</p>
            </>
          }
          vallis={
            <>
              <p>{t('howto.sections.vallisHotspotsDesc')}</p>
              <br />
              <FishImg type='guide' item='vallisguide2' title={t('howto.images.vallisGuide2')} />
              <br />
              <br />
              <video autoPlay muted loop>
                <source src={cdn('webp/fish/guide/vallishotspot.webm')} type='video/webm' />
                <source src={cdn('webp/fish/guide/vallishotspot.mp4')} type='video/mp4' />
              </video>
              <p>
                <Trans
                  i18nKey='howto.sections.vallisTromyzon'
                  components={{ a: <Link href='/vallis/fish' /> }}
                />
              </p>
              <br />
              <p>
                <Trans
                  i18nKey='howto.sections.vallisTromyzonBait'
                  components={{ b: <b /> }}
                />
              </p>
              <br />
              <p>{t('howto.sections.boosters')}</p>
              <br />
              <p className='hub-content-callout hub-content-callout--warning'>
                <b>{t('howto.sections.vallisSizeWarning')}</b>
              </p>
              <br />
              <br />
              <FishImg type='guide' item='vallisguide4' title={t('howto.images.vallisGuide4')} />
              <p>{t('howto.sections.thanks')}</p>
              <br />
            </>
          }
        />
        <h4>{t('howto.sections.equipment')}</h4>
        <div className='hub-codex-grid'>
          <CodexCard
            item={{ name: 'Ivara', uniqueName: '/Lotus/Powersuits/Ranger/Ranger' }}
            link='https://wiki.warframe.com/w/Ivara'
          >
            {t('howto.equipment.ivara')}
            <br />
            {t('howto.equipment.ivaraDashwire')}
          </CodexCard>
          <CodexCard
            item={{
              name: 'Banshee',
              uniqueName: '/Lotus/Powersuits/Banshee/Banshee',
              description:
                  "Banshee's Sonarr allows you to see outlines of fish for a short time, but doesn't give weak points or waypoints.",
            }}
            link='https://wiki.warframe.com/w/Banshee'
          />

          <CodexCard
            item={{
              name: 'Limbo',
              uniqueName: '/Lotus/Powersuits/Magician/Magician',
              description:
                  "Limbo in the rift will see an entity outline, but the spear won't be effective as the fish isn't in the rift",
            }}
            link='https://wiki.warframe.com/w/Limbo'
          />

          <CodexCard
            item={{
              name: 'Luminous Dye',
              uniqueName: '/Lotus/Types/Restoratives/Consumable/FishingBoosts/AnglerVision',
              description: 'Luminous dye shows bright silhouettes of fish in the water, making them easier to catch.',
            }}
            link='https://wiki.warframe.com/w/Luminous_Dye'
          />

          <CodexCard
            item={{
              name: 'Oxylus',
              uniqueName: '/Lotus/Types/Sentinels/SentinelPowersuits/RadarPowerSuit',
              description:
                  "Oxylus's Scan Aquatic Lifeforms provides a fish highlight similar to luminous dye, and provides waypoints on the map.",
            }}
            link='https://wiki.warframe.com/w/Oxylus'
            link2={{ a: 'https://wiki.warframe.com/w/Scan_Aquatic_Lifeforms', title: t('howto.equipment.mod') }}
          />
        </div>
        <h4>
          <b>{t('howto.sections.goFish')}</b>
        </h4>
      </div>
    </ContentPage>
  );
};
export default HowToFishView;
