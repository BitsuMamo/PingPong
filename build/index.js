"use strict";
// Landing Page
const onePlayerBtn = document.getElementById('onePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const noPlayerBtn = document.getElementById('noPlayerBtn');
// Even handlers for the buttons
function setSessionandRedirect(type) {
    sessionStorage.setItem('playerMode', type);
    window.location.href = './game.html';
}
onePlayerBtn === null || onePlayerBtn === void 0 ? void 0 : onePlayerBtn.addEventListener('click', function () {
    console.log('onePlayer');
    setSessionandRedirect('onePlayer');
});
twoPlayerBtn === null || twoPlayerBtn === void 0 ? void 0 : twoPlayerBtn.addEventListener('click', function () {
    console.log('twoPlayer');
    setSessionandRedirect('twoPlayer');
});
noPlayerBtn === null || noPlayerBtn === void 0 ? void 0 : noPlayerBtn.addEventListener('click', function () {
    console.log('noPlayer');
    setSessionandRedirect('noPlayer');
});
