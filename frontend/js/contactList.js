'use strict';
import Component from './component.js';

export default class ContactList extends Component{
    constructor(options) {
        super(options);
        this._contacts = [];

        this.on('click',this._onClick.bind(this));
    }

//-----------------------public methods---------------
    showContent(contacts) {
        this._contacts = JSON.parse(contacts);

        this._contacts.forEach(contact => {
            this.addContact(contact)
        });
    }

    updateContactsOnline(contactsOnline) {
        if (!(contactsOnline instanceof Array)) {
            contactsOnline = [contactsOnline];
        }

        contactsOnline.forEach(contact => {
            this._updateContact(contact,  this._showContactOnline.bind(this));

            this._contacts.unshift(contact);
        });
    }

    updateContactOffline(contact) {
        this._updateContact(contact,  this._showContactOffline.bind(this));

        this._contacts.push(contact);
    }

//-----------------event handler-------------------
    _onClick(event) {
        let target = event.target.closest('span');

        if(!target) {
            return;
        }

        this._trigger('contactWasClicked', {contactName: target.textContent});
    }

//----------------------- subordinate private method ---------------
    _updateContact(contact, fn) {
        let index = this._contacts.indexOf(contact);

        if (index > -1) {
            this._contacts.splice(index, 1);

            fn(index);
        } else {
            this.addContact(contact);
            fn(this._contacts.length);
        }
    }

//------------------subordinate non-logical methods working with view---------------
    addContact(contactName) {
        let ul = this._el.querySelector('ul');
        let newItem = '<li class="offline"><span>' + contactName + '</span></li>' + '\n';
        ul.insertAdjacentHTML('beforeEnd', newItem);
    }

    _showContactOnline(index) {
        let ul = this._el.querySelector('ul');

        ul.children[index].classList.remove('offline');
        ul.children[index].classList.add('online');

        ul.insertBefore(ul.children[index], ul.firstElementChild);
    }

    _showContactOffline(index) {
        let ul = this._el.querySelector('ul');

        ul.children[index].classList.remove('online');
        ul.children[index].classList.add('offline');

        ul.appendChild(ul.children[index]);
    }
}