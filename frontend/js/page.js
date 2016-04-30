'use strict';

import * as polyfills from'./polyfills';

polyfills.installMatches(); //cross browser polyfill for 'matches' (does not supported by IE)
polyfills.installClosest(); //cross browser polyfill for 'closest' (does not supported by IE)
polyfills.installCustomEvent(); //cross browser polyfill for 'custom events' (does not supported by IE)

import AjaxService from './ajaxService.js';
import ContactList from './contactList.js';
import MessagesViewer from './messagesViewer.js';
import MessageSender from './messageSender.js';
import LoginModal from './loginModal.js';

export default class Page {
    constructor(options) {
        this._el = options.element;

        this._contactList = new ContactList({
            element: this._el.querySelector('[data-component="contactList"]')
        });
        this._contactList.on('contactWasClicked', this._onContactWasClicked.bind(this));

        this._loadContactList();

        this._messagesViewer = new MessagesViewer({
            element: this._el.querySelector('[data-component="messagesViewer"]')
        });
        this._messagesViewer.on('messageWasClicked', this._onMessageWasClicked.bind(this));

        this._loadMessages();

        let messageSender = this._el.querySelector('[data-component="messageSender"]');
        if (messageSender) {
            this._messageSender = new MessageSender({element: messageSender});
            this._messageSender.on('send', this._sendMessage.bind(this));
        }

        let loginModal = this._el.querySelector('[data-component="loginModal"]');
        if (loginModal) {
            this._loginModal = new LoginModal({element: loginModal});
            this._loginModal.on('signIn', this._signIn.bind(this));
        }

        this.socket = io();
        this.socket.on('connect', this._onSocketConnected.bind(this));
        this.socket.on('disconnect', this._onSocketDisconnected.bind(this));
        this.socket.on('change user status', this._changeUserStatus.bind(this));
        this.socket.on('leave', this._contactList.updateContactOffline.bind(this._contactList));
        this.socket.on('join', this._contactList.updateContactsOnline.bind(this._contactList));
        this.socket.on('message', this._messagesViewer.addMessage.bind(this._messagesViewer));
        this.socket.on('error saving message', this._messageSender.showLoadError.bind(this._messageSender));
    }

//---------------- public method-----------------
    signOut(event) {
        event.preventDefault();

        AjaxService.ajax('/logout', {
            method: 'POST'
        }).then(
            this._changeUserStatus.bind(this));
    }

//------------------event handlers---------------
    _signIn(event) {
        AjaxService.ajax('/login', {
            method: 'POST',
            body: event.detail
        }).then(
            this._changeUserStatus.bind(this),
            this._loginModal.showLoadError.bind(this._loginModal));
    }

    _onContactWasClicked(event) {
        if (this._messageSender) {
            this._messageSender.mentionContact(event.detail.contactName);
        }
    }

    _onMessageWasClicked(event) {
        if (this._messageSender) {
            this._messageSender.quoteMessage(event.detail);
        }
    }

    _onSocketConnected() {
        document.querySelector('[data-selector="status"]').textContent = 'You are online!';
        this._messageSender.activateInput();

        this.socket.emit('Who is online?', '', this._contactList.updateContactsOnline.bind(this._contactList));
    }

    _onSocketDisconnected() {
        document.querySelector('[data-selector="status"]').textContent = 'Sorry, connection lost...';
        this._messageSender.disactivateInput();
    }

    _sendMessage(event) {
        this.socket.emit('message', event.detail.message, this._messageSender.resetText.bind(this._messageSender));
    }

//----------------subordinate private methods--------------
    _loadContactList() {
        AjaxService.ajax('/contacts', {})
            .then(
                this._contactList.showContent.bind(this._contactList),
                this._contactList.showLoadError.bind(this._contactList));
    }

    _loadMessages() {
        AjaxService.ajax('/messages', {}).then(
            this._messagesViewer.showContent.bind(this._messagesViewer),
            this._messagesViewer.showLoadError.bind(this._messagesViewer));
    }

    _changeUserStatus() {
        location.reload();
    }
}