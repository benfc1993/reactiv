
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var hasRendered = false;
var currentId = '';
var setCurrentId = function (id) { return (currentId = id); };
var incrementId = function () {
    currentNodeIndex += 1;
    currentId = renderOrder[currentNodeIndex];
};
var currentStateIndex = 0;
var incrementCurrentStateIndex = function () { return (currentStateIndex += 1); };
var resetCurrentStateIndex = function () { return (currentStateIndex = 0); };
var componentElements = {};
var renderOrder = [];
var currentNodeIndex = 0;
var connections = {};
var createConnections = function (nodeGraph) {
    var nodeGraphArray = Object.values(nodeGraph);
    nodeGraphArray.forEach(function (layerEntries) {
        layerEntries.forEach(function (entry) {
            var id = entry[0]; entry[1];
            connections[id] = [];
        });
    });
    var _loop_1 = function (i) {
        var entries = nodeGraphArray[i];
        entries.forEach(function (_a) {
            var id = _a[0], column = _a[1];
            if (column !== -1) {
                var parentId = nodeGraphArray[i - 1][column][0];
                connections[parentId].push(id.toString());
            }
            else {
                id.toString();
            }
        });
    };
    for (var i = nodeGraphArray.length - 1; i >= 0; i--) {
        _loop_1(i);
    }
};
var rerender = function (startFrom) {
    hasRendered = true;
    renderOrder = createRenderOrder(startFrom);
    resetCurrentStateIndex();
    currentNodeIndex = 0;
    currentId = startFrom;
    var parentElement = componentElements[startFrom].parentEl;
    var element = componentElements[startFrom].el;
    var res = componentElements[startFrom].fn(componentElements[startFrom].props);
    if (element)
        parentElement === null || parentElement === void 0 ? void 0 : parentElement.replaceChild(res, element);
    componentElements[startFrom].el = res;
};
var createRenderOrder = function (start) {
    var order = [start];
    addIdsToOrder(start, order);
    return order;
};
var addIdsToOrder = function (id, order) {
    var ids = connections[id];
    if (ids.length > 0) {
        ids.forEach(function (id) {
            order.push(id);
            return addIdsToOrder(id, order);
        });
    }
    else {
        return;
    }
};

var createElement = function (fn, props, el) {
    return {
        fn: fn,
        props: props,
        el: el,
        cache: []
    };
};
var currentLayer = -1;
var currentColumn = 0;
var nodeGraph = {};
var layers = [];
// const nodeTree: Map<HTMLElement, HTMLElement[]> = new Map();
var componentOrphans = new Set();
function jsxPragma(type, props) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var children = args.flatMap(function (c) { return c; });
    if (typeof type === 'function') {
        resetCurrentStateIndex();
        if (!hasRendered) {
            var prevLayer_1 = currentLayer;
            currentLayer++;
            currentColumn = layers.reduce(function (count, l) {
                if (l === prevLayer_1)
                    count += 1;
                return count;
            }, -1);
            layers.push(currentLayer);
            var res = functionComponent(type, props, children);
            currentLayer = prevLayer_1;
            return res;
        }
        else {
            var res = functionComponent(type, props, children);
            return res;
        }
    }
    var element = document.createElement(type);
    var filteredChildren = children.filter(function (child) { return typeof child !== 'string' && child !== ''; });
    if (filteredChildren.length > 0) {
        componentOrphans.forEach(function (orphan) {
            var el = orphan[0], id = orphan[1];
            if (filteredChildren.includes(el)) {
                componentElements[id].parentEl = element;
                componentOrphans.delete(orphan);
            }
        });
    }
    if (props) {
        Object.entries(props).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (key.startsWith('on')) {
                var eventType = key.replace('on', '').toLowerCase();
                element.addEventListener(eventType, value);
            }
            else if (key === 'style') {
                element.setAttribute('style', parseStyles(value));
            }
            else if (key === 'className') {
                element.classList.value = value;
            }
            else {
                element.setAttribute(key, value);
            }
        });
    }
    children
        .flatMap(function (c) { return c; })
        .forEach(function (child) {
        if (child === undefined)
            return;
        if (typeof child === 'string') {
            var childEl = document.createTextNode(child);
            element.appendChild(childEl);
        }
        else if (typeof child === 'function') ;
        else {
            element.appendChild(child);
        }
    });
    return element;
}
var functionComponent = function (type, props, children) {
    if (!(currentLayer in nodeGraph)) {
        nodeGraph[currentLayer] = [];
    }
    if (currentId !== undefined) {
        if (hasRendered) {
            incrementId();
            var componentId = currentId;
            var el = type(__assign(__assign({}, props), { children: children }));
            componentOrphans.add([el, componentId]);
            componentElements[componentId] = __assign(__assign({}, componentElements[componentId]), { props: props, el: el });
            return el;
        }
        else {
            var id = Math.floor(Math.random() * 1000).toString();
            setCurrentId(id.toString());
            nodeGraph[currentLayer].push([id, currentColumn]);
            componentElements[id] = createElement(type, __assign(__assign({}, props), { children: children }));
            var el = type(props);
            componentElements[id].el = el;
            if (el)
                componentOrphans.add([el, id]);
            return el;
        }
    }
};
var parseStyles = function (styles) {
    return Object.entries(styles)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, ": ").concat(value, ";");
    })
        .join(' ');
};

var useEffect = function (callback, dependencies) {
    var componentId = currentId;
    var stateIndex = currentStateIndex;
    incrementCurrentStateIndex();
    var cache = componentElements[componentId].cache;
    console.log(componentElements);
    if (!cache[stateIndex]) {
        cache[stateIndex] = { dependencies: undefined, cleanup: null };
    }
    if (cache[stateIndex].dependencies === undefined ||
        cache[stateIndex].dependencies.some(function (dep, idx) { return dep != dependencies[idx]; })) {
        if (cache[stateIndex].cleanup)
            cache[stateIndex].cleanup();
        cache[stateIndex].cleanup = callback();
        cache[stateIndex].dependencies = dependencies;
    }
};

var useState = function (initialValue) {
    var componentId = currentId;
    var stateIndex = currentStateIndex;
    incrementCurrentStateIndex();
    var cache = componentElements[componentId].cache;
    if (!cache[stateIndex])
        cache[stateIndex] = initialValue;
    var setValue = function (state) {
        if (state instanceof Function) {
            cache[stateIndex] = state(cache[stateIndex]);
        }
        else {
            cache[stateIndex] = state;
        }
        rerender(componentId);
    };
    var value = cache[stateIndex];
    return [value, setValue];
};

var Text = function (attributes) {
    var count = attributes.count; attributes.children; var restProps = __rest(attributes, ["count", "children"]);
    var _a = useState(count), value = _a[0], setValue = _a[1];
    var onClick = function () {
        setValue(function (prev) { return prev + 1; });
    };
    useEffect(function () {
        console.log('here');
    }, [value]);
    return (jsxPragma('div', Object.assign({}, restProps), [
      jsxPragma('p', {style: { height: '100px', width: '50px'}, className: 'test another class '}, [
        "Some text ", attributes.count.toString()
      ]),
      jsxPragma('p', {onClick: onClick}, ["Other text ", value.toString()]),
      jsxPragma('p', null, [parent]),
      jsxPragma(Button)
    ]));
};
var testCount = 1;
var Component = function (attributes) {
    attributes.count; attributes.children; var restProps = __rest(attributes, ["count", "children"]);
    var _a = useState(0), value = _a[0], setValue = _a[1];
    var onClick = function () {
        testCount *= 2;
        setValue(function (prev) { return prev + 2; });
    };
    useEffect(function () {
        console.log('rerender');
    }, [value]);
    return (jsxPragma('div', Object.assign({}, restProps), [
      jsxPragma(Text, {className: 'T-1', count: testCount}),
      jsxPragma(Text, {className: 'T-2', count: value}),
      jsxPragma('p', null, [parent]),
      jsxPragma('button', {onClick: onClick}, ["Click Here"])
    ]));
};
var Button = function () {
    return jsxPragma('button', {onClick: function () { }}, ["Click ", parent]);
};

var CreateDOM = function (rootId, rootFn) {
    var tryGetRootNode = document.getElementById(rootId);
    if (tryGetRootNode) {
        tryGetRootNode === null || tryGetRootNode === void 0 ? void 0 : tryGetRootNode.appendChild(rootFn({}));
        createConnections(nodeGraph);
    }
    else {
        throw new Error("No Root node found with id: ".concat(rootId));
    }
};

CreateDOM('root', function () {
    return (jsxPragma('div', {className: "root"}, [
      /* - 9 | L0 C1 */
      jsxPragma('div', {className: "p-1"}, [
        ' ',
        /* - 3 | L1 C0 */
        jsxPragma('p', {className: "c-1-1"}, ["Child 1"])," ", /* - 1 | L2 C0 */
        jsxPragma('p', {className: "c-1-2"}, ["Child 2"])," "/* - 2 | L2 C0 */
      ]),
      jsxPragma('div', {className: "p-2"}, [
        ' ',
        /* - 8 | L1 C0 */
        jsxPragma('p', {className: "c-2-1"}, ["Child 1"])," ", /* - 4 | L2 C1 */
        jsxPragma(Component, {className: 'Component', count: 4}),
        jsxPragma('p', {className: "c-2-2"}, ["Child 2"])," ", /* - 5 | L2 C1 */
        jsxPragma('div', {className: "p-2-1"}, [
          ' ',
          /* - 7 | L2 C1 */
          jsxPragma('p', {className: "c-2-1-1"}, ["grandchild 1"])," "/* - 6 | L3 C2 */
        ])
      ])
    ]));
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
