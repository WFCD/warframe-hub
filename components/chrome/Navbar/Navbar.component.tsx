'use client';
import './Navbar.component.scss';

import { useEffect, useState, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Dropdown, Tooltip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { usePageChromeContext } from '@/lib/providers/PageChromeProvider';
import { cdn } from '@/lib/shared/utilities';

type Props = {
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
};

function useMinWidth(px: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [px]);

  return matches;
}

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
  showLabel?: boolean;
};

const NavIconItem: FC<NavIconItemProps> = ({ icon, label, showLabel = true }: NavIconItemProps) => (
  <>
    <span className="hub-nav-icon" aria-hidden>
      {icon}
    </span>
    {showLabel ? <span className="hub-nav-label">{label}</span> : null}
  </>
);

type NavTooltipProps = {
  label: string;
  children: ReactNode;
};

const NavTooltip: FC<NavTooltipProps> = ({ label, children }: NavTooltipProps) => (
  <Tooltip delay={400}>
    <Tooltip.Trigger className="hub-nav-tooltip-trigger">{children}</Tooltip.Trigger>
    <Tooltip.Content placement="bottom">
      <span className="hub-nav-tooltip-text">{label}</span>
    </Tooltip.Content>
  </Tooltip>
);

type NavGlyphProps = {
  src: string;
};

const NavGlyph: FC<NavGlyphProps> = ({ src }: NavGlyphProps) => (
  <img className="hub-nav-glyph" src={src} alt="" aria-hidden />
);

type NavIconLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  onNavigate?: () => void;
  external?: boolean;
  isActive?: boolean;
  showLabel?: boolean;
  useTooltip?: boolean;
};

const NavIconLink: FC<NavIconLinkProps> = ({
  href,
  icon,
  label,
  onNavigate,
  external,
  isActive,
  showLabel = true,
  useTooltip = false,
}: NavIconLinkProps) => {
  const content = <NavIconItem icon={icon} label={label} showLabel={showLabel} />;
  const className = 'hub-nav-link hub-nav-icon-item';

  const link = external ? (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onNavigate}
    >
      {content}
    </a>
  ) : (
    <Link
      className={className}
      href={href}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );

  if (useTooltip) {
    return <NavTooltip label={label}>{link}</NavTooltip>;
  }

  return link;
};

type NavDropdownProps = {
  icon: ReactNode;
  label: string;
  showLabel?: boolean;
  useTooltip?: boolean;
  isActive?: boolean;
  children: ReactNode;
};

const NavDropdown: FC<NavDropdownProps> = ({
  icon,
  label,
  showLabel = true,
  useTooltip = false,
  isActive = false,
  children,
}: NavDropdownProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdown = (
    <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
      <Dropdown.Trigger
        className="hub-nav-link hub-nav-dropdown-trigger hub-nav-icon-item"
        style={{ boxShadow: 'none', outline: 'none' }}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        <NavIconItem icon={icon} label={label} showLabel={showLabel} />
        {showLabel ? <i className="fas fa-chevron-down hub-nav-chevron" aria-hidden /> : null}
      </Dropdown.Trigger>
      <Dropdown.Popover className="hub-nav-dropdown-popover" placement="bottom start">
        <div className="hub-nav-popover">{children}</div>
      </Dropdown.Popover>
    </Dropdown>
  );

  if (useTooltip) {
    return (
      <Tooltip delay={400} isDisabled={menuOpen}>
        {dropdown}
        <Tooltip.Content placement="bottom">
          <span className="hub-nav-tooltip-text">{label}</span>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return dropdown;
};

type NavIconButtonProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  showLabel?: boolean;
  useTooltip?: boolean;
};

const NavIconButton: FC<NavIconButtonProps> = ({
  icon,
  label,
  onPress,
  showLabel = true,
  useTooltip = false,
}: NavIconButtonProps) => {
  const button = (
    <Button variant="light" className="hub-nav-icon-btn hub-nav-icon-item" aria-label={label} onPress={onPress}>
      <NavIconItem icon={icon} label={label} showLabel={showLabel} />
    </Button>
  );

  if (useTooltip) {
    return <NavTooltip label={label}>{button}</NavTooltip>;
  }

  return button;
};

const HubNavbar: FC<Props> = ({ onOpenSettings, onOpenAbout }: Props) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const pageChrome = usePageChromeContext();
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMinWidth(768);
  const isLarge = useMinWidth(1024);
  const closeMenu = () => setExpanded(false);
  const isTimersActive = pathname === '/';
  const isOwActive = ['/ow', '/poe', '/vallis', '/deimos'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isRivenActive = pathname === '/riven/data' || pathname.startsWith('/riven/');
  const isSynthActive = pathname === '/synthesis' || pathname.startsWith('/synthesis/');

  const leftShowLabel = !isDesktop || isLarge;
  const leftUseTooltip = isDesktop && !isLarge;
  const rightShowLabel = !isDesktop;
  const rightUseTooltip = isDesktop;

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
            className="hub-navbar-brand"
            href="/"
            aria-label={t('nav.brand')}
            aria-current={isTimersActive ? 'page' : undefined}
            onClick={closeMenu}
          >
            <img className="hub-nav-icon hub-nav-brand-icon" src="/icon.png" alt="" height={40} />
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
                showLabel={leftShowLabel}
                useTooltip={leftUseTooltip}
              />

              <NavDropdown
                icon={<i className="fas fa-globe" />}
                label={t('nav.ow')}
                showLabel={leftShowLabel}
                useTooltip={leftUseTooltip}
                isActive={isOwActive}
              >
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

              <NavIconLink
                href="/riven/data"
                icon={<NavGlyph src={cdn('svg/menu/RivenMod.svg')} />}
                label={t('nav.riven')}
                isActive={isRivenActive}
                onNavigate={closeMenu}
                showLabel={leftShowLabel}
                useTooltip={leftUseTooltip}
              />

              <NavIconLink
                href="/synthesis"
                icon={<NavGlyph src={cdn('svg/simaris.svg')} />}
                label={t('nav.synth')}
                isActive={isSynthActive}
                onNavigate={closeMenu}
                showLabel={leftShowLabel}
                useTooltip={leftUseTooltip}
              />

              <NavDropdown
                icon={<i className="fas fa-terminal" />}
                label={t('nav.projects')}
                showLabel={leftShowLabel}
                useTooltip={leftUseTooltip}
              >
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
                showLabel={rightShowLabel}
                useTooltip={rightUseTooltip}
              />
              <NavIconButton
                icon={<i className="fas fa-info" />}
                label={t('nav.info')}
                showLabel={rightShowLabel}
                useTooltip={rightUseTooltip}
                onPress={() => {
                  closeMenu();
                  onOpenAbout?.();
                }}
              />
              <NavIconButton
                icon={<i className="fas fa-cog" />}
                label={t('nav.settings')}
                showLabel={rightShowLabel}
                useTooltip={rightUseTooltip}
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
