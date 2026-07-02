import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MoreContent from './MoreContent';

it('renders every section heading', () => {
  const {getByText} = render(<MoreContent downloadAllThemes={jest.fn()} />);
  ['Download', 'Help', 'Credit', 'Contribute', 'GitHub', 'Tips'].forEach(
    (heading) => {
      expect(getByText(heading)).toBeInTheDocument();
    }
  );
});

it('calls downloadAllThemes when the download button is clicked', () => {
  const downloadAllThemes = jest.fn();
  const {getByText} = render(
    <MoreContent downloadAllThemes={downloadAllThemes} />
  );
  fireEvent.click(getByText('Download .json of themes'));
  expect(downloadAllThemes).toHaveBeenCalledTimes(1);
});
