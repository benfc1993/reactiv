import { Component, Text } from './Components/Component';
// import { createContext } from './Context/createContext';
import { Reactiv } from './types';

// export const TestContext = createContext({ a: 1, b: 2 });
const TestingPass = () => {
  const context: any = {
    value: 0,
    Parent: null
  };
  context.Parent = (props: { initValue: number; children?: any }) => {
    const { initValue, children } = props;
    context.value = initValue;
    return <div className="Parent">{children}</div>;
  };
  return context;
};

export const TestContext = TestingPass();

export const App: Reactiv.Component = (): Node => {
  return (
    <div className="App">
      <TestContext.Parent initValue={10}>
        <div className="new-element">
          <Text count={2} />
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
      </TestContext.Parent>
      <div className="sibling-here">
        <>
          <Text count={3} />
        </>
      </div>
    </div>
  );
};
