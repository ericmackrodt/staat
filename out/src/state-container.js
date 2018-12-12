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
        // return Promise.resolve().then(() => {
        // });
        var current = JSON.parse(JSON.stringify(state));
        var difference = deep_diff_1.diff(current, this.state);
        this.pastDiffs.push(difference);
        this.state = deepFreeze(current);
        this.futureDiffs = [];
    };
    StateContainer.prototype.getState = function () {
        return this.state;
    };
    StateContainer.prototype.undo = function () {
        if (!this.canUndo) {
            return;
        }
        var diffsToApply = this.pastDiffs.pop();
        var newDiffs = this.updatePresent(diffsToApply);
        this.futureDiffs.unshift(newDiffs);
    };
    StateContainer.prototype.redo = function () {
        if (!this.canRedo) {
            return;
        }
        var diffsToApply = this.futureDiffs.shift();
        var newDiffs = this.updatePresent(diffsToApply);
        this.pastDiffs.push(newDiffs);
    };
    return StateContainer;
}());
exports.StateContainer = StateContainer;
//# sourceMappingURL=state-container.js.map