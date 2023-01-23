// // type ElementName = string | (({attributes: { [id: string]: string }, children: string[]}) => void)
var createElement = function (fn, props, children, parent) {
    return {
        fn: fn,
        props: props,
        children: children,
        parent: parent,
    };
};
var nodeOrder = [];
// export default JSX;
function jsxPragma(type, props) {
    // Check if the type is a component
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof type === "function") {
        // If it is a component, call it to get the JSX
        if (nodeOrder.find(function (n) { return n.element.fn === type; })) ;
        else {
            nodeOrder.unshift({
                element: createElement(type, props, children),
                parent: null,
            });
            return type(props);
        }
    }
    console.log("type", type);
    var element = document.createElement(type);
    console.log(element);
    if (props) {
        Object.entries(props).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            element.setAttribute(key, value);
        });
    }
    // if (children.some((c) => c === "isComponent")) currentParent = element;
    // console.log("curr: ", currentParent);
    // Append the children to the element
    children.forEach(function (child) {
        if (child === undefined)
            return;
        if (typeof child === "string") {
            // if child is a string, create a text node
            element.appendChild(document.createTextNode(child));
        }
        else {
            console.log(child);
            // if child is an element, append it to the parent element
            element.appendChild(child);
        }
    });
    return element;
}

export { createElement, jsxPragma, nodeOrder };
