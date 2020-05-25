'use strict';

export default class Component {
    constructor(options) {
        this._el = options.element;
    }

    showContent(data) {
        // for override
    }

    showLoadError(err) {
        this._el.innerHTML = '<h1>Error ' +err.code + '</h1>' + JSON.parse(err.message);
    }

    on(eventName, handler) {
        this._el.addEventListener(eventName, handler);
    }

    _trigger(eventName, data, options) {
        options = options || {};

        if (data != undefined) {
            options.detail = data;
        }

        let event = new CustomEvent(eventName, options);

        this._el.dispatchEvent(event);
    }
}
