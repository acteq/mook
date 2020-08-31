"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHooks = exports.Store = void 0;
var react_1 = require("react");
var Store = /** @class */ (function () {
    function Store() {
        this.subscribers = new Set();
    }
    Store.prototype.notify = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.subscribers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var subscriber = _c.value;
                subscriber(this.model);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Store.prototype.setModel = function (newModel) {
        var _this = this;
        this.model = newModel;
        setTimeout(function () {
            _this.notify();
        }, 0);
    };
    return Store;
}());
exports.Store = Store;
function createHooks(hook) {
    var store = new Store();
    var wrapped = function (args) {
        var model = hook(args);
        store.setModel(model);
        return store.model;
    };
    var standin = function (depsFn) {
        var _a = __read(react_1.useState(), 2), state = _a[0], setState = _a[1];
        var depsFnRef = react_1.useRef(depsFn);
        depsFnRef.current = depsFn;
        var depsRef = react_1.useRef([]);
        react_1.useEffect(function () {
            if (!store)
                return;
            function subscriber(val) {
                if (!depsFnRef.current) {
                    setState({});
                }
                else {
                    var oldDeps = depsRef.current;
                    var newDeps = depsFnRef.current(val);
                    if (hasChanged(oldDeps, newDeps)) {
                        setState({});
                    }
                    depsRef.current = newDeps;
                }
            }
            store.subscribers.add(subscriber);
            return function () {
                store.subscribers.delete(subscriber);
            };
        }, [store]);
        //if (process.env.NODE_ENV !== 'production' )
        // throw new Error(message)
        return store ? store.model : undefined;
    };
    return { wrapped: wrapped, standin: standin };
}
exports.createHooks = createHooks;
function hasChanged(oldDeps, newDeps) {
    if (oldDeps.length !== newDeps.length) {
        return true;
    }
    for (var index in newDeps) {
        if (oldDeps[index] !== newDeps[index]) {
            return true;
        }
    }
    return false;
}
