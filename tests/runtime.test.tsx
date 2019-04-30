/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, cleanup, act, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { state, bind } from '../lib/macro';

describe('runtime', () => {
  afterEach(cleanup);

  it('state', () => {
    const Counter = React.forwardRef((_props, ref) => {
      let count = state(0);

      React.useImperativeHandle(ref, () => ({
        increment: () => {
          count += 1;
        }
      }));

      return <div>{count}</div>;
    });
    const counter = React.createRef<{ increment: () => void }>();
    const { container } = render(<Counter ref={counter} />);
    expect(container).toHaveTextContent('0');
    act(() => {
      counter.current!.increment();
    });
    expect(container).toHaveTextContent('1');
  });

  it('bind', () => {
    const App = () => {
      let name = state('');

      return (
        <div>
          <div data-testid="name">{name}</div>
          <input data-testid="input" type="text" value={bind(name)} />
        </div>
      );
    };
    const { getByTestId } = render(<App />);
    expect(getByTestId('name')).toHaveTextContent('');
    const input = getByTestId('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Meck' } });
    expect(getByTestId('name')).toHaveTextContent('Meck');
  });

  it('custom hook', () => {
    const useCounter = (initialCount: number) => {
      let count = state(initialCount);
      const increment = () => {
        count += 1;
      };
      return [count, increment];
    };
    const App = React.forwardRef((_props, ref) => {
      const [count, increment] = useCounter(0);
      React.useImperativeHandle(ref, () => ({
        increment
      }));
      return <div>{count}</div>;
    });
    const app = React.createRef<{ increment: () => void }>();
    const { container } = render(<App ref={app} />);
    expect(container).toHaveTextContent('0');
    act(() => {
      app.current!.increment();
    });
    expect(container).toHaveTextContent('1');
  });
});
