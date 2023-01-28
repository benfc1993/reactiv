import { Component, Text } from './Components/Component';
// import { createContext } from './Context/createContext';
import { Reactiv } from './types';

// export const TestContext = createContext({ a: 1, b: 2 });

const Parent: Reactiv.Component = (props) => {
  const { children } = props;
  console.log('parent Children: ', children);

  return <div>{children}</div>;
};

export const App: Reactiv.Component = (): Node => {
  return (
    <div className="App">
      <Text count={3}>
        <Text count={2} />
      </Text>
    </div>
  );
};

// <Parent>
//   <Component count={3} className={'component'} />
//   <Component count={3} className={'component'} />
//   <Text className="Text" />
// </Parent>
