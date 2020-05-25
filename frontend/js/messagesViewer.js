'use strict';
import Component from './component.js';

export default class MessagesViewer extends Component{
    constructor(options) {
        super(options);

        this.on('click',this._onClick.bind(this));
    }

    static _dateParse(str) {
        let date;
        try {
            date = new Date(str);
        } catch (e) {
            date = Date.now();
        }

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear() % 100;

        let hours = date.getHours();
        if (hours < 10) {
            hours = '0'+ hours;
        }

        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0'+ minutes;
        }

        return  month + '/' + day + '/' + year + ' at ' + hours + ':' + minutes;
    }

    showContent(data) {
        this._el.innerHTML = '';

        let comments = JSON.parse(data);

        comments.forEach(element => {
            this.addMessage(element);
        });

    }

//------------- non-logical methods working with view---------------
    addMessage(data) {
        let created = MessagesViewer._dateParse(data.created);

        let message = document.createElement('fieldset');
        message.classList.add('message');

        let header = document.createElement('legend');
        header.classList.add('messageHeader');
        header.innerHTML = '<b>' + data.username + '</b> <i>' + created + '</i>';
        message.appendChild(header);

        let text = document.createTextNode(data.message);
        message.appendChild(text);

        this._el.appendChild(message);

        this._el.scrollTop = this._el.scrollHeight;
    }

    _onClick(event) {
        let target = event.target.closest('fieldset');

        if(!target) {
            return;
        }

        this._trigger('messageWasClicked', {
            username: target.firstElementChild.children[0].textContent,
            date: target.firstElementChild.children[1].textContent,
            message: target.lastChild.textContent
        });
    }
}