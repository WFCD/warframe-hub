'use client';

import { useEffect, useRef, type FC, type ReactNode } from 'react';

type GuideContentSectionProps = {
  id?: string;
  heading?: ReactNode;
  active: string;
  cetus: ReactNode;
  vallis: ReactNode;
};

const GuideContentSection: FC<GuideContentSectionProps> = ({
  id,
  heading,
  active,
  cetus,
  vallis,
}: GuideContentSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!id || window.location.hash !== `#${id}`) return;
    sectionRef.current?.scrollIntoView({ block: 'start' });
  }, [id]);

  return (
    <section ref={sectionRef} id={id} className='hub-content-guide-section'>
      {heading ? <div className='hub-content-guide-section__heading'>{heading}</div> : null}
      <div className='hub-content-guide-section__content'>{active === 'cetus' ? cetus : vallis}</div>
    </section>
  );
};

export default GuideContentSection;
