'use client';
import './HubSwitch.component.scss';

import type { FC, ReactNode } from 'react';
import { Label, Switch } from '@heroui/react';
import { hubTestClickHandler } from '@/lib/test/hubTestInterop';

type HubSwitchProps = {
  id?: string;
  label: ReactNode;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (checked: boolean) => void;
};

const HubSwitch: FC<HubSwitchProps> = ({
  id,
  label,
  checked = false,
  className,
  disabled,
  size = 'sm',
  onChange,
}: HubSwitchProps) => (
  <Switch
    id={id}
    className={className ? `hub-switch ${className}` : 'hub-switch'}
    size={size}
    isSelected={checked}
    isDisabled={disabled}
    onChange={onChange}
    {...hubTestClickHandler(() => onChange?.(!checked))}
  >
    <Switch.Content>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Label>{label}</Label>
    </Switch.Content>
  </Switch>
);

export default HubSwitch;
