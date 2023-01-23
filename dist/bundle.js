/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"App\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var _Components_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Components/Component */ \"./src/Components/Component.tsx\");\n/* provided dependency */ var jsx = __webpack_require__(/*! ./jsx */ \"./src/jsx.ts\");\n\nvar App = function App() {\n  return jsx.jsxPragma(\"div\", {\n    className: \"App\"\n  }, jsx.jsxPragma(\"h1\", null, \"I Think this works!\"), jsx.jsxPragma(_Components_Component__WEBPACK_IMPORTED_MODULE_0__.Component, {\n    count: 3,\n    className: \"component\"\n  }, jsx.jsxPragma(_Components_Component__WEBPACK_IMPORTED_MODULE_0__.Text, {\n    count: 2\n  })), jsx.jsxPragma(_Components_Component__WEBPACK_IMPORTED_MODULE_0__.Component, {\n    count: 3,\n    className: \"component-2\"\n  }));\n};\n\n//# sourceURL=webpack://reactiv/./src/App.tsx?");

/***/ }),

/***/ "./src/Components/Component.tsx":
false,

/***/ "./src/hooks/useState.ts":
/*!*******************************!*\
  !*** ./src/hooks/useState.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useState\": () => (/* binding */ useState)\n/* harmony export */ });\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../renderer */ \"./src/renderer.ts\");\n\nvar values = [];\nvar useState = function useState(initialValue) {\n  var parent = _renderer__WEBPACK_IMPORTED_MODULE_0__.globalParent;\n  if (!values[parent]) values[parent] = initialValue;\n  var setValue = function setValue(state) {\n    if (state instanceof Function) {\n      values[parent] = state(values[parent]);\n    } else {}\n    (0,_renderer__WEBPACK_IMPORTED_MODULE_0__.rerender)(parent);\n  };\n  return [values[parent], setValue];\n};\n\n//# sourceURL=webpack://reactiv/./src/hooks/useState.ts?");

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Root\": () => (/* binding */ Root)\n/* harmony export */ });\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App */ \"./src/App.tsx\");\n/* harmony import */ var _jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jsx */ \"./src/jsx.ts\");\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer */ \"./src/renderer.ts\");\n/* provided dependency */ var jsx = __webpack_require__(/*! ./jsx */ \"./src/jsx.ts\");\n\n\n\nvar Root = function Root() {\n  return jsx.jsxPragma(\"div\", {\n    className: \"root\"\n  }, jsx.jsxPragma(_App__WEBPACK_IMPORTED_MODULE_0__.App, null));\n};\nRoot({});\n// console.log(nodeOrder);\nconsole.log(_jsx__WEBPACK_IMPORTED_MODULE_1__.connections);\n(0,_renderer__WEBPACK_IMPORTED_MODULE_2__.render)();\n\n//# sourceURL=webpack://reactiv/./src/index.tsx?");

/***/ }),

/***/ "./src/jsx.ts":
/*!********************!*\
  !*** ./src/jsx.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"connections\": () => (/* binding */ connections),\n/* harmony export */   \"createElement\": () => (/* binding */ createElement),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"tree\": () => (/* binding */ tree)\n/* harmony export */ });\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ \"./src/renderer.ts\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }\nfunction _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : \"undefined\" != typeof Symbol && arr[Symbol.iterator] || arr[\"@@iterator\"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i[\"return\"] && (_r = _i[\"return\"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nvar createElement = function createElement(fn, props, el) {\n  return {\n    fn: fn,\n    props: props,\n    el: el\n  };\n};\nvar tree = {};\nvar currentLayer = -1;\nvar connections = {};\n\n// export default JSX;\nfunction jsxPragma(type, props) {\n  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    args[_key - 2] = arguments[_key];\n  }\n  var children = args.flatMap(function (c) {\n    return c;\n  });\n  if (typeof type === \"function\") {\n    if (_renderer__WEBPACK_IMPORTED_MODULE_0__.hasRendered) (0,_renderer__WEBPACK_IMPORTED_MODULE_0__.incrementId)();\n    if (!_renderer__WEBPACK_IMPORTED_MODULE_0__.hasRendered || _renderer__WEBPACK_IMPORTED_MODULE_0__.nodeOrder.find(function (n) {\n      return (n === null || n === void 0 ? void 0 : n.id) === _renderer__WEBPACK_IMPORTED_MODULE_0__.renderIds[_renderer__WEBPACK_IMPORTED_MODULE_0__.currentId] && n.element.fn === type;\n    })) {\n      var prevLayer = currentLayer;\n      currentLayer++;\n      functionComponent(type, props, children);\n      currentLayer = prevLayer;\n    }\n    return;\n  }\n  var element = document.createElement(type);\n  if (props) {\n    Object.entries(props).forEach(function (_ref) {\n      var _ref2 = _slicedToArray(_ref, 2),\n        key = _ref2[0],\n        value = _ref2[1];\n      if (key.startsWith(\"on\")) {\n        var eventType = key.replace(\"on\", \"\").toLowerCase();\n        element.addEventListener(eventType, value);\n      } else if (key === \"style\") {\n        element.setAttribute(\"style\", parseStyles(value));\n      } else if (key === \"className\") {\n        element.classList.value = value;\n      } else {\n        element.setAttribute(key, value);\n      }\n    });\n  }\n  children.flatMap(function (c) {\n    return c;\n  }).forEach(function (child) {\n    if (child === undefined) return;\n    if (typeof child === \"string\") {\n      var childEl = document.createTextNode(child);\n      element.appendChild(childEl);\n    } else if (typeof child === \"function\") {} else {\n      element.appendChild(child);\n    }\n  });\n  return element;\n}\nvar functionComponent = function functionComponent(type, props, children) {\n  if (!(currentLayer in connections)) {\n    connections[currentLayer] = [];\n  }\n  connections[currentLayer].push(type.name);\n  var record = _renderer__WEBPACK_IMPORTED_MODULE_0__.nodeOrder.find(function (n) {\n    return (n === null || n === void 0 ? void 0 : n.id) === _renderer__WEBPACK_IMPORTED_MODULE_0__.renderIds[_renderer__WEBPACK_IMPORTED_MODULE_0__.currentId];\n  });\n  if (_renderer__WEBPACK_IMPORTED_MODULE_0__.hasRendered && record != null) {\n    record.element = createElement(type, _objectSpread(_objectSpread({}, props), {}, {\n      children: children\n    }));\n    return;\n  } else {\n    var res = type(props);\n    _renderer__WEBPACK_IMPORTED_MODULE_0__.nodeOrder.unshift({\n      id: Math.floor(Math.random() * 1000),\n      element: createElement(type, _objectSpread(_objectSpread({}, props), {}, {\n        children: children\n      })),\n      parent: null\n    });\n    return res;\n  }\n};\nvar parseStyles = function parseStyles(styles) {\n  return Object.entries(styles).map(function (_ref3) {\n    var _ref4 = _slicedToArray(_ref3, 2),\n      key = _ref4[0],\n      value = _ref4[1];\n    return \"\".concat(key, \": \").concat(value, \";\");\n  }).join(\" \");\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (jsxPragma);\n\n//# sourceURL=webpack://reactiv/./src/jsx.ts?");

/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"currentId\": () => (/* binding */ currentId),\n/* harmony export */   \"globalParent\": () => (/* binding */ globalParent),\n/* harmony export */   \"hasRendered\": () => (/* binding */ hasRendered),\n/* harmony export */   \"incrementId\": () => (/* binding */ incrementId),\n/* harmony export */   \"nodeOrder\": () => (/* binding */ nodeOrder),\n/* harmony export */   \"render\": () => (/* binding */ render),\n/* harmony export */   \"renderIds\": () => (/* binding */ renderIds),\n/* harmony export */   \"rerender\": () => (/* binding */ rerender)\n/* harmony export */ });\nvar hasRendered = false;\nvar currentId = 0;\nvar incrementId = function incrementId() {\n  currentId++;\n};\nvar nodeOrder = [];\nvar globalParent = 0;\nvar render = function render() {\n  hasRendered = true;\n  var parentElement = document.getElementById(\"root\");\n  nodeOrder.forEach(function (n) {\n    var _parentElement;\n    currentId++;\n    var res = n.element.fn(n.element.props);\n    (_parentElement = parentElement) === null || _parentElement === void 0 ? void 0 : _parentElement.appendChild(res);\n    n.element.el = res;\n    n.parent = parentElement;\n    parentElement = res;\n    globalParent++;\n  });\n  globalParent = 0;\n};\nvar renderIds = [];\nvar rerender = function rerender(startFrom) {\n  globalParent = startFrom;\n  renderIds = [];\n  for (var i = startFrom; i < nodeOrder.length; i++) {\n    renderIds.push(nodeOrder[i].id);\n  }\n  var parentElement = nodeOrder[startFrom].parent;\n  for (var _i = startFrom; _i < nodeOrder.length; _i++) {\n    currentId = _i - startFrom;\n    var n = nodeOrder[_i];\n    var res = n.element.fn(n.element.props);\n    if (_i === startFrom && n.element.el) {\n      var _n$parent;\n      (_n$parent = n.parent) === null || _n$parent === void 0 ? void 0 : _n$parent.replaceChild(res, n.element.el);\n    } else {\n      var _parentElement2;\n      (_parentElement2 = parentElement) === null || _parentElement2 === void 0 ? void 0 : _parentElement2.appendChild(res);\n    }\n    n.element.el = res;\n    n.parent = parentElement;\n    parentElement = res;\n    globalParent++;\n  }\n};\n\n//# sourceURL=webpack://reactiv/./src/renderer.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.tsx");
/******/ 	
/******/ })()
;