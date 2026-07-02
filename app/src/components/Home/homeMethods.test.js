import {screenSizeObserver, shortcuts, sampleColours} from './homeMethods';

jest.mock('resize-observer-polyfill', () => {
  return class MockResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.observe = jest.fn();
      this.unobserve = jest.fn();
    }
  };
});

it('dispatches a small SIZE action when the width drops below 1024', () => {
  const dispatch = jest.fn();
  const observer = screenSizeObserver(dispatch);
  observer.callback([{contentRect: {width: 800}}]);
  expect(dispatch).toHaveBeenCalledWith({
    type: 'SIZE',
    isSmallScreenSize: true,
  });
});

it('dispatches a large SIZE action when the width is 1024 or more', () => {
  const dispatch = jest.fn();
  const observer = screenSizeObserver(dispatch);
  observer.callback([{contentRect: {width: 1200}}]);
  expect(dispatch).toHaveBeenCalledWith({
    type: 'SIZE',
    isSmallScreenSize: false,
  });
});

it('dispatches PREV on the A key and NEXT on the D key', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const handleShortcut = shortcuts(dispatch, themeselectRef);
  handleShortcut({code: 'KeyA'});
  expect(dispatch).toHaveBeenCalledWith({type: 'PREV'});
  handleShortcut({code: 'KeyD'});
  expect(dispatch).toHaveBeenCalledWith({type: 'NEXT'});
});

it('ignores keys with no matching shortcut', () => {
  const dispatch = jest.fn();
  const themeselectRef = {current: null};
  const handleShortcut = shortcuts(dispatch, themeselectRef);
  handleShortcut({code: 'KeyZ'});
  expect(dispatch).not.toHaveBeenCalled();
});

it('blurs the theme select and prevents default when it is focused', () => {
  const dispatch = jest.fn();
  const selectEl = document.createElement('select');
  document.body.appendChild(selectEl);
  selectEl.focus();
  const themeselectRef = {current: selectEl};
  const blurSpy = jest.spyOn(selectEl, 'blur');
  const preventDefault = jest.fn();
  const handleShortcut = shortcuts(dispatch, themeselectRef);

  handleShortcut({code: 'KeyA', preventDefault});

  expect(preventDefault).toHaveBeenCalled();
  expect(blurSpy).toHaveBeenCalled();
  expect(dispatch).toHaveBeenCalledWith({type: 'PREV'});
  document.body.removeChild(selectEl);
});

it('returns three of the theme colours', () => {
  const theme = {
    red: 'r',
    green: 'g',
    yellow: 'y',
    blue: 'b',
    purple: 'p',
    cyan: 'c',
  };
  const result = sampleColours(theme);
  expect(result.length).toBe(3);
  result.forEach((colour) => {
    expect(Object.values(theme)).toContain(colour);
  });
});

it('returns an empty array when there is no theme', () => {
  expect(sampleColours(undefined)).toEqual([]);
});
