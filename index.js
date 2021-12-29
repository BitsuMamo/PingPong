// LANDING PAGE STUFF
// constants for the html elements.
const onePlayerBtn = document.getElementById('onePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const noPlayerBtn = document.getElementById('noPlayerBtn');

// Event handlers for the buttons.
// Basically, when the user clicks on the button, the button will store the player mode in the session storage.
// Then, the page will reload and the game will start.

onePlayerBtn.addEventListener('click', function(){
    console.log('twoPlayer')
    sessionStorage.setItem('playerMode', 'onePlayer');
    window.location.href = './game.html';
});

twoPlayerBtn.addEventListener('click', function(){
    console.log('twoPlayer')
    sessionStorage.setItem('playerMode', 'twoPlayer');
    window.location.href = './game.html';
});

noPlayerBtn.addEventListener('click', function(){
    console.log('noPlayer')
    sessionStorage.setItem('playerMode', 'noPlayer');
    window.location.href = './game.html';
})