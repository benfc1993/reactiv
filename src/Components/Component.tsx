// import { TestContext } from '../App';
// import { useContext } from '../Context/createContext';
import { TestContext } from '../App';
import { globals } from '../globals';
import { useEffect } from '../hooks/useEffect';
import { useRef } from '../hooks/useRef';
import { useState } from '../hooks/useState';
import { Reactiv } from '../types';
import './styles.css';

export const Text: Reactiv.Component<{ count: number }> = (attributes) => {
  const { count, children, ...restProps } = attributes;
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
        <p {...restProps}>Other text</p>
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
  // const ref = useRef<number>(1);
  // const contextValue = useContext(TestContext);
  // console.log(contextValue);

  // const onClick = () => {
  //   ref.current = ref.current + 1;
  //   // ref.current?.classList.add('active');
  // };

  // const onOtherClick = () => {
  //   setValue((prev) => prev + 2);
  //   // contextValue.a++;
  //   // ref.current?.classList.remove('active');
  // };

  // useEffect(() => {}, [ref.current]);

  return (
    <div>
      <Text count={1} className="Text child" />

      <div {...restProps}>
        <Text count={2} className="Text child" />

        <>
          <p className="non-component">Test</p>
          <p>other</p>
        </>
      </div>
    </div>
  );
};

export const Button = () => {
  return (
    <>
      <button onClick={() => {}}>Click kid</button>
    </>
  );
};
