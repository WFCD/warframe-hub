'use client';
import './Navbar.component.scss';

import { useEffect, useState, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Dropdown } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { usePageChromeContext } from '@/lib/providers/PageChromeProvider';

type Props = {
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
};

type MenuLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  onNavigate?: () => void;
};

const MenuLink: FC<MenuLinkProps> = ({ href, children, external, onNavigate }: MenuLinkProps) => {
  const pathname = usePathname();
  const className = 'hub-nav-menu-link';
  const isActive = !external && (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)));

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-current={isActive ? 'page' : undefined} onClick={onNavigate}>
      {children}
    </Link>
  );
};

type MenuSectionProps = {
  title?: ReactNode;
  children: ReactNode;
};

const MenuSection: FC<MenuSectionProps> = ({ title, children }: MenuSectionProps) => (
  <div className="hub-nav-section">
    {title ? <div className="hub-nav-section-title">{title}</div> : null}
    <div className="hub-nav-section-links">{children}</div>
  </div>
);

type NavIconItemProps = {
  icon: ReactNode;
  label: ReactNode;
};

const NavIconItem: FC<NavIconItemProps> = ({ icon, label }: NavIconItemProps) => (
  <>
    <span className="hub-nav-icon" aria-hidden>
      {icon}
    </span>
    <span className="hub-nav-flyout" aria-hidden>
      {label}
    </span>
  </>
);

type NavIconLinkProps = {
  href: string;
  icon: ReactNode;
  label: ReactNode;
  onNavigate?: () => void;
  external?: boolean;
  isActive?: boolean;
};

const NavIconLink: FC<NavIconLinkProps> = ({ href, icon, label, onNavigate, external, isActive }: NavIconLinkProps) => {
  const textLabel = typeof label === 'string' ? label : undefined;
  const content = <NavIconItem icon={icon} label={label} />;

  if (external) {
    return (
      <a
        className="hub-nav-link hub-nav-icon-item"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={textLabel}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      className="hub-nav-link hub-nav-icon-item"
      href={href}
      aria-label={textLabel}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
};

type NavDropdownProps = {
  icon: ReactNode;
  label: ReactNode;
  children: ReactNode;
};

const NavDropdown: FC<NavDropdownProps> = ({ icon, label, children }: NavDropdownProps) => {
  const textLabel = typeof label === 'string' ? label : undefined;

  return (
    <Dropdown>
      <Dropdown.Trigger
        className="hub-nav-link hub-nav-dropdown-trigger hub-nav-icon-item"
        style={{ boxShadow: 'none', outline: 'none' }}
        aria-label={textLabel}
      >
        <NavIconItem icon={icon} label={label} />
        <i className="fas fa-chevron-down hub-nav-chevron" aria-hidden />
      </Dropdown.Trigger>
      <Dropdown.Popover className="hub-nav-dropdown-popover" placement="bottom start">
        <div className="hub-nav-popover">{children}</div>
      </Dropdown.Popover>
    </Dropdown>
  );
};

type NavIconButtonProps = {
  icon: ReactNode;
  label: ReactNode;
  onPress: () => void;
};

const NavIconButton: FC<NavIconButtonProps> = ({ icon, label, onPress }: NavIconButtonProps) => {
  const textLabel = typeof label === 'string' ? label : undefined;

  return (
    <Button
      variant="light"
      className="hub-nav-icon-btn hub-nav-icon-item"
      aria-label={textLabel}
      onPress={onPress}
    >
      <NavIconItem icon={icon} label={label} />
    </Button>
  );
};

const HubNavbar: FC<Props> = ({ onOpenSettings, onOpenAbout }: Props) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const pageChrome = usePageChromeContext();
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);
  const isTimersActive = pathname === '/';

  useEffect(() => {
    const clearNavbarFocus = () => {
      document.querySelectorAll<HTMLElement>('.hub-navbar [data-focus-visible], .hub-navbar [data-focused]').forEach((el) => {
        el.removeAttribute('data-focus-visible');
        el.removeAttribute('data-focused');
      });
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest('.hub-navbar')) {
        active.blur();
      }
    };

    clearNavbarFocus();
    const raf = requestAnimationFrame(() => {
      clearNavbarFocus();
      requestAnimationFrame(clearNavbarFocus);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="hub-chrome-shell hub-navbar-shell">
      <header className="hub-navbar">
        <div className="hub-navbar-inner">
          <Link
            className="hub-navbar-brand hub-nav-icon-item"
            href="/"
            aria-label={t('nav.brand')}
            aria-current={isTimersActive ? 'page' : undefined}
            onClick={closeMenu}
          >
            <img className="hub-nav-icon hub-nav-brand-icon" src="/icon.png" alt="" height={40} />
            <span className="hub-nav-flyout" aria-hidden>
              {t('nav.brand')}
            </span>
          </Link>

          <Button
            variant="light"
            className="hub-nav-toggle"
            aria-controls="hub-nav-collapse"
            aria-expanded={expanded}
            aria-label={t('nav.toggleNav')}
            onPress={() => setExpanded((open) => !open)}
          >
            <i className="fas fa-bars" aria-hidden />
          </Button>

          <div id="hub-nav-collapse" className={`hub-navbar-collapse${expanded ? ' is-open' : ''}`}>
            <nav className="hub-navbar-start" aria-label={t('nav.mainAria')}>
              <NavIconLink
                href="/"
                icon={<i className="fas fa-clock" />}
                label={t('nav.timers')}
                isActive={isTimersActive}
                onNavigate={closeMenu}
              />

              <NavDropdown icon={<i className="fas fa-globe" />} label={t('nav.ow')}>
                <MenuSection>
                  <MenuLink href="/ow/fish/howto" onNavigate={closeMenu}>
                    <i className="fas fa-info faIcon" /> {t('nav.howto')}
                  </MenuLink>
                </MenuSection>
                <MenuSection title={<><i className="fas fa-mountain faIcon" /> {t('nav.owearth')}</>}>
                  <MenuLink href="/poe/map" onNavigate={closeMenu}>
                    <i className="fas fa-map-marker-alt faIcon" /> {t('nav.map')}
                  </MenuLink>
                  <MenuLink href="/poe/fish" onNavigate={closeMenu}>
                    <i className="fas fa-fish faIcon" /> {t('nav.fish')}
                  </MenuLink>
                </MenuSection>
                <MenuSection title={<><i className="fas fa-icicles faIcon" /> {t('nav.owvenus')}</>}>
                  <MenuLink href="/vallis/map" onNavigate={closeMenu}>
                    <i className="fas fa-map-marker-alt faIcon" /> {t('nav.map')}
                  </MenuLink>
                  <MenuLink href="/vallis/fish" onNavigate={closeMenu}>
                    <i className="fas fa-fish faIcon" /> {t('nav.fish')}
                  </MenuLink>
                </MenuSection>
                <MenuSection title={<><i className="fas fa-biohazard faIcon" /> {t('nav.owdeimos')}</>}>
                  <MenuLink href="/deimos/map" onNavigate={closeMenu}>
                    <i className="fas fa-map-marker-alt faIcon" /> {t('nav.map')}
                  </MenuLink>
                  <MenuLink href="/deimos/fish" onNavigate={closeMenu}>
                    <i className="fas fa-fish faIcon" /> {t('nav.fish')}
                  </MenuLink>
                </MenuSection>
              </NavDropdown>

              <NavDropdown icon={<i className="fas fa-tools" />} label={t('nav.extras')}>
                <MenuLink href="/riven/data" onNavigate={closeMenu}>
                  <i className="fas fa-database faIcon" /> {t('nav.riven')}
                </MenuLink>
                <MenuLink href="/synthesis" onNavigate={closeMenu}>
                  <i className="fas fa-camera faIcon" /> {t('nav.synth')}
                </MenuLink>
              </NavDropdown>

              <NavDropdown icon={<i className="fas fa-terminal" />} label={t('nav.projects')}>
                <MenuLink href="https://drops.warframestat.us" external onNavigate={closeMenu}>
                  <i className="fas fa-download faIcon" /> {t('nav.drops')}
                </MenuLink>
                <MenuLink href="https://genesis.warframestat.us" external onNavigate={closeMenu}>
                  <i className="fas fa-robot faIcon" /> {t('nav.genesis')}
                </MenuLink>
                <MenuLink href="https://docs.warframestat.us" external onNavigate={closeMenu}>
                  <i className="fas fa-terminal faIcon" /> {t('nav.docs')}
                </MenuLink>
                <MenuLink href="https://warframestat.us" external onNavigate={closeMenu}>
                  <i className="fas fa-tachometer-alt faIcon" /> {t('nav.status')}
                </MenuLink>
                <MenuLink href="https://old-hub.warframestat.us" external onNavigate={closeMenu}>
                  <i className="fas fa-scroll faIcon" /> {t('nav.old')}
                </MenuLink>
              </NavDropdown>
            </nav>

            {pageChrome?.config && pageChrome.collapsed ? (
              <div className="hub-navbar-page-chrome">
                {pageChrome.config.label ? (
                  <span className="hub-navbar-page-chrome__label">{pageChrome.config.label}</span>
                ) : null}
                <div className="hub-navbar-page-chrome__controls">{pageChrome.config.controls}</div>
              </div>
            ) : null}

            <nav className="hub-navbar-end" aria-label={t('nav.supportAria')}>
              <NavIconLink
                href="https://discord.gg/jGZxH9f"
                icon={<i className="fab fa-discord" />}
                label={t('nav.discord')}
                external
                onNavigate={closeMenu}
              />
              <NavIconButton
                icon={<i className="fas fa-info" />}
                label={t('nav.info')}
                onPress={() => {
                  closeMenu();
                  onOpenAbout?.();
                }}
              />
              <NavIconButton
                icon={<i className="fas fa-cog" />}
                label={t('nav.settings')}
                onPress={() => {
                  closeMenu();
                  onOpenSettings?.();
                }}
              />
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HubNavbar;
