'use client';
import './HubRadioGroup.component.scss';

import type { FC, ReactNode } from 'react';
import { Label, Radio, RadioGroup } from '@heroui/react';

type HubRadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  layout?: 'stack' | 'tiles';
  'aria-label'?: string;
  children: ReactNode;
};

type HubRadioOptionProps = {
  value: string;
  label: ReactNode;
  id?: string;
};

export const HubRadioOption: FC<HubRadioOptionProps> = ({ value, label, id }: HubRadioOptionProps) => (
  <Radio value={value} id={id} className='hub-radio'>
    <Radio.Content>
      <Radio.Control>
        <Radio.Indicator />
      </Radio.Control>
      <Label>{label}</Label>
    </Radio.Content>
  </Radio>
);

const HubRadioGroup: FC<HubRadioGroupProps> = ({
  value,
  onChange,
  name,
  id,
  className,
  layout = 'stack',
  'aria-label': ariaLabel,
  children,
}: HubRadioGroupProps) => (
  <RadioGroup
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    aria-label={ariaLabel}
    className={['hub-radio-group', `hub-radio-group--${layout}`, className].filter(Boolean).join(' ')}
  >
    {children}
  </RadioGroup>
);

export default HubRadioGroup;
