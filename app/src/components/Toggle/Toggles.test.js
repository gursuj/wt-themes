import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Toggles from './Toggles';

it('renders shade and preview toggle groups and dispatches on change', () => {
  const dispatch = jest.fn();
  const {getByTestId} = render(
    <Toggles themeShade="DARK" previewType="console" dispatch={dispatch} />
  );
  fireEvent.click(getByTestId('toggle-label-LIGHT').querySelector('input'));
  expect(dispatch).toHaveBeenCalledWith({type: 'SHADE', payload: 'LIGHT'});

  fireEvent.click(getByTestId('toggle-label-colour').querySelector('input'));
  expect(dispatch).toHaveBeenCalledWith({type: 'PREVIEW', payload: 'colour'});
});
