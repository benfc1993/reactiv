(() => {
  // src/devTools/ui.ts
  var UI = {
    devToggle: (() => {
      const container = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener(
        "change",
        (e) => pause.setIsEnabled(e.target.checked)
      );
      checkbox.name = "enable-dev";
      const label = document.createElement("label");
      label.htmlFor = checkbox.name;
      label.innerText = "Enable Dev mode";
      container.appendChild(label);
      container.appendChild(checkbox);
      return container;
    })(),
    stepButton: (() => {
      const el = document.createElement("button");
      el.innerText = "Next";
      return el;
    })(),
    notification: document.createElement("div")
  };
  function init() {
    const root = document.getElementById("dev-tools");
    root.appendChild(UI.devToggle);
    root.appendChild(UI.stepButton);
    root.appendChild(UI.notification);
  }
  init();

  // src/devTools/step.ts
  var Action = /* @__PURE__ */ ((Action2) => {
    Action2[Action2["STATE_CHANGE"] = 0] = "STATE_CHANGE";
    Action2[Action2["DEPENDENCY_CHANGE"] = 1] = "DEPENDENCY_CHANGE";
    Action2[Action2["RE_RENDER"] = 2] = "RE_RENDER";
    Action2[Action2["ADDED_COMPONENT"] = 3] = "ADDED_COMPONENT";
    Action2[Action2["REMOVED_COMPONENT"] = 4] = "REMOVED_COMPONENT";
    Action2[Action2["REF_CHANGED"] = 5] = "REF_CHANGED";
    Action2[Action2["NONE"] = 6] = "NONE";
    return Action2;
  })(Action || {});
  var pause = {
    isEnabled: false,
    setIsEnabled(value) {
      this.isEnabled = value;
    },
    actions: [],
    showAll: false,
    toClear: null
  };
  async function addAction(cache, actionType, message, show = false) {
    if (!pause.isEnabled) return;
    let resolve;
    const promise = new Promise((res) => {
      resolve = res;
    });
    pause.actions.push(async () => {
      const action = { cache, actionType, message, promise, resolve };
      showMessage(action);
      await action.promise;
      if (pause.showAll && pause.actions.length >= 1) {
        pause.actions.shift();
        if (pause.actions.length) {
          pause.actions[0]();
        } else {
          pause.showAll = false;
        }
      }
    });
    if (show && pause.actions.length === 1) {
      pause.actions[0]();
    }
    return promise;
  }
  function showMessage(action) {
    if (!pause.isEnabled || pause.actions.length === 0) {
      pause.showAll = false;
      return;
    }
    const { message, actionType, resolve, cache } = action;
    UI.notification.innerText = message;
    UI.notification.classList.add(
      "update-message",
      `update-message-${actionType}`
    );
    pause.toClear = cache.el.ref;
    cache.el.ref.classList.add(`update`, `update-${actionType}`);
    waitForNext(resolve);
  }
  function showAllMessages() {
    if (pause.showAll) return;
    pause.showAll = !!pause.actions.length;
    if (pause.actions.length) {
      pause.actions[0]();
    }
  }
  async function waitForNext(resolve) {
    function listener() {
      UI.notification.innerText = "";
      UI.notification.setAttribute("class", "");
      if (pause.toClear)
        pause.toClear.classList.remove(
          ...Array.from({ length: Object.keys(Action).length }).map(
            (_, i) => `update-${i}`
          )
        );
      const oldNode = UI.stepButton;
      const newButton = UI.stepButton.cloneNode(true);
      UI.stepButton.parentNode.replaceChild(newButton, oldNode);
      UI.stepButton = newButton;
      resolve();
    }
    UI.stepButton.addEventListener("click", listener);
  }

  // src/devTools/nodeTree.ts
  var nodeTree = {
    current: null,
    next: null,
    partial: { children: [], key: "", tag: "root", action: 6 /* NONE */ }
  };
  var nodeQueue = [nodeTree.partial];
  function addToDevTree(key, tag, action) {
    const treeNode = {
      children: [],
      tag,
      key,
      action
    };
    nodeQueue[0].children.push(treeNode);
    nodeQueue.unshift(treeNode);
  }
  function commitNode() {
    nodeQueue.shift();
  }
  function replaceNode(node, start) {
    const rootNode = start ? start : nodeTree.next;
    if (!rootNode) {
      nodeTree.next = deepClone(node);
      return;
    }
    for (let i = 0; i < rootNode.children.length; i++) {
      const child = rootNode.children[i];
      if (child.key === node.key && child.tag === node.tag) {
        rootNode.children[i] = node;
        return true;
      }
      if (replaceNode(node, child)) return true;
    }
    return false;
  }
  function commitTree() {
    if (nodeTree.partial.children.length === 0) return;
    if (nodeTree.partial.children.length === 1) {
      replaceNode(deepClone(nodeTree.partial.children[0]));
    } else {
      nodeTree.next = deepClone(nodeTree.partial);
    }
    nodeTree.partial.children = [];
    const copy = deepClone(nodeTree.next);
    nodeTree.current = copy;
    resetNodes(nodeTree.next);
    console.log(nodeTree);
  }
  function resetNodes(node) {
    node.action = 6 /* NONE */;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      resetNodes(child);
    }
  }
  function deepClone(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = value instanceof Array ? value.map((value2) => deepClone(value2)) : value instanceof Object ? deepClone(value) : value;
      return acc;
    }, {});
  }

  // src/react/globalState.ts
  var map = /* @__PURE__ */ new Map();
  var keys = [];
  var globalKey = { value: "" };
  var hookIndex = { value: 0 };
  var renderState = { initialRender: false, renderRunning: false };
  var renderQueue = [];
  var addToRenderQueue = (callback) => {
    renderQueue.push(callback);
    if (renderQueue.length && !renderState.initialRender && !renderState.renderRunning)
      renderQueue.shift()();
  };

  // src/react/render.tsx
  function createApplication(root, RootComponent) {
    renderState.initialRender = true;
    render(RootComponent(), root);
    renderState.initialRender = false;
    globalKey.value = void 0;
    hookIndex.value = 0;
    console.log(map);
    commitTree();
    if (renderQueue.length) renderQueue.shift()();
    renderState.renderRunning = false;
  }
  function render(el, container) {
    renderState.renderRunning = true;
    if (!el) return;
    let domEl;
    if (typeof el === "string" || typeof el === "number") {
      domEl = document.createTextNode(el);
      container.appendChild(domEl);
      return;
    }
    domEl = el.isComponent || el.tag === "FRAGMENT" ? container : document.createElement(el.tag);
    if (el.props && "key" in el.props) {
      const state = map.get(el.props.key);
      if (state) {
        state.el.ref = domEl;
        domEl.setAttribute("data-key", state.key);
      }
    }
    if (!el.isComponent) {
      if (el.props && "ref" in el.props && "current" in el.props.ref) {
        el.props.ref.current = domEl;
      }
      if (el.props && "className" in el.props) {
        domEl.classList.add(el.props.className.split(" "));
      }
      let elProps = el.props ? Object.keys(el.props) : null;
      if (elProps && elProps.length > 0) {
        elProps.forEach((prop) => domEl[prop] = el.props[prop]);
      }
    }
    if (el.children && el.children.length > 0) {
      el.children.flatMap((child) => child).forEach((node) => render(node, domEl));
    }
    if (el.isComponent || el.tag === "FRAGMENT") {
      el.ref = el.children[0].ref;
      return;
    }
    if (!el.isComponent && el.ref && container.contains(el.ref)) {
      container.replaceChild(domEl, el.ref);
    } else {
      container.appendChild(domEl);
    }
    el.ref = domEl;
  }

  // src/react/reconciliation/createNewComponent.ts
  function createNewComponent(node) {
    map.set(node.props.key, {
      component: node.fn,
      key: node.props.key,
      hooks: [],
      props: node.props,
      el: null
    });
  }

  // src/react/reconciliation/reconcile.ts
  function reconcile(before, after) {
    let current = after;
    if (before.isComponent && after.isComponent && before.tag === after.tag) {
      addToDevTree(
        before.props.key,
        before.tag,
        before === after ? 3 /* ADDED_COMPONENT */ : 2 /* RE_RENDER */
      );
      globalKey.value = before.props?.key;
      hookIndex.value = 0;
      current.children = [
        after.fn({ ...after.props, key: before.props?.key })
      ].flatMap((child) => child);
      const key = before.props.key;
      const cache = map.get(key);
      if (cache) cache.el = before;
      before.props = { ...after.props, key };
      if (before?.children.length === 0) {
        before.children = [...current.children];
      }
    }
    for (let i = 0; i < before.children.length; i++) {
      const child = before.children[i];
      const afterChild = current.children[i];
      if (isNullChild(child) || isNullChild(afterChild) || child.tag !== afterChild.tag) {
        if (afterChild) {
          before.children[i] = afterChild;
          if (child?.isComponent) {
            map.delete(child.props.key);
          }
          if (afterChild.isComponent) createNewComponent(afterChild);
          reconcile(before.children[i], afterChild);
          continue;
        }
        continue;
      }
      if (child.isComponent && afterChild.isComponent && child.tag === afterChild.tag) {
        reconcile(child, afterChild);
        continue;
      }
      if (child instanceof Array && afterChild instanceof Array) {
        if (child.some((c) => !c.props?.key) || afterChild.some((c) => !c.props?.key)) {
          before.children[i] = afterChild;
          continue;
        }
        ;
        before.children[i] = afterChild.map((aC) => {
          const existingItem = child.find((c) => c.props.key === aC.props.key);
          if (existingItem) {
            return { ...existingItem, props: aC.props };
          }
          return aC;
        });
        continue;
      }
      if (typeof child === "string" || typeof child === "number") {
        if (typeof afterChild === "string" || typeof afterChild === "number") {
          before.children[i] = afterChild;
          continue;
        }
      }
      if (child.tag === afterChild.tag) {
        if (afterChild.isComponent) {
          const res = afterChild.fn({
            ...afterChild.props,
            key: child.props.key
          });
          child.props = { ...afterChild.props };
          reconcile(child, res);
          continue;
        }
      }
      child.props = { ...afterChild.props };
      reconcile(child, afterChild);
    }
    if (before.isComponent) commitNode();
  }
  function isNullChild(child) {
    return child === false || child === null;
  }

  // src/react/rerender.tsx
  async function rerender(Component, props) {
    renderState.renderRunning = true;
    const state = map.get(props.key);
    hookIndex.value = 0;
    reconcile(state.el, /* @__PURE__ */ react_default.createElement(Component, { ...props, key: state.props.key }));
    globalKey.value = void 0;
    if (renderQueue.length > 0) {
      return renderQueue.shift()();
    }
    render(state.el, state.el.ref.parentElement);
    renderState.renderRunning = false;
    showAllMessages();
    commitTree();
  }

  // src/react/types.ts
  function isUseStateHook(hook) {
    const keys2 = Object.keys(hook);
    return keys2.length === 1 && "value" in hook;
  }
  function isUseEffectHook(hook) {
    const keys2 = Object.keys(hook);
    return keys2.length === 2 && (hook?.dependencies === null || hook?.dependencies instanceof Array) && (!hook?.cleanup || typeof hook?.cleanup === "function");
  }
  function isUseRefHook(hook) {
    const keys2 = Object.keys(hook);
    return keys2.length === 1 && "current" in hook;
  }
  function isUseMemoHook(hook) {
    const keys2 = Object.keys(hook);
    return keys2.length === 2 && (hook?.dependencies === null || hook?.dependencies instanceof Array) && "value" in hook;
  }

  // src/react/hooks/useState.ts
  function useState(initialState) {
    const idx = hookIndex.value;
    const internalKey = globalKey.value;
    hookIndex.value += 1;
    return (() => {
      const cache = map.get(internalKey);
      if (!cache.hooks[idx])
        cache.hooks[idx] = {
          value: typeof initialState === "function" ? initialState() : initialState
        };
      const hook = cache.hooks[idx];
      const setState = async (next) => {
        if (!isUseStateHook(hook)) return;
        const prevValue = hook.value;
        hook.value = typeof next === "function" ? next(hook.value) : next;
        await addAction(
          cache,
          0 /* STATE_CHANGE */,
          `State updated from ${prevValue} to ${hook.value}`,
          true
        );
        addToRenderQueue(
          () => rerender(cache.component, {
            ...cache.props,
            key: internalKey
          })
        );
      };
      if (!isUseStateHook(hook))
        throw Error("Cached useState hook invalid format");
      return [hook.value, setState];
    })();
  }

  // src/react/hooks/useEffect.ts
  function useEffect(callback, dependencies = null) {
    const idx = hookIndex.value;
    const internalKey = globalKey.value;
    hookIndex.value += 1;
    return (() => {
      const cache = map.get(internalKey);
      if (!cache.hooks[idx])
        cache.hooks[idx] = {
          dependencies: null,
          cleanup: () => null
        };
      const hook = cache.hooks[idx];
      if (!isUseEffectHook(hook)) return;
      if (hook.dependencies === null || hook?.dependencies?.some((dep, i) => dep !== dependencies[i])) {
        void addAction(
          cache,
          1 /* DEPENDENCY_CHANGE */,
          "useEffect dependencies changed, running callback"
        );
        hook.dependencies = dependencies;
        hook.cleanup?.();
        const cleanup = callback();
        if (cleanup) hook.cleanup = cleanup;
        return;
      }
      void addAction(
        cache,
        1 /* DEPENDENCY_CHANGE */,
        "useEffect dependencies NOT changed"
      );
    })();
  }

  // src/react/hooks/useMemo.ts
  function useMemo(callback, dependencies = null) {
    const idx = hookIndex.value;
    const internalKey = globalKey.value;
    hookIndex.value += 1;
    return (() => {
      const cache = map.get(internalKey);
      if (!cache.hooks[idx])
        cache.hooks[idx] = { dependencies: null, value: null };
      const hook = cache.hooks[idx];
      if (!isUseMemoHook(hook)) return;
      if (hook.dependencies === null || hook.dependencies.some((dep, i) => dep !== dependencies[i])) {
        hook.value = callback();
        hook.dependencies = dependencies;
        addAction(
          cache,
          1 /* DEPENDENCY_CHANGE */,
          "useMemo dependencies changed, running callback"
        );
      }
      return hook.value;
    })();
  }

  // src/react/hooks/useRef.ts
  function useRef(initialValue) {
    const idx = hookIndex.value;
    const internalKey = globalKey.value;
    hookIndex.value += 1;
    return (() => {
      const cache = map.get(internalKey);
      if (!cache.hooks[idx]) {
        cache.hooks[idx] = { current: initialValue };
      }
      const hook = cache.hooks[idx];
      if (!isUseRefHook(hook)) return;
      return hook;
    })();
  }

  // src/react/elementEvents.ts
  var elementEvents = [
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onerror",
    "onhashchange",
    "onload",
    "onmessage",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpopstate",
    "onresize",
    "onstorage",
    "onunload",
    "onblur",
    "onchange",
    "oncontextmenu",
    "onfocus",
    "oninput",
    "oninvalid",
    "onreset",
    "onsearch",
    "onselect",
    "onsubmit",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onclick",
    "ondblclick",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onwheel",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "onscroll",
    "oncopy",
    "oncut",
    "onpaste",
    "onabort",
    "oncanplay",
    "oncanplaythrough",
    "oncuechange",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onseeked",
    "onseeking",
    "onstalled",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting",
    "ontoggle"
  ];

  // src/react/createElement.ts
  var React = {
    createElement: (tag, props, ...children) => {
      if (typeof tag === "function") {
        if (!renderState.initialRender) {
          const key = props?.key ? props.key : Math.random().toString();
          globalKey.value = key;
          const el2 = {
            tag: tag.name,
            fn: tag,
            isComponent: true,
            props: { ...props, key },
            children,
            ref: null
          };
          return el2;
        }
        keys.unshift(props?.key ? props.key : Math.random().toString());
        hookIndex.value = 0;
        const state = map.get(keys[0]) ?? {
          component: tag,
          props: props ? Object.entries(props).reduce((nextProps, [key, value]) => {
            if (typeof value === "function") {
              nextProps[key] = value();
              return nextProps;
            }
            nextProps[key] = value;
            return nextProps;
          }, {}) : props,
          hooks: [],
          parentEl: null,
          key: keys[0]
        };
        addToDevTree(keys[0], tag.name, 3 /* ADDED_COMPONENT */);
        map.set(keys[0], {
          ...state,
          props: { ...props, key: keys[0] },
          el: null,
          key: keys[0]
        });
        globalKey.value = keys[0];
        const componentResult = tag(
          { ...state.props, key: globalKey.value },
          ...children
        );
        const componentKey = keys.shift();
        const res = {
          tag: tag.name,
          fn: tag,
          isComponent: true,
          props: { ...props, key: componentKey },
          children: componentResult instanceof Array ? componentResult : [componentResult],
          ref: null
        };
        commitNode();
        map.get(componentKey).el = res;
        return res;
      }
      const el = {
        tag: tag ?? "fragment",
        props: props ? Object.entries(props).reduce((nextProps, [key, value]) => {
          if (elementEvents.includes(key.toLowerCase())) {
            nextProps[key.toLowerCase()] = value;
            return nextProps;
          }
          nextProps[key] = value;
          return nextProps;
        }, {}) : props,
        children,
        isComponent: false,
        ref: null
      };
      return el;
    }
  };
  var createElement_default = React;

  // src/react/index.ts
  var react_default = createElement_default;

  // src/index.tsx
  var Testing = (props) => {
    const [state, setState] = useState(0);
    const [count, setCount] = useState(props?.count ?? 1);
    const testing = useMemo(() => count * 10, [state]);
    useEffect(() => {
      setState(count * 10);
    }, [count]);
    return /* @__PURE__ */ react_default.createElement("main", null, /* @__PURE__ */ react_default.createElement("p", null, testing), /* @__PURE__ */ react_default.createElement(
      "p",
      {
        className: `update-message-${state}`,
        onClick: () => {
          setState((current) => current + 1);
        }
      },
      "testing ",
      props.key,
      " - ",
      state
    ), /* @__PURE__ */ react_default.createElement("p", { onClick: () => setCount((current) => current * 2) }, "count - ", count), /* @__PURE__ */ react_default.createElement("div", null, count > 2 && count < 10 ? /* @__PURE__ */ react_default.createElement(Input, null) : /* @__PURE__ */ react_default.createElement("p", null, "other")));
  };
  var TextSplit = (props) => {
    const { text } = props;
    return /* @__PURE__ */ react_default.createElement("div", null, text.split("").map((char) => /* @__PURE__ */ react_default.createElement("p", { key: `text-split-${char}` }, char)));
  };
  var Input = () => {
    const [value, setValue] = useState("test");
    const ref = useRef(1);
    useEffect(() => {
    }, [ref.current]);
    return /* @__PURE__ */ react_default.createElement("div", null, /* @__PURE__ */ react_default.createElement("div", { onClick: () => ref.current += 1 }, "change ref"), /* @__PURE__ */ react_default.createElement("div", { onClick: () => console.log(ref.current) }, "log ref"), /* @__PURE__ */ react_default.createElement(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => {
          setValue(e.target.value);
        }
      }
    ), /* @__PURE__ */ react_default.createElement(TextSplit, { text: value }), ref?.current > 1 && /* @__PURE__ */ react_default.createElement("p", null, "test"));
  };
  var App = () => /* @__PURE__ */ react_default.createElement("div", { draggable: true }, /* @__PURE__ */ react_default.createElement(Testing, { key: "i-made-this" }), /* @__PURE__ */ react_default.createElement(Input, null));
  createApplication(document.getElementById("root"), App);
})();
