import { Component, Text } from "./Components/Component";
import { Reactiv } from "./types";

export const App: Reactiv.Component = (): Node => {
  return (
    <div className="App">
      <h1>I Think this works!</h1>
      <div>
        <Component count={3} className={"component"} />
      </div>
      <Component count={3} className={"component-2"} />
      {/* <Text count={3} /> */}
    </div>
  );
};
