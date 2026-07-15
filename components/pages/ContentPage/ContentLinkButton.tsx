'use client';

import type { AriaAttributes, FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

type ContentLinkButtonProps = {
  href: string;
  external?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  tone?: 'button' | 'header';
  className?: string;
  children: ReactNode;
} & Pick<AriaAttributes, 'aria-label'>;

const ContentLinkButton: FC<ContentLinkButtonProps> = ({
  href,
  external = false,
  variant = 'secondary',
  size = 'md',
  tone = 'button',
  className,
  children,
  'aria-label': ariaLabel,
}: ContentLinkButtonProps) => {
  const router = useRouter();

  const navigate = () => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    router.push(href);
  };

  if (tone === 'header') {
    return (
      <button
        type='button'
        className={['hub-content-header-link', className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
        onClick={navigate}
      >
        {children}
      </button>
    );
  }

  const cls = ['hub-content-btn', className].filter(Boolean).join(' ');

  return (
    <Button variant={variant} size={size} className={cls} aria-label={ariaLabel} onPress={navigate}>
      {children}
    </Button>
  );
};

export default ContentLinkButton;
