'use client';

import { useEffect, useMemo, useState, type FC, type SyntheticEvent } from 'react';
import HubSwitch from '@/components/ui/HubSwitch';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useTranslation } from 'react-i18next';
import { usePrefs } from '@/lib/providers/PrefsProvider';
import HubPanelWrap from '@/components/panels/shared/HubPanelWrap';
import { getLocalizedNews, type HubNewsItem } from '@/lib/news/newsContent';
import { getNewsImageSrc, NEWS_PLACEHOLDER_SRC } from '@/lib/news/newsImage';
import './NewsPanel.component.scss';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

type NewsPanelProps = {
  news: HubNewsItem[];
};

const NewsPanel: FC<NewsPanelProps> = ({ news }: NewsPanelProps) => {
  const { t } = useTranslation();
  const { state, dispatch } = usePrefs();
  const headertext = t('news.header');
  const locale = state.locale;
  const cycle = state.components.news?.autoCycle ?? false;

  const [activeElemIndex, setActiveElemIndex] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const filteredNews = useMemo(() => getLocalizedNews(news, locale), [news, locale]);

  useEffect(() => {
    dayjs.updateLocale('en', {
      relativeTime: {
        future: `${t('news.future')} %s:`,
        past: `%s ${t('news.past')}:`,
        s: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1m',
        MM: '%dm',
        y: '1y',
        yy: '%dy',
      },
    });
  }, [t]);

  useEffect(() => {
    const id = setInterval(() => {
      if (cycle) setActiveElemIndex((i) => i + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [cycle]);

  const onNewsImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.src = NEWS_PLACEHOLDER_SRC;
  };

  const newsTitle = (newsitem: HubNewsItem) => {
    const label = newsitem.translations[locale];
    if (newsitem.startDate && newsitem.endDate) {
      if (dayjs(newsitem.startDate).unix() > dayjs().unix()) {
        return { time: dayjs(newsitem.startDate).fromNow(), label };
      }
      if (dayjs(newsitem.endDate).unix() > dayjs().unix()) {
        return { time: `${t('news.live')}:`, label };
      }
      return { time: dayjs(newsitem.endDate).fromNow(), label };
    }
    return { time: dayjs(newsitem.date).fromNow(), label };
  };

  const carouselIndex = cycle ? activeElemIndex % Math.max(filteredNews.length, 1) : (hover ?? 0);

  return (
    <HubPanelWrap title={headertext} className='news'>
      <div className='hub-news'>
        <div className='hub-news-carousel'>
          <div className='hub-news-carousel-viewport'>
            {filteredNews.map((newsitem, index) => {
              const isActive = index === carouselIndex;
              return (
                <img
                  key={`${newsitem.id}-img`}
                  alt={newsitem.message}
                  className={`hub-news-slide-image${isActive ? ' is-active' : ''}`}
                  src={getNewsImageSrc(newsitem.imageLink)}
                  width={404}
                  height={110}
                  fetchPriority={isActive ? 'high' : 'low'}
                  loading={isActive ? 'eager' : 'lazy'}
                  decoding='async'
                  onError={onNewsImageError}
                />
              );
            })}
          </div>
        </div>

        <ul className='hub-news-list'>
          {filteredNews.map((newsitem, index) => {
            const { time, label } = newsTitle(newsitem);
            const isActive = cycle && index === carouselIndex;
            const isHover = hover === index;

            return (
              <li key={`${newsitem.id}-li`} data-news-item={newsitem.id}>
                <a
                  href={newsitem.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`hub-news-item${isActive ? ' is-active' : ''}${isHover ? ' is-hover' : ''}`}
                  onMouseEnter={() => setHover(index)}
                  onFocus={() => setHover(index)}
                >
                  <span className='hub-news-time'>{time}</span>
                  <span className='hub-news-label'>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className='hub-news-footer'>
          <HubSwitch
            id='news-cycle-checkbox'
            className='hub-news-autocycle'
            label={t('news.autoprogress')}
            checked={cycle}
            onChange={(isSelected) => dispatch({ type: 'SET_NEWS_AUTO_CYCLE', payload: isSelected })}
          />
        </div>
      </div>
    </HubPanelWrap>
  );
};

export default NewsPanel;
