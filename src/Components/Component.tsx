import { useEffect } from '../hooks/useEffect';
import { useState } from '../hooks/useState';
import { Reactiv } from '../types';

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

  // console.log(children);

  const onClick = () => {
    testCount *= 2;
    setValue((prev) => prev + 2);
  };

  useEffect(() => {
    console.log('rerender');
  }, [value]);

  return (
    <div {...restProps}>
      <Text className={'T-1'} count={testCount}>
        <Button />
      </Text>
      <Text className={'T-2'} count={value} />
      {/* {children} */}
      <button onClick={onClick}>Click Here</button>
    </div>
  );
};

export const Button = () => {
  return <button onClick={() => {}}>Click kid</button>;
};
