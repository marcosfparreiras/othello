
// -------------- Funções para controlar redirecionamento dos botões do menu ----------

// Foi utilizando javascript para linkar devido ao uso da tag <button>
// Caso fosse utilizado diretamente links (tag <a>) a estilização ficaria mais complicada
var play_button = document.getElementById('btn_play');
var instructions_button = document.getElementById('btn_instructions');
var options_button = document.getElementById('btn_options');

play_button.onclick = function(){ window.location = 'index.html'}
instructions_button.onclick = function(){ window.location = 'instrucoes.html'}
options_button.onclick = function(){ window.location = 'opcoes.html'}

// -------------- Fim das funções que controlam redirecionamento dos botões do menu ----------