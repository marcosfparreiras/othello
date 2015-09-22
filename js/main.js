// Arquivo principal de JavaScript para a implementação do jogo Othello para HTML5

// ---------------- Definição das variáveis globais ----------

// Define variáveis usadas para o controle de fluxo de telas
var SCREEN_START_MENU = 1; 		// indica tela do menu inicial
var SCREEN_GAME = 2;			// indica tela do jogo em si
var SCREEN_INSTRUCTIONS = 3;	// incida tela de instruções
var SCREEN_OPTIONS = 4;			// indica tela de opções/configurações

var game_screen = SCREEN_START_MENU;	// Define tela inicial como sendo o menu Inicializa
var game_screen = SCREEN_GAME;	// Define tela inicial como sendo o menu Inicializa


// Define tamanho de cada um dos 64 quadrados (8x8) do tabuleiro
var space_size = 60;
// Define raio das peças que serão poscionadas sobre o tabuleiro
var pieceRaidus = 20;

// Define largura e altura da tela, respectivamente
var screenWidth = 800;		// Define largura da tela
var screenHeight = 500;		// Define altura da tela

// Define número de casas que o tabuleiro terá na horizontal e na vertical (padrão: 8)
var boardSize = 8;

// Calcula largura e altura do tabuleiro baseado no número de peças que serão usadas e o tamanho de cada uma delas
var boardWidth = boardSize * space_size;			// Define largura do canvas do tabuleiro
var boardHeight = boardSize * space_size;			// Define altura do canvas do tabuleiro

// Variáveis de offset usadas para centralizaro tabuleiro
// var x_offset = ( screenWidth - 8*space_size ) / 2;
var y_offset = ( screenHeight - 8*space_size ) / 2;
var x_offset = y_offset;

// Define matrix representando cada casa do tabuleiro
var board;

//Define constantes para representar presenças de peças de cada jogar no tabuleiro
var P1_PIECE = 1;		// no tabuleiro, as casas que tiverem 1 (P1) terão peça do jogador 1
var P2_PIECE = 2;  	// no tabuleiro, as casas que tiverem 2 (P2) terão peça do jogador 2

// Define constantes com das peças usadas por cada jogador
var P1_COLOR = "rgb(255,222,173)";		// peças do player 1 recebem cor creme
var P2_COLOR = "rgb(0,0,0)";			// peças do player 2 recebem cor preta

// Define qual jogador está jogando
var P1_TURN = 1;	// define turno do player 1
var P2_TURN = 2;	// define turno do player 2
var player_turn = P1_TURN;	// varíavel guarda de quem é o turno

// Define a função do jogo (player vs player, player vs máquina)
var GAME_PVP = 1; 	// define jogo player vs player
var GAME_PVM = 2;	// define jogo player vs machine
var game_mode = GAME_PVM;	// variável guarda o modo de jogo
// var game_mode = GAME_PVP;	// variável guarda o modo de jogo

// Constantes usadas para controle de retorno da função addPiece( event )
var IN_BOARD_VALID = 1;
var IN_BOARD_INVALID = 2;
var OUT_BOARD = 3;

// Matriz com possíveis movimentos do jogador da vez. 1 indica que aquele movimento é possível
var possible_moves;

// Matriz com peças que serão capturadas
var pieces_to_switch;

// Dicionário com a posição que foi clicada. Ex: pos_clicked = {i: 3, j:2} => pos_clicked.i=3 e pos_clicked.j=2
var pos_clicked;

// variável conta quantas vezes seguidas o jogo ficou sem jogadas possíveis. Se chegar a dois, o jogo termina, pois nenhum dos jogadores terá jogadas possíveis
var count_no_moves = 0;

// variável usada para armazenar estado de movimentação e peças para alterar (moves.possible_moves e moves.pieces_to_switch)
var moves = {};

// variável armazena o valor referente ao infinito (valor muito grande)
var INFINITY = 999999;

// Variáveis usadas somente para testes
var i_test = 0;
var j_test = 0;

// estados terão
// 		board
// 		depth
// 		successors
// 		utility

// --------------Fim da definição das variáveis globais ----------

// Função executada assim que a tela é carregada
window.onload = function() {
	// gameAction();
	canvas.addEventListener("mousedown", getMouseClick );
	manageScreen();
};

function manageScreen() {
	if( game_screen == SCREEN_START_MENU ) {
		drawScreenStartMenu();
	}
	else if( game_screen == SCREEN_GAME ) {
		initializeGame();
	}
	else if( game_screen == SCREEN_INSTRUCTIONS ) {

	}
	else if( game_screen == SCREEN_OPTIONS ) {

	}
}

function drawScreenStartMenu() {
	// console.log('ok');
	drawScreen();

	// Desenha quadrado com início no ponto (x,y) e de tamanho size. O ponto (x,y) é referente ao canto superior esquerdo do quadrado
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var buttom_width = 100;
	var button_height = 50;
	var num_buttons = 3;

	ctx.beginPath();
	ctx.rect(50,50,buttom_width,button_height);
	ctx.fillStyle = '#DD6666';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();

}

function initializeGame() {
	pos_clicked = {i: 0, j:0};
	board = initializeBoard();
	// initializePossibleMoves();
	// initializePiecesToSwitch();

	moves = getPossibleMoves( player_turn, board );
	possible_moves = moves.possible_moves;
	pieces_to_switch = moves.pieces_to_switch;

	player_turn = P1_TURN;
	// drawCanvas( board, possible_moves );
	newTurn( player_turn, board );	// inicializa turno com jogador e tabuleiro
}

// Função executa turno de jogada da máquina
function machineTurn( board, player_turn ) {
	// var move;
	// alert('Turno da máquina');
	// move = getMachineMove( board );
	// board[move.i][move.j] = player_turn;

	var machine_move;
	var state = {};

	state.depth = 0;
	state.board = board;
	state.successors = [];
	state.utility = 0;
	state.player_turn = player_turn;
	// getBestNextMove(state);

	// printState(state);
	miniMaxDecision(state);
	// machine_move = getMachineMove(board);
	// return alphaBetaSearch( state );
	// return getMachineMove(board);
	// return switchPieces(move.i, move.j, player_turn, board, pieces_to_switch);
}



// retorna board, possible_moves e pieces_to_switch 
function miniMaxDecision(state) {
	// move receberá o estado retornado de maxValue

	// alert('entrou miniMaxDecision');
	var final_state = maxValue(state);	// final_state recebe toda a árvore de estados
	// alert('saiu do miniMaxDecision');
	// alert(final_state.utility);
	// alert(final_state.successors.length);
	var move_state = getMaxUtilitySuccessor(final_state.successors); // move_state recebe o sucessor imediado do estado com maior valor de utilidade
	// printStateBoard(move_state);
	setGlobalBoard( move_state.board );	// Seta board global como sendo o estado do tabuleiro referente ao moviemento feito
}

// Retorna um estado
function maxValue(state) {
	var successors, maxUtility, next_state;
	// alert( "maxValue\n" +printState(state) + "\n" + printStateBoard(state) );
	// alert('entoru maxValue');
	if( isTerminalState( state ) ) {
		// alert('maxValue - TerminalState');
		state.utility = getUtility( state );
		// alert('utility: ' + state.utility)
		return state;
	}
	state.utility = -INFINITY;
	maxUtility = -INFINITY;
	// printState(state);
	state.successors = getSuccessors(state);
	// alert('maxValue - depois getSuccessors');
	for(var i=0; i<state.successors.length; i++) {
		// state = getMaxUtilityState(state, minValue(successors[i]));
		// state.utility = maxUtility;
		// maxUtility = getMaxUtility(state, minValue(successors[i]));
		next_state = minValue(state.successors[i]);
		maxUtility = Math.max(maxUtility, next_state.utility);
		
		// state.utility = v.utility;
	}
	state.utility = maxUtility;
	return state;
}

// Retorna um estado
function minValue(state) {
	var successors, minUtility, next_state;
	// printStateBoard(state, "minValue");
	// alert( "minValue\n" + printStateBoard(state) );
	// alert( "minValue\n" +printState(state) + "\n" + printStateBoard(state) );
	if( isTerminalState( state ) ) {
		// alert('minValue - TerminalState');
		state.utility = getUtility( state );
		return state;
	}
	state.utility = INFINITY;
	minUtility = INFINITY;
	// alert('minValue - antes getSuccessors');
	state.successors = getSuccessors(state);
	// alert('minValue - depois getSuccessors');
	for(var i=0; i<state.successors.length; i++) { 
		// state = getMinUtilityState( state, maxValue(successors[i]) );
		next_state = maxValue(state.successors[i]);
		minUtility = Math.min(minUtility, next_state.utility);

		// v = getMinUtilityState( state, maxValue(successors[i]) );
		// state.utility = v.utility;
	}
	state.utility = minUtility;
	return state;


}

function getMinUtilityState( state1, state2 ) {
	if(state1.utility <= state2.utility) {
		return state1;
	}
	else {
		return state2;
	}
}

function getMinUtility( state1, state2 ) {
	if(state1.utility <= state2.utility) {
		return state1.utility;
	}
	else {
		return state2.utility;
	}
}

function getMaxUtilityState( state1, state2 ) {
	if(state1.utility <= state2.utility) {
		return state2;
	}
	else {
		return state1;
	}
}

// Função retorna o stado com maior valor de utilidade
function getMaxUtilitySuccessor(successors) {
	var successor = successors[0];
	for(var i=1; i<successors.length; i++) {
		if( successors[i].utility > successor.utility ) {
			successor = successors[i];
		}
	}
	return successor;
}



function getSuccessors(state) {
	var successors = [];
	var s, new_depth, new_utility, new_successors, new_board, new_player_turn; 
	var state_board = state.board;
	var state_clone;

	new_depth = state.depth + 1;
	new_successors = [];
	new_utility = -state.utility;
	new_player_turn = changePlayerTurn( state.player_turn );
	var moves = getPossibleMoves( state.player_turn, state.board );


	// var current_board = state.board.prototype;

	// var current_state = {};
	// current_state.prototype = state;
	// current_state.prototype.switchPieces = function(i, j, player_turn, board, pieces_to_switch ) {
	// 	var piece, to_switch;
	// 	to_switch = pieces_to_switch[i][j]
	// 	for(var k=0; k<to_switch.length; k++) {
	// 		piece = to_switch[k];
	// 		board[piece.i][piece.j] = player_turn ;
	// 	}
	// 	board[i][j] = player_turn;
	// 	return board;
	// };
	
	// current_state.prototype.board = state.board;
	// console.log(current_board);
	
	var test_state = $.extend( {}, state);
	for( var i=0; i<moves.possible_moves.length; i++ ) {
		for( var j=0; j<moves.possible_moves.length; j++ ) {
			if( moves.possible_moves[i][j] == 1 ) {
				// state_clone = clone(state);
				test_state = $.extend(true, {}, state);
				new_board = switchPieces(i, j, state.player_turn, test_state.board, moves.pieces_to_switch );
				// new_board = switchPieces(i, j, state.player_turn, current_state.prototype.board, moves.pieces_to_switch );
				// new_board = current_state.prototype.switchPieces(i, j, state.player_turn, current_state.prototype.board, moves.pieces_to_switch );
				// current_state = Object.create(state);
				s = {};
				s.depth = new_depth;
				s.board = new_board;
				s.successors = new_successors;
				s.utility = new_utility;
				s.player_turn = new_player_turn;
				// successors.push()
				// successors[successors.length] = s;
				successors.push(s);
				// Array.prototype.push.apply(successors, s);
			}
		}
	}
	// state.board = current_board;
	return successors;
}





function clone(obj) {
    if (null == obj || "object" != typeof obj) {
    	return obj;
    }
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function my_clone( obj ) {
	var new_obj = {}
	for(var key in obj) {
		new_obj[key] = obj[key];
	}
	return new_obj;
}





// retorna array com os estados sucessores do estado passado como parâmetro
	// state.depth = 0;
	// state.board = board;
	// state.successors = [];
	// state.utility = 0;
	// state.player_turn = player_turn;
function getSuccessors_old( state ) {
	var moves, next_move_player; //, board_local,;
	var successors = [];
	var initial_board = state.board;

	next_move_player = changePlayerTurn( state.player_turn );
	// alert("player_turn: " + state.player_turn + "; Next move player: " + next_move_player);
	// printState(state);
	// var sucessor;
	moves = getPossibleMoves( state.player_turn, state.board );
	// moves.possible_moves;
	// moves.pieces_to_switch;

	for( var i=0; i<moves.possible_moves.length; i++ ) {
		// alert('ok');
		for( var j=0; j<moves.possible_moves.length; j++ ) {
			// alert(i + '-' + j);
			if( moves.possible_moves[i][j] == 1 ) {
				// var successor = {}
				// successor.depth = state.depth + 1;
				// successor.board = switchPieces(i, j, state.player_turn, state.board, moves.pieces_to_switch );
				// successor.board[i][j] = state.player_turn;
				// successor.successors = [];
				// successor.utility = -state.utility;
				// successor.player_turn = changePlayerTurn( state.player_turn );
				// alert("player_turn aqui: " + successor.player_turn );
				// // alert( "creating new successor\n" +printState(state) + "\n" + printStateBoard(state) );
				// successors.push( successor );
				// var board_local = [];
				// board_local = switchPieces(i, j, state.player_turn, state.board, moves.pieces_to_switch );
				// board_local[i][j] = state.player_turn;
				successors.push( {				
									depth: state.depth + 1,
									// board: board_local,
									board: switchPieces(i, j, state.player_turn, state.board, moves.pieces_to_switch ),
									successors: [],
									utility: state.utility,
									player_turn: next_move_player
									// player_turn: changePlayerTurn( state.player_turn )
								});
			}
		}
	}
	// alert( "player_turn para o primeiro sucessor: " +  successors[0].player_turn );
	// Imprime cada um dos estados sucessores
	// for(var i=0; i<successors.length; i++) {
	// 	printState(successors[i]);
	// }
	return successors;
// switchPieces(i_clicked, j_clicked, player_turn, board, pieces_to_switch ) {
}



// }



// retorna true se estado for terminal e false caso contrário
function isTerminalState( state ) {
	// Se o jogo terminar, retorna true (tabuleiro cheio ou ausência de jogadas para ambos os jogadores)
	if( gameOver( state.player_turn, state.board ) ) {
		// alert("Game Over");
		return true;
	}
	// Adicionar verificação de ausência de movimento para os dois lados
	if( state.depth >= 3 ) {
		// alert("Depth reached");
		// printStateBoard(state, "terminalState");
		// alert( "terminalState\n" + printStateBoard(state) );
		return true;
	}
	return false;
}

// retorna valor de utilidade do estado
function getUtility( state ) {
	// alert('getUtility');
	var pieces_difference = getPiecesDifference( state );
	var corners_difference = getCornersDifference(state);
	return getPiecesDifference( state ) + 7*corners_difference;
}

function getCornersDifference(state) {
	var p1_corners = 0, p2_corners = 0;
	var i, j;

	i=0;
	j=0;
	if( state.board[i][i] == P1_TURN ) {
		p1_corners++;
	}
	else if( state.board[i][i] == P2_TURN ) {
		p2_corners++;
	}

	i=state.board.length-1;
	j=0;
	if( state.board[i][i] == P1_TURN ) {
		p1_corners++;
	}
	else if( state.board[i][i] == P2_TURN ) {
		p2_corners++;
	}

	i=0;
	j=state.board.length-1;
	if( state.board[i][i] == P1_TURN ) {
		p1_corners++;
	}
	else if( state.board[i][i] == P2_TURN ) {
		p2_corners++;
	}

	i=state.board.length-1;
	j=state.board.length-1;
	if( state.board[i][i] == P1_TURN ) {
		p1_corners++;
	}
	else if( state.board[i][i] == P2_TURN ) {
		p2_corners++;
	}
	return p2_corners - p1_corners;
}

function getPiecesDifference( state ) {
	var count_diff = 0;
	// alert('getPiecesDifference - inicio');
	for( var i=0; i<state.board.length; i++ ) {
		for( var j=0; j<state.board.length; j++ ) {
			// if( state.board[i][j] == state.player_turn ) {
			if( state.board[i][j] == P2_TURN ) {
				count_diff++;
			}
			// else if( state.board[i][j] == changePlayerTurn( state.player_turn ) ){
			else if( state.board[i][j] == P1_TURN ){
				count_diff--;
			}
		}
	}
	// alert('getPiecesDifference - final');
	return count_diff;
}

function printStateBoard(state) {
	var s = "";
	for(var i=0; i<state.board.length; i++) {
		for(var j=0; j<state.board.length; j++) {
			s += state.board[i][j];
		}
		s += "\n"
	}
	// alert(s);
	return s;
}

function printState(state) {
	var s = "Depth: " + state.depth + "\nUtility: " + state.utility + "\nPlayerTurn: " + state.player_turn;
	// alert(s);
	return s;
}

function switchPieces(i, j, player_turn, board, pieces_to_switch ) {
	var piece, to_switch;
	to_switch = pieces_to_switch[i][j]
	for(var k=0; k<to_switch.length; k++) {
		piece = to_switch[k];
		board[piece.i][piece.j] = player_turn ;
	}
	board[i][j] = player_turn;
	return board;
}


// function switchPieces(i, j, player_turn, board, pieces_to_switch ) {
// 	var current_board = {};
// 	current_board.prototype = board;
// 	var piece, to_switch;
// 	to_switch = pieces_to_switch[i][j]
// 	for(var k=0; k<to_switch.length; k++) {
// 		piece = to_switch[k];
// 		current_board.prototype[piece.i][piece.j] = player_turn ;
// 	}
// 	current_board.prototype[i][j] = player_turn;
// 	return current_board.prototype;
// }

// function switchPieces(i_clicked, j_clicked, player_turn, board, pieces_to_switch ) {
// 	var piece, new_board = board;
// 	for(var k=0; k<pieces_to_switch[i_clicked][j_clicked].length; k++) {
// 		piece = pieces_to_switch[i_clicked][j_clicked][k];
// 		new_board[piece.i][piece.j] = player_turn ;
// 	}
// 	return new_board;
// }

// Função chamada quando houer um clique dentro do canvas
//	 	Constantes usadas:
// 			var IN_BOARD_VALID = 1
// 			var IN_BOARD_INVALID = 2
// 			var OUT_BOARD = 3
function getMouseClick( event ) {
	var add_piece_ok_sound = document.getElementById('add_piece_ok');
	var add_piece_error_sound = document.getElementById('add_piece_error');

	// dá stop no som de add_piece_ok para que novo som possa ser reproduzido
	add_piece_ok_sound.pause();
	add_piece_ok_sound.currentTime = 0;
	// dá stop no som de add_piece_error para que novo som possa ser reproduzido
	add_piece_error_sound.pause();
	add_piece_error_sound.currentTime = 0;

	if( addPiece( event ) == IN_BOARD_VALID ) {
		add_piece_ok_sound.play();
		board  = switchPieces(pos_clicked.i, pos_clicked.j, player_turn, board, pieces_to_switch );
		// printPiecesToSwitch();
		// alert(pos_clicked.i + ', ' + pos_clicked.j);
		// document.getElementById('add_piece_ok').play();
		player_turn = changePlayerTurn( player_turn );
		// drawCanvas();
		newTurn( player_turn, board );
	}
	else if( addPiece( event ) == IN_BOARD_INVALID ) {
		add_piece_error_sound.play();
		// document.getElementById('add_piece_error').play();
	}
}


function newTurn( player_turn_local, board_local ) {
	// console.log('board')
	// print_matrix( board, boardSize );
	// console.log('------------------------------')
	// console.log('possible_moves')
	// print_matrix( possible_moves, boardSize);
	// console.log('------------------------------')

	// Verifica se jogo terminou (tabuleiro cheio ou ausência de jogadas)
	if( gameOver( player_turn_local, board_local ) ) {
		drawCanvas( board_local, possible_moves );
		alert( getEndOfGameMessage() );
	}
	// Verifica se há jogada possível para o jogador do turno. Se não houver mas houver para o outro jogador, troca a vez. Se não houver jogada para nenhum jogador, acaba o jogo
	if( ! hasPossibleMoves( player_turn_local, board_local ) ) {
		if( hasPossibleMoves( changePlayerTurn(player_turn_local), board_local ) ) {
			player_turn = changePlayerTurn( player_turn_local );
			alert('Nenhuma jogada possível. Jogador ' + player_turn_local + ' perdeu a vez');
			newTurn( player_turn, board);
		}
		// else {	// Fim de jogo
		// 	drawCanvas( board_local, possible_moves );
		// 	alert( getEndOfGameMessage() );
		// }
	}

	// Atualiza configuração de tabuleiro e possibilidades de movimento para o jogador do turno
	var moves = getPossibleMoves( player_turn_local, board_local );
	possible_moves = moves.possible_moves;
	pieces_to_switch = moves.pieces_to_switch;

	// Desenha na tela a nova configuração de tabuleiro e possibilidades de movimento para o jogador do turno
	drawCanvas( board_local, possible_moves );

	// Aguarda evento de escolha do movimento do jogador (máquina: escolha por algoritmo; player: espera por click)
	if( game_mode == GAME_PVM) {
		if( player_turn_local == P1_TURN ) {
			// Espera pelo clique na posição válida
		}
		else if( player_turn_local == P2_TURN ) {
			machineTurn( board_local, player_turn_local );
			// board = machineTurn( board_local );
			// switchPieces()
			console.log('OK');
			player_turn = changePlayerTurn( player_turn_local );
			// newTurn( player_turn, board ); 
			setTimeout(function(){ newTurn( player_turn, board); }, 600);
			// setTimeout(function(){ newTurn( player_turn, board); }, 10);
			// newTurn();
		}
	}
	if( game_mode == GAME_PVP ) {
		// Espera jogada do jogador
	}
}

function getEndOfGameMessage() {
	var text_end = "Fim de jogo. ";
	var score = getScore();
	// alert("Fim de jogo");
	if( score.p1 > score.p2 ) {
		text_end += "Vitória do player 1";
	}
	else if( score.p1 < score.p2 ) {
		text_end += "Vitória do player 2";
	}
	else {
		text_end += "O jogo terminou empatado";
	}
	return text_end;
}

function hasPossibleMoves( player_turn, board ) {
	var boardSize = board.length;
	moves = getPossibleMoves( player_turn, board );

	for (var i = 0; i < boardSize; i++ ) {
		for (var j = 0; j < boardSize; j++ ) {
			if( moves.possible_moves[i][j] == 1 ) {
				return true;
			}
		}
	}
	return false;
}

function isBoardFull( board ) {
	for (var i = 0; i < board.length; i++ ) {
		for (var j = 0; j < board.length; j++ ) {
			if( board[i][j] != 0 ) {
				return false;
			}
		}
	}
	return true;
}

// Verifica se jogo acabou. Jogo acaba quando tabuleiro está cheio ou quando não há movimentos possíveis para nenhum dos jogadores
function gameOver( player, board ) {
	if( isBoardFull( board ) ) {
		alert("BoardFull");
		return true;
	}
	if( !hasPossibleMoves(player_turn, board) ) {
		if( !hasPossibleMoves( changePlayerTurn( player_turn ), board) ) {
			// alert("No moves alowed");
			return true;
		}
	}
	return false;
}

function playerTurn() {

}

function machineTurn_new( board, player_turn ) {
	var state = {};

	// console.log("machin turn");
	state.depth = 0;
	state.board = board;
	state.successors = [];
	state.utility = 0;
	state.player_turn = player_turn;
	getBestNextMove(state);

}





function getBestNextMove(state) {
	var successors = getSuccessors( state );
	for(var i=0; i<successors.length; i++) {
		// console.log(successors[i].utility);
	}
}

// Função seta variável board global
function setGlobalBoard(local_board) {
	board = local_board;
}

function getMachineMove( board ) {
	var moves = getPossibleMoves( P2_TURN, board )
	var move = getRandomMove( moves.possible_moves );

	// var new_board = switchPieces(move.i, move.j, player_turn, board, moves.pieces_to_switch[move.i][move.j] );
	
	var new_board = board;
	new_board[move.i][move.j] = P2_TURN;
	switchPieces(move.i, move.j, player_turn, new_board, moves.pieces_to_switch );
	// switchPieces(move.i, move.j, player_turn, board, moves.pieces_to_switch );

	setGlobalBoard(new_board);

	// alert('i: ' +move.i + ', j: ' +move.j);
	return move;

}

function getRandomMove( possible_moves ) {
	for( var i=0; i<boardSize; i++ ) {
		for( var j=0; j<boardSize; j++ ) {
			if( possible_moves[i][j] == 1 ) {
				return {
					i: i,
					j: j
				};
			}
		}
	}
}

// Troca o turno, passando a vez para o outro jogador
function changePlayerTurn( player_turn ) {
	if( player_turn == P1_TURN ) {
		return P2_TURN;
	}
	else if( player_turn == P2_TURN ) {
		return P1_TURN;
	}
	else {
		alert('Erro no changePlayerTurn( player_turn ): ' + player_turn);
	}
}



// Define movimentos possíveis para o jogador da rodada
// retorn:
// 		moves.possible_moves, que é uma matriz com os possíveis movimentos
// 		moves.pieces_to_switch, que é uma matriz com as peças a mudar para cada movimento posśivel

function getPossibleMoves( player_turn, board ) {
	var boardSize = board.length;
	// Define todas as posições de possible_moves como zero
	var moves = {};
	// for( i = 0; i < boardSize; i++) {
	// 	for( j = 0; j < boardSize; j++) {
	// 		possible_moves[i][j] = 0;
	// 	}
	// }
	moves.pieces_to_switch = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		moves.pieces_to_switch[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			moves.pieces_to_switch[i][j] = new Array();
		}
	}


	// inicializa possible_movies
	moves.possible_moves = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		moves.possible_moves[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			moves.possible_moves[i][j] = 0;
		}
	}

	// console.log('---- zerando possible_moves ----');
	// print_matrix( moves.possible_moves, boardSize );

	// Itera sobre cada casa e busca movimentos possíveis a partir dela
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			if( board[i][j] == player_turn ) {
				// possible_moves[i][j+1] = 1;
				moves = searchPossibleMoves( player_turn, i, j, board, moves);
				// possible_moves[i][j] = 1;
			}
		}
	}
	return moves;
}





// moves: hash com .possible_moves e .pieces_to_switch
function searchPossibleMoves( player_turn, i_piece, j_piece, board, moves ) {
	var player, opponent;
	if( player_turn == P1_TURN ) {
		player = P1_TURN;
		opponent = P2_TURN;
	}
	else {
		player = P2_TURN;
		opponent = P1_TURN;
	}

	// console.log('--------------------------------');
	// console.log('Peça - i: ' + i_piece + ', j: ' + j_piece );

	// inicializa pieces_to_switch


	// Movimentos horizontais e verticais
	moves = searchPossibleMovesLookLeft( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookRight( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookUp( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookDown( player, opponent, i_piece, j_piece, board, moves );

	moves = searchPossibleMovesLookRightUp( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookRightDown( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookLeftUp( player, opponent, i_piece, j_piece, board, moves );
	moves = searchPossibleMovesLookLeftDown( player, opponent, i_piece, j_piece, board, moves );

	// aparentemente tudo certo com os movimentos verticais e horizontais
	// left-down parece estar ok
	// right-down parece estar ok
	// left-up parece estar ok
	// left-down parece estar ok

	// console.log('--------------------------------');
	return moves;
	// possible_moves[i_piece][j_piece] = 1;
}

function searchPossibleMovesLookRight( player, opponent, i_piece, j_piece, board, moves ) {
	var j;
	// pieces_to_switch[0][0].push( { i: 1, j: 1} );
	changeable_pieces = new Array();
	// console.log('Pre look-rigt');
	if( j_piece <= boardSize ) {
		// console.log('Entrou look-rigt');
		// console.log('got: ' + board[i_piece][j_piece+1]);
		// console.log('got: ' + board[i_piece][j_piece+1]);
		// console.log('player_turn: ' + player);
		// console.log('opponent: ' + opponent);
		if (typeof board[i_piece] != 'undefined') {
			if (typeof board[i_piece][j_piece+1] != 'undefined') {
				if( board[i_piece][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece, j: j_piece+1} );
					// changeable_pieces.push( { i: i_piece, j: j_piece+1} );
					// console.log('Entrou DEEP look-rigt');
					// console.log('encontrou oponente à esquerda');
					for( j=j_piece+2; j<boardSize; j++ ) {
						// console.log('no for');
						if (typeof board[i_piece][j] == 'undefined') {
							break;
						}
						if( board[i_piece][j] == opponent ) {
							// console.log('opponent');
							changeable_pieces.push( {i: i_piece, j: j} );
							continue;
						}
						else if( board[i_piece][j] == player ) {
							// console.log('player');
							break;
						}
						else if (board[i_piece][j] == 0 ) {
							moves.possible_moves[i_piece][j] = 1;
							// if( pieces_to_switch[i_piece][j] )
							// pieces_to_switch[i_piece][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i_piece][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							// console.log('adicionou');
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookLeft( player, opponent, i_piece, j_piece, board, moves ) {
	var j;
	var changeable_pieces = new Array();
	if( j_piece >= 1 ) {
		// console.log('Entrou look-left');
		if (typeof board[i_piece] != 'undefined') {
			if (typeof board[i_piece][j_piece-1] != 'undefined') {
				if( board[i_piece][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece, j: j_piece-1} );
					// console.log('Entrou DEEP look-left');
					for( j=j_piece-2; j>=0; j--) {
						if (typeof board[i_piece][j] == 'undefined') {
							break;
						}
						if( board[i_piece][j] == opponent ) {
							changeable_pieces.push( {i: i_piece, j: j} );
							continue;
						}
						else if( board[i_piece][j] == player ) {
							break;
						}
						else if (board[i_piece][j] == 0 ) {
							moves.possible_moves[i_piece][j] = 1;
							// pieces_to_switch[i_piece][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i_piece][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookUp( player, opponent, i_piece, j_piece, board, moves ) {
	var i;
	// console.log('Pre look-up');
	var changeable_pieces = new Array();
	if( i_piece >= 1 ) {
		// console.log('Entrou look-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece] != 'undefined') {
				if( board[i_piece-1][j_piece] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece} );
					// console.log('Entrou DEEP look-up');
					for( i=i_piece-2; i>=0; i--) {
						if (typeof board[i][j_piece] == 'undefined') {
							break;
						}
						if( board[i][j_piece] == opponent ) {
							changeable_pieces.push( {i: i, j: j_piece} );
							continue;
						}
						else if( board[i][j_piece] == player ) {
							break;
						}
						else if ( board[i][j_piece] == 0 ) {
							moves.possible_moves[i][j_piece] = 1;
							// pieces_to_switch[i][j_piece] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j_piece], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookDown( player, opponent, i_piece, j_piece, board, moves ) {
	var i;
	var changeable_pieces = new Array();
	// print_matrix(board, boardSize);
	if( i_piece <= boardSize-1 ) {
		if (typeof board[i_piece+1] != 'undefined' ) {
			if( typeof board[i_piece+1][j_piece] != 'undefined') {	// verifica se array na posição board[i_piece + 1] está definido. Se não estiver, não prossegue
				if( board[i_piece+1][j_piece] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece} );
					for( i=i_piece+2; i<boardSize; i++ ) {
						if (typeof board[i][j_piece] == 'undefined') {
							break;
						}
						// console.log('no for');
						if( board[i][j_piece] == opponent ) {
							// console.log('opponent');
							changeable_pieces.push( {i: i, j: j_piece} );
							continue;
						}
						else if( board[i][j_piece] == player ) {
							// console.log('player');
							break;
						}
						else if (board[i][j_piece] == 0 ) {
							moves.possible_moves[i][j_piece] = 1;
							// pieces_to_switch[i][j_piece] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j_piece], changeable_pieces);
							}
							// printPiecesToSwitch();
							// console.log('adicionou');
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

// Movimentos Diagonais
function searchPossibleMovesLookRightDown( player, opponent, i_piece, j_piece, board, moves ) {
	// look right-down
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-rigt-down');
	if( j_piece <= boardSize-1 && i_piece <= boardSize-1 ) {
		if (typeof board[i_piece+1] != 'undefined') {
			if (typeof board[i_piece+1][j_piece+1] != 'undefined') {
				// console.log('Entrou look-rigt-down');
				if( board[i_piece+1][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece+1} );
					// console.log('Entrou DEEP look-rigt-down');
					for( i=i_piece+2, j=j_piece+2; i<boardSize && j<boardSize; i++, j++ ) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						// if( i>= boardSize || j>=boardSize ) {
						// 	break;
						// }

						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							moves.possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// console.log('Erro inesperado - look right-down');
							alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookLeftUp( player, opponent, i_piece, j_piece, board, moves ) {
	// look left-up
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-left-up');
	if( j_piece >= 1 && i_piece >= 1 ) {
		// console.log('Entrou look-left-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece-1] != 'undefined') {
				if( board[i_piece-1][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece-1} );
					// console.log('Entrou DEEP look-left-up');
					for( i=i_piece-2, j=j_piece-2; i>=0 && j>=0 ; i--, j--) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							moves.possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// console.log('Erro inesperado - look left-up');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookRightUp( player, opponent, i_piece, j_piece, board, moves ) {
	// look right-up
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-rigtup');
	if( j_piece <= boardSize-2 && i_piece >= 1 ) {
		// console.log('Entrou look-rigt-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece+1] != 'undefined') {
				if( board[i_piece-1][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece+1} );
					// console.log('Entrou DEEP look-rigt-up');
					for( i=i_piece-2, j=j_piece+2; i>=0 && j<boardSize; i--, j++ ) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							moves.possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// console.log('Erro inesperado - look right-up');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

function searchPossibleMovesLookLeftDown( player, opponent, i_piece, j_piece, board, moves ) {
	var i, j;
	var changeable_pieces = new Array();
	// // look left-down
	// console.log('Pre left-down');
	if( j_piece >= 1 && i_piece <= boardSize ) {
		if (typeof board[i_piece+1] != 'undefined') {
			if (typeof board[i_piece+1][j_piece-1] != 'undefined') {
				if( board[i_piece+1][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece-1} );
					// console.log('Entrou DEEP left-down');
					for( i=i_piece+2, j=j_piece-2; i<boardSize && j>=0; i++, j--) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if ( board[i][j] == 0 ) {
							moves.possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(moves.pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// console.log('Erro inesperado - look left-down');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
	return moves;
}

// Adiciona nova peça ao tabuleiro. Se local clicado já estiver ocupado, retorna false. Caso contrário, adiciona peça e retorna true
// return
//		1: clique dentro do tabuleiro em casa válida
//		2: clique dentro do tabuleiro em casa inválida
//		3: clique fora o tabuleiro
//	 	Constantes definidas:
// 			var IN_BOARD_VALID = 1
// 			var IN_BOARD_INVALID = 2
// 			var OUT_BOARD = 3
function addPiece( event ) {
	var ret = OUT_BOARD;
	var mousePos = getMousePos(canvas, event);
	var x = mousePos.x;
	var y = mousePos.y;
	//var h_space = parseInt( ( x - x_offset ) / space_size );
	//var v_space = parseInt( ( y - y_offset ) / space_size );
	var i, j;

	if( x >= x_offset && x <= ( boardWidth + x_offset) && y >= y_offset && y <= ( boardHeight + y_offset) ) {
		// console.log( 'Posição válida para a peça' );
		i = parseInt( ( y - y_offset ) / space_size ); // posição horizontal da matriz
		j = parseInt( ( x - x_offset ) / space_size ); // posiçao vertical da matriz

		// Verifica se casa está ocupada
		if( board[i][j] != 0 ) {
			ret = IN_BOARD_INVALID;
		}
		else {
			if( possible_moves[i][j] ) {	// Se casa está vazia e movimento é válido
				board[i][j] = player_turn;
				pos_clicked = {i: i, j:j};
				ret = IN_BOARD_VALID;
			}
			else {							// Se casa está vazia mas movimento é inválido
				// alert('Você deve posicionar uma peça numa posição válida - marcada por uma cor diferente');
				ret = IN_BOARD_INVALID;
			}
		}
	}
	return ret;
}

// Retorna posição do clique com relação ao canvas. Retorno pode ser acessado como ret.x e ret.y
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function initializePiecesToSwitch() {
	pieces_to_switch = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		pieces_to_switch[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			pieces_to_switch[i][j] = new Array();
		}
	}
}

function initializePossibleMoves() {
	possible_moves = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		possible_moves[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			possible_moves[i][j] = 0;
		}
	}
}

// Inicializa tabuleiro com todas as casas vazias - board[a][b] diz respeito à linha a e coluna b
function initializeBoard() {
	var board = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			board[i][j] = 0;
		}
	}

	h_half_board_pieces = parseInt( boardSize / 2 );
	v_half_board_pieces = parseInt( boardSize / 2 );

	// Posiciona as duas peças iniciais do Player 1
	board[v_half_board_pieces][h_half_board_pieces-1] = P1_PIECE;
	board[v_half_board_pieces-1][h_half_board_pieces] = P1_PIECE;

	// Posiciona as duas peças iniciais do Player 2
	board[v_half_board_pieces-1][h_half_board_pieces-1] = P2_PIECE;
	board[v_half_board_pieces][h_half_board_pieces] = P2_PIECE;
	return board;
}

function getScore() {
	var p1_score = 0;
	var p2_score = 0;
	var i, j;
	for( i=0; i<boardSize; i++ ) {
		for( j=0; j<boardSize; j++ ) {
			if( board[i][j] == P1_PIECE ) {
				p1_score++;
			}
			else if( board[i][j] == P2_PIECE ) {
				p2_score++;
			}
		}
	}
	return {
		p1: p1_score,
		p2: p2_score
	};
}

function drawCanvas( board, possible_moves ) {
	drawScreen();
	drawBoard( board, possible_moves );
	drawTurnControl();
}

// Imprime parte da tela que informará quantas peças cada jogador tem e de quem é o turno
function drawTurnControl() {
	//var width = screenWidth - boardWidth - 3*x_offset;
	//var height = screenHeight - 2*y_offset;

	var x_start = 2*x_offset + boardWidth;
	var y_start = y_offset + 30;

	var x_p1_score = x_start + 30;
	var y_p1_score = y_start + 40;

	var x_p2_score = x_start + 30;
	var y_p2_score = y_start + 160;

	var turn_message = "Turno: ";
	var score = getScore();

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();

	var p1_score_text = "Player 1";
	var p2_score_text = "Player 2";
	ctx.font = "30px Arial";
	ctx.fillStyle = "black";

	ctx.fillText(p1_score_text, x_p1_score, y_p1_score);
	ctx.fillText(p2_score_text, x_p2_score, y_p2_score);

	ctx.fillText("x " + score.p1, x_start+120, y_start+80);
	ctx.fillText("x " + score.p2, x_start+120, y_start+200);

	if( player_turn == P1_TURN ) {
		turn_message += "Player 1";
	}
	else {
		turn_message += "Player 2";
	}
	ctx.fillText(turn_message, x_start+30, y_start+340);
	ctx.closePath();

	drawPiece( x_start+90, y_start+70, pieceRaidus/2, P1_COLOR );
	drawPiece( x_start+90, y_start+190, pieceRaidus/2, P2_COLOR );


}

function drawPossibleMoves_unused() {
	// Desenha casas para os quais os movimentos são válidos
	var i,j;
	for( i=0; i<boardSize; i++ ) {
		for( j=0; j<boardSize; j++ ) {
			if( possible_moves[i][j] == 1 ) {
				drawFilledSquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
			else {
				// drawFilledSquareTest( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
		}
	}
}

function drawPieces() {
	// Desenha peças que já estão no tabuleiro
	var i,j;
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			if( board[i][j] == P1_PIECE )  {
				drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P1_COLOR);
			}
			else if( board[i][j] == P2_PIECE ) {
				drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P2_COLOR);
			}
		}
	}
}

// Desenha tabuleiro (já preenchido com as peças que o compõem)
// Por algum motivo, para a impressão ficar correta, está sendo necessário verificar a posição [j][i]
function drawBoard(board, possible_moves) {	// Desenha tabuleiro (todas as casas)
	// Desenha tabuleiro vazio
	var boardSize = board.length;
	for(var i=0; i<boardSize; i++ ) {
		for(var j=0; j<boardSize; j++ ) {
			// drawEmptySquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			if( possible_moves[j][i] == 0 ) {
				drawEmptySquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
			else {
				drawFilledSquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
				// i*space_size + x_offset
				// j*space_size + y_offset
				// drawFilledSquare( j*space_size + y_offset, i*space_size + x_offset, space_size );
			}


		}
	}
	drawPieces();
}

// Desenha canvas
function drawScreen() {
	var canvas = document.getElementById("canvas");
	if( canvas.getContext ) {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.canvas.width  = screenWidth;	// Seta largura do canvas do tabuleiro
	  	ctx.canvas.height = screenHeight;	// Seta altura do canvas do tabuleiro
	  	ctx.closePath();
	}
}

// Desenha quadrado com início no ponto (x,y) e de tamanho size. O ponto (x,y) é referente ao canto superior esquerdo do quadrado
function drawEmptySquare( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.rect(x,y,size,size);
	ctx.fillStyle = '#DD6666';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	// verde: 0A5300
	// azul: 3F38F7
	// amarelo: FFFF00
}

function drawFilledSquare( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	// ctx.rect(x+1,y+1,size-2,size-2);	// diferenças são para não sobrepor as bordas
	ctx.rect(x,y,size,size);	// diferenças são para não sobrepor as bordas
	// ctx.fillStyle = '#CCCCCC';
	ctx.fillStyle = '#993333';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	// verde: 1EB219
	// azul: 040691
	// amarelo: D9B814
}

// Desenha círculo (peça) com início no ponto (x,y), de raio radius e de cor color
function drawPiece( x, y, radius, color ) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, 2*Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// Função usada para depuração - Imprime a matriz no console JS do browser
function print_matrix( matrix, n ) {
	var line = '';
	var i, j;
	for( i=0; i<n; i++ ) {
		for( j=0; j<n; j++ ) {
			line += matrix[i][j] + ' ';
		}
		console.log(line);
		line = '';
	}
}

function printPiecesToSwitch() {
	var piece;
	console.log('--- Imprimindo pieces_to_switch ---');
	for( var i = 0; i<boardSize; i++ ) {
		for( var j = 0; j<boardSize; j++ ) {
			if( pieces_to_switch[i][j].length > 0 ) {
				console.log('posição: ' + i + ', ' + j );
				for( var k = 0; k<pieces_to_switch[i][j].length; k++) {
					piece = pieces_to_switch[i][j][k];
					// console.log('  i: ' + i + ', j: ' + j);
					console.log('  i: ' + piece.i + ', j: ' + piece.j);
				}
			}
		}
	}
}

