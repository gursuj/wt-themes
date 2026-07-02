import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ConsoleTest from './ConsoleTest';
import codeblocks from './codeblocks';

const darkTheme = {
  name: 'Test Dark',
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
  background: '#000000',
  foreground: '#ffffff',
  meta: {
    isDark: true,
  },
};

it('renders the first codeblock tab by default without the light class', () => {
  const {getByTestId, container} = render(<ConsoleTest theme={darkTheme} />);
  expect(getByTestId('consoletest')).toBeInTheDocument();
  expect(getByTestId('markup')).toBeInTheDocument();
  const radios = Array.from(container.querySelectorAll('input[type="radio"]'));
  const checkedRadio = radios.find((el) => el.checked);
  expect(checkedRadio.value).toBe(codeblocks[0].id);
});

it('applies the light class when the theme is not dark', () => {
  const lightTheme = {...darkTheme, meta: {isDark: false}};
  const {container} = render(<ConsoleTest theme={lightTheme} />);
  const terminal = container.firstChild.firstChild;
  expect(terminal.className).toEqual(expect.stringContaining('light'));
});

it('switches tabs when a different radio is selected', () => {
  const {container} = render(<ConsoleTest theme={darkTheme} />);
  const secondTab = codeblocks[1];
  const radios = Array.from(container.querySelectorAll('input[type="radio"]'));
  const radio = radios.find((el) => el.value === secondTab.id);
  fireEvent.click(radio);
  expect(radio.checked).toBe(true);
});

it('shows a blank footer when the theme has no credits', () => {
  const {queryByTestId} = render(<ConsoleTest theme={darkTheme} />);
  expect(queryByTestId('credit')).toBeNull();
});

it('lists each credit source when the theme has credits', () => {
  const themeWithCredits = {
    ...darkTheme,
    meta: {
      isDark: true,
      credits: [{name: 'Source One', link: 'https://example.com/one'}],
    },
  };
  const {getByTestId, getByText} = render(
    <ConsoleTest theme={themeWithCredits} />
  );
  expect(getByTestId('credit')).toBeInTheDocument();
  expect(getByText('Source One')).toHaveAttribute(
    'href',
    'https://example.com/one'
  );
});
