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
        this._fillContactList(contacts);
        this._contacts.sort(this._compareContacts);

        this._renderContent();
    }

    updateContactsOnline(contactNames) {
        if (!(contactNames instanceof Array)) {
            contactNames = [contactNames];
        }

        contactNames.forEach(contactName => {
            this._updateContact(contactName,  'online');
        });

        this._contacts.sort(this._compareContacts);

        this._renderContent();
    }

    updateContactOffline(contactName) {
        this._updateContact(contactName,  'offline');

        this._contacts.sort(this._compareContacts);

        this._renderContent();
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
    _fillContactList(contacts) {
        JSON.parse(contacts).forEach(contact => {
            this._contacts.push({name: contact, status: 'offline'})
        });
    }

    _renderContent() {
        this._el.innerHTML = '<ul></ul>';

        this._contacts.forEach(contact => {
            this.addContact(contact)
        });
    }

    _updateContact(contactName, status) {
        let flag = false;

        for (let i = 0; i < this._contacts.length; i++) {
            if (this._contacts[i].name === contactName) {
                this._contacts[i].status = status;

                flag = true;
            }
        }

        if (!flag) {
            this._contacts.push({name: contactName, status: status});
        }
    }

    _compareContacts(first, second) {
        if (first.status !== second.status) {
            if (first.status === 'online') {
                return -1;
            } else {
                return 1;
            }
        } else {
            return (first.name.toLowerCase() > second.name.toLowerCase());
        }
    }

//------------------subordinate non-logical method working with view---------------
    addContact(contactName) {
        let ul = this._el.querySelector('ul');
        let newItem = '<li class="' + contactName.status + '"><span>' + contactName.name + '</span></li>' + '\n';
        ul.insertAdjacentHTML('beforeEnd', newItem);
    }
}