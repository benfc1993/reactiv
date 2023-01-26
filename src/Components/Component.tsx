import { useEffect } from '../hooks/useEffect';
import { useRef } from '../hooks/useRef';
import { useState } from '../hooks/useState';
import { Reactiv } from '../types';
import './styles.css';

export const Text: Reactiv.Component<{ count?: number }> = (attributes) => {
  const { count, children, ...restProps } = attributes;
  const [value, setValue] = useState(count || 0);

  const onClick = () => {
    setValue((prev) => prev + 1);
  };

  useEffect(() => {
    // console.log('here');
  }, [value]);

  return (
    <>
      <p {...restProps} onClick={onClick}>
        Other text {count !== undefined ? count : value.toString()}
      </p>
    </>
  );
};

export const Component: Reactiv.Component<{ count: number }> = (
  attributes
): Node => {
  const { count, children, ...restProps } = attributes;
  const [value, setValue] = useState(0);
  const ref = useRef<number>(1);

  const onClick = () => {
    ref.current = ref.current + 1;
    // ref.current?.classList.add('active');
  };

  const onOtherClick = () => {
    setValue((prev) => prev + 2);
    // ref.current?.classList.remove('active');
  };

  useEffect(() => {}, [ref.current]);

  return (
    <>
      {(ref.current < 2 || ref.current > 4) && (
        <Text count={value} className="Text child" />
      )}
      <div {...restProps}>
        <>
          <p className="non-component" onClick={onClick}>
            Test{Object.values(ref)}
          </p>
          <p onClick={onOtherClick}>other</p>
        </>
      </div>
    </>
  );
};

export const Button = () => {
  return <button onClick={() => {}}>Click kid</button>;
};
