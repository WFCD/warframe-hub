'use client';
import './SynthesisImg.component.scss';

import type { FC } from 'react';

import HubImg from '@/components/media/HubImg';
import { useSynthesisPreview } from '@/components/media/SynthesisImg/SynthesisPreview';
import { optimize, cdn } from '@/lib/shared';

const synthesisSrc = (stub: string) => cdn(`webp/synthesis/${stub}.webp`);

const imgs: Record<string, string> = {
  'Ancient Disruptor': optimize(synthesisSrc('ancient_disruptor')),
  'Ancient Healer': optimize(synthesisSrc('ancient_healer')),
  'Anti MOA [Research]': optimize(synthesisSrc('anti_moa')),
  'Arid Eviscerator [Research]': optimize(synthesisSrc('arid_eviscerator')),
  Ballista: optimize(synthesisSrc('ballista')),
  Boiler: optimize(synthesisSrc('boiler')),
  Bombard: optimize(synthesisSrc('bombard')),
  'Brood Mother': optimize(synthesisSrc('brood_mother')),
  Butcher: optimize(synthesisSrc('butcher')),
  Charger: optimize(synthesisSrc('charger')),
  Commander: optimize(synthesisSrc('commander')),
  'Corrupted Ancient [Research]': optimize(synthesisSrc('corrupted_ancient')),
  'Corrupted Bombard': optimize(synthesisSrc('corrupted_bombard')),
  'Corrupted Butcher': optimize(synthesisSrc('corrupted_butcher')),
  'Corrupted Crewman': optimize(synthesisSrc('corrupted_crewman')),
  'Corrupted Heavy Gunner': optimize(synthesisSrc('corrupted_heavy_gunner')),
  'Corrupted Lancer': optimize(synthesisSrc('corrupted_lancer')),
  'Corrupted Nullifier': optimize(synthesisSrc('corrupted_nullifier')),
  Crawler: optimize(synthesisSrc('crawler')),
  'Crewman [Research]': optimize(synthesisSrc('crewman')),
  'Drahk Master': optimize(synthesisSrc('drahk_master')),
  'Elite Crewman': optimize(synthesisSrc('elite_crewman')),
  Eviscerator: optimize(synthesisSrc('eviscerator')),
  'Fusion MOA': optimize(synthesisSrc('fusion_moa')),
  'Guardsman [Research]': optimize(synthesisSrc('guardsman')),
  'Heavy Gunner': optimize(synthesisSrc('heavy_gunner')),
  Hellion: optimize(synthesisSrc('hellion')),
  'Lancer [Research]': optimize(synthesisSrc('lancer')),
  Leaper: optimize(synthesisSrc('leaper')),
  MOA: optimize(synthesisSrc('moa')),
  Napalm: optimize(synthesisSrc('napalm')),
  'Nullifier Crewman': optimize(synthesisSrc('nullifier_crewman')),
  'Runner [Research]': optimize(synthesisSrc('runner')),
  Scorch: optimize(synthesisSrc('scorch')),
  Scorpion: optimize(synthesisSrc('scorpion')),
  'Seeker / Frontier Seeker': optimize(synthesisSrc('seeker')),
  'Shield Lancer': optimize(synthesisSrc('shield_lancer')),
  'Swarm-Mutalist MOA': optimize(synthesisSrc('swarm-mutalist_moa')),
  Trooper: optimize(synthesisSrc('trooper')),
};

type SynthesisImgProps = {
  name: string;
  image: string;
  size?: number;
  tooltip?: boolean;
};

const SynthesisImg: FC<SynthesisImgProps> = ({ name, image, size = 32, tooltip = true }: SynthesisImgProps) => {
  const preview = useSynthesisPreview();
  const fullSrc = image ? synthesisSrc(image) : null;
  const thumbSrc = fullSrc ? optimize(fullSrc) : imgs[name];

  if (!thumbSrc) return null;

  const openPreview = (target: HTMLElement) => {
    if (!tooltip || !preview || !fullSrc) return;
    preview.open(name, fullSrc, target);
  };

  return (
    <span
      className='hub-async-thumb-trigger synth-portrait-trigger'
      onMouseEnter={(event) => openPreview(event.currentTarget)}
      onMouseLeave={() => preview?.close()}
      onFocus={(event) => openPreview(event.currentTarget)}
      onBlur={() => preview?.close()}
    >
      <HubImg
        src={thumbSrc}
        name={name}
        width={String(size)}
        height={String(size)}
        className='synth-portrait'
        style={{ width: size, height: size }}
        showTitle={false}
      />
    </span>
  );
};

export default SynthesisImg;
