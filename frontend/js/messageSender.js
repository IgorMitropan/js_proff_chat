'use strict';
import Component from './component.js';

export default class MessageSender extends Component{
    constructor(options) {
        super(options);
        this._textField = this._el.querySelector('[data-selector="text"]');
        this._sendButton = this._el.querySelector('[data-selector="sendButton"]');

        this._form = this._el.querySelector('[data-selector="form"]');
        this._form.addEventListener('submit', MessageSender._preventDefault);

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

//-----------------------public methods---------------
    activateInput() {
        this._form.addEventListener('submit', this._onSubmit);
        this._textField.addEventListener('keydown', this._onKeyDown);
        this._textField.disabled = false;
    }


    disActivateInput() {
        this._form.removeEventListener('submit', this._onSubmit);
        this._textField.removeEventListener('keydown', this._onKeyDown);
        this._textField.disabled = true;
    }

    mentionContact(name) {
        this._textField.value += '@' + name;
    }

    quoteMessage(data) {
        this._textField.value += '@' + data.username + ' ' + data.date + ' wrote: "' + data.message + '"';
    }

    resetText() {
        this._textField.value = '';
    }

    showLoadError() { // override
        this._showNotification('This attempt to send message failed, please try again later...');
    }

//------------------ event handlers---------------------
    static _preventDefault(event) {
        event.preventDefault();
    }

    _onSubmit(event) {
        this._sendButton.blur();

        let message = this._textField.value.trim();

        if (message) {
            this._trigger('send', {message: message});
        } else {
            this._textField.value = '';
            this._showNotification('Server doesn\'t accept empty messages!');
        }
    }

    _onKeyDown(event) {
        if (event.keyCode === 13) {
            this._onSubmit(event);
        }
    }

//------------- non-logical method working with view---------------
    _showNotification(text) {
        let value = this._textField.value;
        let textField = this._textField;

        textField.value = text;

        setTimeout(function() {
            textField.value = value;
        }, 1500);
    }
}
