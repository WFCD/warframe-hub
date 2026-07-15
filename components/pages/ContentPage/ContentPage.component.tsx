'use client';

import './ContentPage.component.scss';

import { useCallback, useLayoutEffect, useRef, type FC, type ReactNode } from 'react';
import { usePageChromeContext } from '@/lib/providers/PageChromeProvider';

type ContentPageProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  notice?: ReactNode;
  pageChrome?: ReactNode;
  pageChromeLabel?: ReactNode;
  /** default: padded data page; article: prose guide; map: full-bleed map */
  variant?: 'default' | 'article' | 'map';
  children: ReactNode;
};

const ContentPage: FC<ContentPageProps> = ({
  title,
  subtitle,
  actions,
  toolbar,
  notice,
  pageChrome,
  pageChromeLabel,
  variant = 'default',
  children,
}: ContentPageProps) => {
  const hasHeader = Boolean(title || subtitle || actions);
  const pageChromeCtx = usePageChromeContext();
  const chromeCollapsed = pageChromeCtx?.collapsed ?? false;
  const registerRef = useRef(pageChromeCtx?.register);
  const unregisterRef = useRef(pageChromeCtx?.unregister);
  const setAnchorRef = useRef(pageChromeCtx?.setAnchorEl);
  registerRef.current = pageChromeCtx?.register;
  unregisterRef.current = pageChromeCtx?.unregister;
  setAnchorRef.current = pageChromeCtx?.setAnchorEl;

  const anchorRef = useCallback((el: HTMLDivElement | null) => {
    setAnchorRef.current?.(el);
  }, []);

  useLayoutEffect(() => {
    if (!pageChrome) {
      unregisterRef.current?.();
      return;
    }

    registerRef.current?.({ label: pageChromeLabel, controls: pageChrome });
  }, [pageChrome, pageChromeLabel]);

  useLayoutEffect(
    () => () => {
      unregisterRef.current?.();
    },
    []
  );

  return (
    <main
      className={[
        'hub-content-page',
        variant === 'article' ? 'hub-content-page--article' : '',
        variant === 'map' ? 'hub-content-page--map' : '',
        pageChrome ? 'hub-content-page--has-chrome' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className='hub-chrome-shell hub-content-page__shell'>
        {hasHeader ? (
          <header className='hub-content-page__header'>
            <div className='hub-content-page__heading'>
              {title ? <h1 className='hub-content-page__title'>{title}</h1> : null}
              {subtitle ? <p className='hub-content-page__subtitle'>{subtitle}</p> : null}
            </div>
            {actions ? <div className='hub-content-page__actions'>{actions}</div> : null}
          </header>
        ) : null}
        {pageChrome ? (
          <div ref={anchorRef} className='hub-page-chrome hub-panel-surface'>
            {pageChromeLabel ? <div className='hub-page-chrome__label'>{pageChromeLabel}</div> : null}
            <div className='hub-page-chrome__controls'>{!chromeCollapsed ? pageChrome : null}</div>
          </div>
        ) : null}
        {toolbar ? <div className='hub-content-page__toolbar'>{toolbar}</div> : null}
        {notice ? <div className='hub-content-page__notice'>{notice}</div> : null}
        <div className='hub-content-page__body'>{children}</div>
      </div>
    </main>
  );
};

export default ContentPage;
