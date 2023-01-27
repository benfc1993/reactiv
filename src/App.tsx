import { Component, Text } from './Components/Component';
import { Reactiv } from './types';

export const App: Reactiv.Component = (): Node => {
  return (
    <div className="App">
      <Component count={3} className={'component'} />
      <Component count={3} className={'component'} />
      <Text className="Text" />
    </div>
  );
};
