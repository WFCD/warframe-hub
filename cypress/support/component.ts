import './commands';
import '@/lib/i18n';
import '@/styles/hub-vendor.css';
import '@/styles/hub.scss';
import React, { type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { mount as cypressMount, type MountOptions, type MountReturn } from 'cypress/react';
import i18n from '@/lib/i18n';
import PrefsProvider from '@/lib/providers/PrefsProvider';

const HubTestProviders = ({ children }: { children: ReactNode }) =>
  React.createElement(I18nextProvider, { i18n }, React.createElement(PrefsProvider, null, children));

Cypress.Commands.add(
  'mount',
  (component: ReactNode, options: MountOptions = {}): Cypress.Chainable<MountReturn> =>
    cypressMount(React.createElement(HubTestProviders, null, component), options)
);
