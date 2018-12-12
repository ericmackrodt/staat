"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_container_1 = require("./state-container");
function modifyProptotype(proto, container) {
    Object.keys(proto.prototype)
        .filter(function (key) { return typeof proto.prototype[key] === "function"; })
        .reduce(function (prototype, key) {
        var actualFn = prototype[key];
        prototype[key] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var state = container.getState();
            var result = actualFn.apply(void 0, [state].concat(args));
            container.setState(result);
        };
        return prototype;
    }, proto.prototype);
    Object.defineProperty(proto.prototype, "currentState", {
        get: function () { return container.getState(); }
    });
    proto.prototype.undo = function () { return container.undo(); };
    proto.prototype.redo = function () { return container.redo(); };
    return proto;
}
function staat(input) {
    var stateContainer = new state_container_1.StateContainer();
    return modifyProptotype(input, stateContainer);
}
exports.staat = staat;
//# sourceMappingURL=staat.js.map