import {parseValidKeys, validKeys} from './consoleMethods';

it('extracts only the valid keys from a theme', () => {
  const theme = {
    name: 'T',
    black: '1',
    red: '2',
    green: '3',
    yellow: '4',
    blue: '5',
    purple: '6',
    cyan: '7',
    white: '8',
    brightBlack: '9',
    brightRed: '10',
    brightGreen: '11',
    brightYellow: '12',
    brightBlue: '13',
    brightPurple: '14',
    brightCyan: '15',
    brightWhite: '16',
    background: '17',
    foreground: '18',
    extraneous: 'should be dropped',
    meta: {isDark: true},
  };
  const result = parseValidKeys(theme);
  validKeys.forEach((key) => {
    if (key !== 'selectionBackground' && key !== 'cursorColor') {
      expect(result[key]).toBe(theme[key]);
    }
  });
  expect(result).not.toHaveProperty('extraneous');
  expect(result).not.toHaveProperty('meta');
});
