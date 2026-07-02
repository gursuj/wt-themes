import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ColourTest, {backgroundKeys, textKeys} from './ColourTest';

const baseTheme = {
  name: 'Test Theme',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  yellow: '#ffff00',
  blue: '#0000ff',
  purple: '#ff00ff',
  cyan: '#00ffff',
  white: '#ffffff',
  brightBlack: '#111111',
  brightRed: '#ff1111',
  brightGreen: '#11ff11',
  brightYellow: '#ffff11',
  brightBlue: '#1111ff',
  brightPurple: '#ff11ff',
  brightCyan: '#11ffff',
  brightWhite: '#eeeeee',
  background: '#ffffff',
  foreground: '#000000',
  meta: {
    isDark: false,
  },
};

it('exports the expected background and text keys', () => {
  expect(backgroundKeys).toContain('background');
  expect(textKeys).toContain('brightWhite');
});

it('renders a swatch cell for every text/background combination', () => {
  const {getByTestId} = render(<ColourTest theme={baseTheme} />);
  const matrix = getByTestId('colourtest');
  expect(matrix.childNodes.length).toBe(
    textKeys.length * backgroundKeys.length
  );
});

it('shows a blank credit line when the theme has no credits', () => {
  const {getByTestId, queryByTestId} = render(<ColourTest theme={baseTheme} />);
  expect(queryByTestId('credit')).toBeNull();
  expect(getByTestId('colourtest')).toBeInTheDocument();
});

it('lists each credit source when the theme has credits', () => {
  const themeWithCredits = {
    ...baseTheme,
    meta: {
      isDark: false,
      credits: [
        {name: 'Source One', link: 'https://example.com/one'},
        {name: 'Source Two', link: 'https://example.com/two'},
      ],
    },
  };
  const {getByTestId, getByText} = render(
    <ColourTest theme={themeWithCredits} />
  );
  expect(getByTestId('credit')).toBeInTheDocument();
  expect(getByText('Source One')).toHaveAttribute(
    'href',
    'https://example.com/one'
  );
  expect(getByText('Source Two')).toHaveAttribute(
    'href',
    'https://example.com/two'
  );
});
