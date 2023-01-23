import { App } from "./App";
import { Component } from "./Components/Component";
import { CreateDOM } from "./CreateDOM";

CreateDOM("root", (): Node => {
  return (
    <div className="root">
      {/* - 9 | L0 C1 */}
      <div className="p-1">
        {" "}
        {/* - 3 | L1 C0 */}
        <p className="c-1-1">Child 1</p> {/* - 1 | L2 C0 */}
        <p className="c-1-2">Child 2</p> {/* - 2 | L2 C0 */}
      </div>
      <div className="p-2">
        {" "}
        {/* - 8 | L1 C0 */}
        <p className="c-2-1">Child 1</p> {/* - 4 | L2 C1 */}
        <Component className={"Component"} count={4} />
        <p className="c-2-2">Child 2</p> {/* - 5 | L2 C1 */}
        <div className="p-2-1">
          {" "}
          {/* - 7 | L2 C1 */}
          <p className="c-2-1-1">grandchild 1</p> {/* - 6 | L3 C2 */}
        </div>
      </div>
    </div>
  );
});

/**
 * L2 C0
 * L2 C0
 * L1 C0
 * L2 C1
 * Ls C1
 * L3 C2
 * L2 C1
 * L1 C0
 * L0 c1
 */
