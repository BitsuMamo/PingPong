// Landing Page

const onePlayerBtn = document.getElementById('onePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const noPlayerBtn = document.getElementById('noPlayerBtn');

// Even handlers for the buttons
function setSessionandRedirect(type: string){
  sessionStorage.setItem('playerMode', type);
  window.location.href = './game.html';
}

onePlayerBtn?.addEventListener('click', function(){
  console.log('onePlayer');
  setSessionandRedirect('onePlayer');
});

twoPlayerBtn?.addEventListener('click', function(){
  console.log('twoPlayer');
  setSessionandRedirect('twoPlayer');
});

noPlayerBtn?.addEventListener('click', function(){
  console.log('noPlayer');
  setSessionandRedirect('noPlayer');
});
