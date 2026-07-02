import React from 'react';
import {render, fireEvent, act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {returnInitialTheme, shortcuts} from './homeMethods';
import {getRandomColour, homeReducer, initialState} from './homeState';
import Home from './Home';
import customColourSchemes from '../../custom-colour-schemes.json';
import credits from '../../credits.json';

beforeEach(() => {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: {writeText: jest.fn().mockResolvedValue(undefined)},
    configurable: true,
  });
});

// theres 3 darks themes and 2 light themes
const schemes = [
  {
    name: 'Duotone Dark',
    black: '#1f1d27',
    red: '#d9393e',
    green: '#2dcd73',
    yellow: '#d9b76e',
    blue: '#ffc284',
    purple: '#de8d40',
    cyan: '#2488ff',
    white: '#b7a1ff',
    brightBlack: '#353147',
    brightRed: '#d9393e',
    brightGreen: '#2dcd73',
    brightYellow: '#d9b76e',
    brightBlue: '#ffc284',
    brightPurple: '#de8d40',
    brightCyan: '#2488ff',
    brightWhite: '#eae5ff',
    background: '#1f1d27',
    foreground: '#b7a1ff',
    meta: {
      isDark: true,
    },
  },
  {
    name: '3024 Day',
    black: '#090300',
    red: '#db2d20',
    green: '#01a252',
    yellow: '#fded02',
    blue: '#01a0e4',
    purple: '#a16a94',
    cyan: '#b5e4f4',
    white: '#a5a2a2',
    brightBlack: '#5c5855',
    brightRed: '#e8bbd0',
    brightGreen: '#3a3432',
    brightYellow: '#4a4543',
    brightBlue: '#807d7c',
    brightPurple: '#d6d5d4',
    brightCyan: '#cdab53',
    brightWhite: '#f7f7f7',
    background: '#f7f7f7',
    foreground: '#4a4543',
    meta: {
      isDark: false,
    },
  },
  {
    name: 'Galaxy',
    black: '#000000',
    red: '#f9555f',
    green: '#21b089',
    yellow: '#fef02a',
    blue: '#589df6',
    purple: '#944d95',
    cyan: '#1f9ee7',
    white: '#bbbbbb',
    brightBlack: '#555555',
    brightRed: '#fa8c8f',
    brightGreen: '#35bb9a',
    brightYellow: '#ffff55',
    brightBlue: '#589df6',
    brightPurple: '#e75699',
    brightCyan: '#3979bc',
    brightWhite: '#ffffff',
    background: '#1d2837',
    foreground: '#ffffff',
    meta: {
      isDark: true,
    },
  },
  {
    name: 'Ubuntu',
    black: '#2e3436',
    red: '#cc0000',
    green: '#4e9a06',
    yellow: '#c4a000',
    blue: '#3465a4',
    purple: '#75507b',
    cyan: '#06989a',
    white: '#d3d7cf',
    brightBlack: '#555753',
    brightRed: '#ef2929',
    brightGreen: '#8ae234',
    brightYellow: '#fce94f',
    brightBlue: '#729fcf',
    brightPurple: '#ad7fa8',
    brightCyan: '#34e2e2',
    brightWhite: '#eeeeec',
    background: '#300a24',
    foreground: '#eeeeec',
    meta: {
      isDark: true,
    },
  },
  {
    name: 'Man Page',
    black: '#000000',
    red: '#cc0000',
    green: '#00a600',
    yellow: '#999900',
    blue: '#0000b2',
    purple: '#b200b2',
    cyan: '#00a6b2',
    white: '#cccccc',
    brightBlack: '#666666',
    brightRed: '#e50000',
    brightGreen: '#00d900',
    brightYellow: '#e5e500',
    brightBlue: '#0000ff',
    brightPurple: '#e500e5',
    brightCyan: '#00e5e5',
    brightWhite: '#e5e5e5',
    background: '#fef49c',
    foreground: '#000000',
    meta: {
      isDark: false,
    },
  },
];

xit('Renders the mobile App', async () => {
  window.resizeTo(375, 667);
  const {getByTestId, getByLabelText} = render(<Home />);
  const selectEl = getByLabelText(/change theme/i);
  expect(selectEl.value).toBe('Duotone Dark');
  expect(getByTestId('selected-title').textContent).toBe('Duotone Dark');
  // change the theme
  fireEvent.change(getByLabelText(/change theme/i), {
    target: {value: 'Galaxy'},
  });
  expect(getByLabelText(/change theme/i).value).toBe('Galaxy');
  // // wait for the child component to be rerendered, i think?
  expect(getByTestId('selected-title').textContent).toBe('Galaxy');
});

xit('Swaps between light and dark themes', async () => {
  const {getByTestId, getByLabelText} = render(<Home />);
  // await waitForElementToBeRemoved(() => getByText(/loading/i), 1000);
  expect(getByTestId('theme-list').childNodes.length).toBe(3);
  expect(getByTestId('selected-title').textContent).toBe('Duotone Dark');
  fireEvent.click(getByLabelText(/Light/i), {
    target: {value: 'LIGHT'},
  });
  expect(getByTestId('theme-list').childNodes.length).toBe(2);
  // when switching, app just gets first light theme
  expect(getByTestId('selected-title').textContent).toBe('3024 Day');
  fireEvent.click(getByLabelText(/Dark/i), {
    target: {value: 'DARK'},
  });
  expect(getByTestId('theme-list').childNodes.length).toBe(3);
  expect(getByTestId('selected-title').textContent).toBe('Duotone Dark');
});

// examples test the colours against the background
const goodContrast = {
  black: '#FFFFFF',
  red: '#FFFFFF',
  green: '#FFFFFF',
  yellow: '#FFFFFF',
  blue: '#2D818F',
  purple: '#FFFFFF',
  cyan: '#FFFFFF',
  white: '#FFFFFF',
  background: '#FFFFFF',
};

const badContrast = {
  black: '#58B9CA',
  red: '#58B9CA',
  green: '#58B9CA',
  yellow: '#58B9CA',
  blue: '#58B9CA',
  purple: '#58B9CA',
  cyan: '#58B9CA',
  white: '#58B9CA',
  background: '#FFFFFF',
};

it('should produce random colours', () => {
  expect(getRandomColour()).toBe('');
  // should be roughly 4.5 accessible
  expect(getRandomColour(goodContrast)).toBe('#2D818F');
  expect(getRandomColour(badContrast)).toBe('#58B9CA');
});

it('should return theme name from search params', () => {
  expect(returnInitialTheme('?theme=synthwave-everything')).toBe(
    'synthwave-everything'
  );
  expect(returnInitialTheme('?wrong=synthwave-everything')).toBe(null);
  expect(returnInitialTheme('')).toBe(null);
});

it('should select a theme from the filtered list on RANDOM action', () => {
  const darkThemes = schemes.filter((theme) => theme.meta.isDark);
  const state = {
    themes: schemes,
    filteredThemes: darkThemes,
    activeTheme: darkThemes[0].name,
    backgroundColour: darkThemes[0].background,
  };
  const randomSpy = jest.spyOn(Math, 'random');

  randomSpy.mockReturnValue(0);
  let newState = homeReducer(state, {type: 'RANDOM'});
  expect(newState.activeTheme).toBe(darkThemes[0].name);
  expect(newState.backgroundColour).toBe(darkThemes[0].background);

  randomSpy.mockReturnValue(0.99);
  const lastTheme = darkThemes[darkThemes.length - 1];
  newState = homeReducer(state, {type: 'RANDOM'});
  expect(newState.activeTheme).toBe(lastTheme.name);
  expect(newState.backgroundColour).toBe(lastTheme.background);

  randomSpy.mockRestore();
});

it('should dispatch a RANDOM action when the R key shortcut is pressed', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const handleShortcut = shortcuts(dispatch, themeselectRef);
  handleShortcut({code: 'KeyR'});
  expect(dispatch).toHaveBeenCalledWith({type: 'RANDOM'});
});

xit('should tab use keyboard to navigate', () => {
  // const {getByTestId, getByLabelText} = render(<Home themes={schemes} />);
});

it('should ensure custom-colour-schemes.json has correct keys', () => {
  const validkeys = {
    name: '',
    black: '',
    red: '',
    green: '',
    yellow: '',
    blue: '',
    purple: '',
    cyan: '',
    white: '',
    brightBlack: '',
    brightRed: '',
    brightGreen: '',
    brightYellow: '',
    brightBlue: '',
    brightPurple: '',
    brightCyan: '',
    brightWhite: '',
    background: '',
    foreground: '',
    cursorColor: '',
    selectionBackground: '',
  };
  customColourSchemes.map((customColourScheme) => {
    Object.keys(customColourScheme).forEach((key) => {
      expect(validkeys).toHaveProperty(key);
    });
    Object.keys(validkeys).forEach((key) => {
      if (key !== 'cursorColor' && key !== 'selectionBackground') {
        expect(customColourScheme).toHaveProperty(key);
      }
    });
  });
});

it('credits should have valid structure', () => {
  /*
   * const validSchema = {
   *   themeNames: [''],
   *   sources: [
   *     {
   *       name: '',
   *       link: '',
   *     },
   *   ],
   * };
   */
  credits.map((credit) => {
    expect(credit).toHaveProperty('themeNames');
    expect(credit).toHaveProperty('sources');
    expect(Array.isArray(credit.themeNames)).toBe(true);
    credit.themeNames.forEach((themename) => {
      expect(typeof themename === 'string').toBe(true);
    });
    credit.sources.forEach((source) => {
      expect(source).toHaveProperty('name');
      expect(source).toHaveProperty('link');
      expect(typeof source.name === 'string').toBe(true);
      expect(typeof source.link === 'string').toBe(true);
    });
  });
});

describe('homeReducer', () => {
  it('LOAD without an initialTheme defaults to the first dark theme', () => {
    const newState = homeReducer(
      {...initialState, themeShade: 'DARK'},
      {type: 'LOAD', themes: schemes}
    );
    expect(newState.filteredThemes.map((t) => t.name)).toEqual([
      'Duotone Dark',
      'Galaxy',
      'Ubuntu',
    ]);
    expect(newState.activeTheme).toBe('Duotone Dark');
  });

  it('LOAD with a matching initialTheme selects it and its shade', () => {
    const newState = homeReducer(initialState, {
      type: 'LOAD',
      themes: schemes,
      initialTheme: 'Galaxy',
    });
    expect(newState.activeTheme).toBe('Galaxy');
    expect(newState.themeShade).toBe('DARK');
    expect(newState.backgroundColour).toBe('#1d2837');
  });

  it('LOAD with an unmatched initialTheme leaves the filtered list untouched', () => {
    const newState = homeReducer(initialState, {
      type: 'LOAD',
      themes: schemes,
      initialTheme: 'Not A Real Theme',
    });
    expect(newState.filteredThemes).toEqual([]);
    expect(newState.activeTheme).toBe('');
  });

  it('SET updates the active theme and background', () => {
    const state = {...initialState, themes: schemes};
    const newState = homeReducer(state, {type: 'SET', theme: 'Ubuntu'});
    expect(newState.activeTheme).toBe('Ubuntu');
    expect(newState.backgroundColour).toBe('#300a24');
  });

  it('PREV wraps to the last theme and NEXT wraps to the first', () => {
    const darkThemes = schemes.filter((theme) => theme.meta.isDark);
    const state = {
      ...initialState,
      themes: schemes,
      filteredThemes: darkThemes,
      activeTheme: darkThemes[0].name,
    };
    const prevState = homeReducer(state, {type: 'PREV'});
    expect(prevState.activeTheme).toBe(darkThemes[darkThemes.length - 1].name);

    const lastState = {
      ...state,
      activeTheme: darkThemes[darkThemes.length - 1].name,
    };
    const nextState = homeReducer(lastState, {type: 'NEXT'});
    expect(nextState.activeTheme).toBe(darkThemes[0].name);

    const midState = {...state, activeTheme: darkThemes[1].name};
    const midNext = homeReducer(midState, {type: 'NEXT'});
    expect(midNext.activeTheme).toBe(darkThemes[2].name);
    const midPrev = homeReducer(midState, {type: 'PREV'});
    expect(midPrev.activeTheme).toBe(darkThemes[0].name);
  });

  it('SHADE swaps the filtered theme list and picks its first theme', () => {
    const state = {...initialState, themes: schemes, themeShade: 'DARK'};
    const lightState = homeReducer(state, {type: 'SHADE', payload: 'LIGHT'});
    expect(lightState.filteredThemes.map((t) => t.name)).toEqual([
      '3024 Day',
      'Man Page',
    ]);
    expect(lightState.activeTheme).toBe('3024 Day');
    expect(lightState.backgroundColour).toBe('#f7f7f7');

    const darkState = homeReducer(lightState, {type: 'SHADE', payload: 'DARK'});
    expect(darkState.filteredThemes.map((t) => t.name)).toEqual([
      'Duotone Dark',
      'Galaxy',
      'Ubuntu',
    ]);
    expect(darkState.activeTheme).toBe('Duotone Dark');
  });

  it('PREVIEW sets the preview type', () => {
    const newState = homeReducer(initialState, {
      type: 'PREVIEW',
      payload: 'colour',
    });
    expect(newState.previewType).toBe('colour');
  });

  it('show sets an active message and hide clears it', () => {
    const shown = homeReducer(initialState, {
      type: 'show',
      title: 'Copied!',
      message: 'Theme copied',
    });
    expect(shown.message).toEqual({
      title: 'Copied!',
      message: 'Theme copied',
      isActive: true,
    });
    const hidden = homeReducer(shown, {type: 'hide'});
    expect(hidden.message.isActive).toBe(false);
  });

  it('SIZE updates isSmallScreenSize', () => {
    const newState = homeReducer(initialState, {
      type: 'SIZE',
      isSmallScreenSize: true,
    });
    expect(newState.isSmallScreenSize).toBe(true);
  });
});

describe('Home component', () => {
  it('renders the default dark theme with the toolbar and theme controls', () => {
    const {getByText, getByTestId, getAllByTestId} = render(
      <Home themes={schemes} />
    );
    expect(getByText('Windows Terminal Themes')).toBeInTheDocument();
    expect(getByTestId('consoletest')).toBeInTheDocument();
    expect(getAllByTestId('theme-option').length).toBe(3);
    expect(getByTestId('randomButton')).toBeInTheDocument();
    expect(getByTestId('copyButton')).toBeInTheDocument();
    expect(getByTestId('shareButton')).toBeInTheDocument();
  });

  it('shows the mobile toggles layout on small screens', () => {
    window.innerWidth = 500;
    const {getByTestId} = render(<Home themes={schemes} />);
    expect(getByTestId('toggle-label-LIGHT')).toBeInTheDocument();
    window.innerWidth = 1024;
  });

  it('picks a random theme within the filtered list when clicked', () => {
    const {getByTestId} = render(<Home themes={schemes} />);
    fireEvent.click(getByTestId('randomButton'));
    expect(getByTestId('theme-list').value.length).toBeGreaterThan(0);
  });

  it('copies the theme and shows a toast on copy', async () => {
    const {getByTestId, getByText} = render(<Home themes={schemes} />);
    await act(async () => {
      fireEvent.click(getByTestId('copyButton'));
    });
    expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
    expect(
      getByText('Duotone Dark theme added to your clipboard')
    ).toBeInTheDocument();
  });

  it('shares the theme link and shows a toast on share', async () => {
    const {getByTestId, getByText} = render(<Home themes={schemes} />);
    await act(async () => {
      fireEvent.click(getByTestId('shareButton'));
    });
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('theme=Duotone')
    );
    expect(
      getByText('Duotone Dark link added your clipboard')
    ).toBeInTheDocument();
  });
});
