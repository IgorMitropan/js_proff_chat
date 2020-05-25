'use strict';
import Component from './component.js';

export default class LoginModal extends Component {
    constructor(options) {
        super(options);
        this._form = this._el.querySelector('[data-selector="form"]');
        this._form.addEventListener('submit', this._onSubmit.bind(this));

        this._submitButton = this._el.querySelector('[data-selector="submitButton"]');

        this._notificationField = this._el.querySelector('[data-selector="notification"]');
    }

    _onSubmit(event) {
        event.preventDefault();
        this._submitButton.blur();

        let login = this._form.login.value.trim();
        let password = this._form.password.value.trim();

        if (login) {
            if (password) {
                this._trigger('signIn', {username: login, password: password});
            } else {
                this._form.password.value = '';
                this._showNotification('The password mustn\'t be empty!');
            }
        } else {
            this._form.login.value = '';
            this._showNotification('The login mustn\'t be empty!');
        }
    }

    showLoadError(err) { // override
        if (err.code === 403) {
            this._showNotification('You\'ve entered the wrong password!');
        } else {
            this._showNotification('Connection to database failed! Please try again later!');
        }

    }

    _showNotification(text) {
        let value = this._notificationField.textContent;
        let field = this._notificationField;

        field.textContent = text;
        field.classList.add('comment');

        setTimeout(function() {
            field.textContent = value;
            field.classList.remove('comment');
        }, 1500);
    }
}
