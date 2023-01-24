import { useEffect } from '../hooks/useEffect';
import { useRef } from '../hooks/useRef';
import { useState } from '../hooks/useState';
import { Reactiv } from '../types';
import './styles.css';

export const Text: Reactiv.Component<{ count: number }> = (attributes) => {
  const { count, children, ...restProps } = attributes;
  const [value, setValue] = useState(count);

  const onClick = () => {
    setValue((prev) => prev + 1);
  };

  useEffect(() => {
    console.log('here');
  }, [value]);

  return (
    <div {...restProps}>
      {children}
      <p
        style={{ height: '100px', width: '50px' }}
        className={'test another class '}
      >
        Some text {attributes.count.toString()}
      </p>
      <p onClick={onClick}>Other text {value.toString()}</p>
    </div>
  );
};

let testCount = 1;

export const Component: Reactiv.Component<{ count: number }> = (
  attributes
): Node => {
  const { count, children, ...restProps } = attributes;
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  const onClick = () => {
    testCount *= 2;
    setValue((prev) => prev + 2);
    ref.current?.classList.add('active');
  };

  const onOtherClick = () => {
    ref.current?.classList.remove('active');
  };

  useEffect(() => {});

  return (
    <div {...restProps}>
      {children}
      <button onClick={onClick}>Set active</button>
      <button onClick={onOtherClick}>Set inactive</button>
      <p ref={ref}>{value}</p>
    </div>
  );
};

export const Button = () => {
  return <button onClick={() => {}}>Click kid</button>;
};
