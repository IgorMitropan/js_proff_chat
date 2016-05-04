'use strict';
import Page from './page.js';

let page = new Page({
   element: document.getElementById('container')
});

let logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', page.signOut.bind(page));
}

window.onbeforeunload = page.leaveChat.bind(page);