import { Component, Text } from './Components/Component';
import { createContext } from './Context/createContext';
import { SetValue, useState } from './hooks/useState';
import { Reactiv } from './types';

export const TestContext = createContext<[number, SetValue<number>]>()!;

const useStore = (initialValue: number): [number, SetValue<number>] => {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
};

export const App: Reactiv.Component = (): Node => {
  return (
    <div className="App">
      <TestContext.Provider value={useStore(27)}>
        <div className="new-element">
          <Text count={2} />
        </div>
        <div>
          <div>
            <div>
              <Component count={4} />
            </div>
          </div>
        </div>
        <div className="sibling-here">
          <>
            <Text count={3} />
          </>
        </div>
      </TestContext.Provider>
    </div>
  );
};
