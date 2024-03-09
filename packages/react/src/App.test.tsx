import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SubstrateProvider } from './substrate/SubstrateContext';
import App from './App';

it('renders learn react link', () => {
  render(
    <SubstrateProvider chain="polkadot" appName="Your App">
      <App />
    </SubstrateProvider>
  );
  const linkElement = screen.getByText(/learn polkadot/i);
  expect(linkElement).toBeInTheDocument();
});