import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Toast from './Toast';

it('renders the message text', () => {
  const {getByText} = render(
    <Toast
      background="#fff"
      title="Copied!"
      isActive={false}
      message="Theme copied"
    />
  );
  expect(getByText('Theme copied')).toBeInTheDocument();
});

it('applies the active class only when isActive is true', () => {
  const {container, rerender} = render(
    <Toast background="#fff" title="Copied!" isActive={false} message="Hi" />
  );
  expect(container.firstChild.className).not.toEqual(
    expect.stringContaining('active')
  );
  rerender(
    <Toast background="#fff" title="Copied!" isActive={true} message="Hi" />
  );
  expect(container.firstChild.className).toEqual(
    expect.stringContaining('active')
  );
});
