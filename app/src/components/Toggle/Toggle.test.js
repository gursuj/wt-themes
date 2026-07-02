import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Toggle from './Toggle';

const values = [
  {value: 'A', label: 'Option A', icon: () => <span>iconA</span>},
  {value: 'B', label: 'Option B', icon: () => <span>iconB</span>},
];

it('renders a label for every option and marks the current one active', () => {
  const dispatch = jest.fn();
  const {getByTestId} = render(
    <Toggle values={values} currentValue="A" type="TEST" dispatch={dispatch} />
  );
  expect(getByTestId('toggle-label-A').className).toEqual(
    expect.stringContaining('active')
  );
  expect(getByTestId('toggle-label-B').className).not.toEqual(
    expect.stringContaining('active')
  );
});

it('dispatches the option value on selection', () => {
  const dispatch = jest.fn();
  const {getByTestId} = render(
    <Toggle values={values} currentValue="A" type="TEST" dispatch={dispatch} />
  );
  fireEvent.click(getByTestId('toggle-label-B').querySelector('input'));
  expect(dispatch).toHaveBeenCalledWith({type: 'TEST', payload: 'B'});
});
