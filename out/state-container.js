"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deep_diff_1 = require("deep-diff");
var deepFreeze = require("deep-freeze");
var StateContainer = /** @class */ (function () {
    function StateContainer() {
        this.pastDiffs = [];
        this.futureDiffs = [];
    }
    Object.defineProperty(StateContainer.prototype, "canUndo", {
        get: function () {
            return !!this.pastDiffs.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateContainer.prototype, "canRedo", {
        get: function () {
            return !!this.futureDiffs.length;
        },
        enumerable: true,
        configurable: true
    });
    StateContainer.prototype.updatePresent = function (diffs) {
        var current = JSON.parse(JSON.stringify(this.state));
        diffs.forEach(function (c) { return deep_diff_1.applyChange(current, {}, c); });
        var differ = deep_diff_1.diff(current, this.state);
        this.state = deepFreeze(current);
        return differ;
    };
    StateContainer.prototype.setState = function (state) {
        var _this = this;
        return Promise.resolve().then(function () {
            var current = JSON.parse(JSON.stringify(state));
            var difference = deep_diff_1.diff(current, _this.state);
            _this.pastDiffs.push(difference);
            _this.state = deepFreeze(current);
            _this.futureDiffs = [];
            return _this.state;
        });
    };
    StateContainer.prototype.getState = function () {
        return this.state;
    };
    StateContainer.prototype.undo = function () {
        var _this = this;
        return Promise.resolve().then(function () {
            if (!_this.canUndo) {
                return;
            }
            var diffsToApply = _this.pastDiffs.pop();
            var newDiffs = _this.updatePresent(diffsToApply);
            _this.futureDiffs.unshift(newDiffs);
            return _this.state;
        });
    };
    StateContainer.prototype.redo = function () {
        var _this = this;
        return Promise.resolve().then(function () {
            if (!_this.canRedo) {
                return;
            }
            var diffsToApply = _this.futureDiffs.shift();
            var newDiffs = _this.updatePresent(diffsToApply);
            _this.pastDiffs.push(newDiffs);
            return _this.state;
        });
    };
    return StateContainer;
}());
exports.StateContainer = StateContainer;
//# sourceMappingURL=state-container.js.map