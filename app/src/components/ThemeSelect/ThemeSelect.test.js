import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ThemeSelect from './ThemeSelect';

it('renders an option for every theme name', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const {getByTestId, getAllByTestId} = render(
    <ThemeSelect
      themeNames={['Alpha', 'Beta', 'Gamma']}
      activeTheme="Beta"
      dispatch={dispatch}
      themeselectRef={themeselectRef}
    />
  );
  expect(getByTestId('theme-list').value).toBe('Beta');
  expect(getAllByTestId('theme-option').length).toBe(3);
});

it('dispatches SET when a different theme is chosen', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const {getByTestId} = render(
    <ThemeSelect
      themeNames={['Alpha', 'Beta']}
      activeTheme="Alpha"
      dispatch={dispatch}
      themeselectRef={themeselectRef}
    />
  );
  fireEvent.change(getByTestId('theme-list'), {target: {value: 'Beta'}});
  expect(dispatch).toHaveBeenCalledWith({type: 'SET', theme: 'Beta'});
});

it('dispatches PREV and NEXT from the direction buttons', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const {getByText} = render(
    <ThemeSelect
      themeNames={['Alpha', 'Beta']}
      activeTheme="Alpha"
      dispatch={dispatch}
      themeselectRef={themeselectRef}
    />
  );
  fireEvent.click(getByText('Prev'));
  expect(dispatch).toHaveBeenCalledWith({type: 'PREV'});
  fireEvent.click(getByText('Next'));
  expect(dispatch).toHaveBeenCalledWith({type: 'NEXT'});
});
