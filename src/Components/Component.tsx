import { TestContext } from '../App';
import { useContext } from '../Context/createContext';
import { globals } from '../globals';
import { useEffect } from '../hooks/useEffect';
import { useRef } from '../hooks/useRef';
import { useState } from '../hooks/useState';
import { Reactiv } from '../types';
import './styles.css';

export const Text: Reactiv.Component<{ count: number }> = (attributes) => {
  const { count, children, ...restProps } = attributes;
  const [value, setValue] = useContext(TestContext);
  console.log(value);
  // const [value, setValue] = useState(count || 0);

  // const onClick = () => {
  //   setValue((prev) => prev + 1);
  // };

  // useEffect(() => {
  //   // console.log('here');
  // }, [value]);

  return (
    <div className="TextTop">
      <div>
        {value}
        <p {...restProps}>Other text</p>
        <button onClick={() => setValue((prev) => prev + 5)}>
          Change context
        </button>
        <Button />
      </div>
    </div>
  );
};

export const Component: Reactiv.Component<{ count: number }> = (
  attributes
): Node => {
  const { count, children, ...restProps } = attributes;
  // const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  // const contextValue = useContext(TestContext);
  // console.log(contextValue);

  const onClick = () => {
    //   ref.current = ref.current + 1;
    ref.current?.classList.add('active');
  };

  const onOtherClick = () => {
    //   setValue((prev) => prev + 2);
    //   // contextValue.a++;
    ref.current?.classList.remove('active');
  };

  // useEffect(() => {}, [ref.current]);

  return (
    <div>
      <div {...restProps}>
        <Text count={2} ref={ref} className="Text child" />

        <>
          <button onClick={onClick}>On</button>
          <button onClick={onOtherClick}>Off</button>
        </>
      </div>
    </div>
  );
};

export const Button = () => {
  const [value, setValue] = useState(10);

  return (
    <>
      <p>{value}</p>
      <button onClick={() => setValue((current) => current + 1)}>
        Click kid
      </button>
    </>
  );
};
