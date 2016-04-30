'use strict';
import Component from './component.js';

export default class ContactList extends Component{
    constructor(options) {
        super(options);
        this._contacts = [];

        this.on('click',this._onClick.bind(this));
    }

    _onClick(event) {
        let target = event.target.closest('span');

        if(!target) {
            return;
        }

        this._trigger('contactWasClicked', {contactName: target.textContent});
    }


    showContent(contacts) {
        this._contacts = JSON.parse(contacts);

        this._contacts.forEach(contact => {
            this.addContact(contact)
        });
    }

    updateContactsOnline(contactsOnline) {
        if (!(contactsOnline instanceof Array)) {
            let contact = contactsOnline;
            contactsOnline = [];
            contactsOnline.push(contact);
        }

        contactsOnline.forEach(contact => {
            let index = this._contacts.indexOf(contact);

            if (index > -1) {
                this._showContactOnline(index);
            } else {
                this._contacts.push(contact);
                this.addContact(contact);

                this._showContactOnline(this._contacts.length - 1);
            }
        });
    }

    updateContactOffline(contactName) {
        let index = this._contacts.indexOf(contactName);

        if (index > -1) {
            this._showContactOffline(index);
            } else {
                this._contacts.push(contactName);
                this.addContact(contactName);

                this._showContactOffline(this._contacts.length - 1);
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
    }

    _showContactOffline(index) {
        let ul = this._el.querySelector('ul');

        ul.children[index].classList.remove('online');
        ul.children[index].classList.add('offline');
    }
}