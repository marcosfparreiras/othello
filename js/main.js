
// Arquivo principal de JavaScript para a implementação do jogo Othello para HTML5

// ---------------- Definição das variáveis globais ----------

// Define tamanho de cada um dos 64 quadrados (8x8) do tabuleiro
var space_size = 70;
// Define raio das peças que serão poscionadas sobre o tabuleiro
var pieceRaidus = 30;

// Define largura e altura da tela, respectivamente
var screenWidth = 900;		// Define largura da tela
var screenHeight = 600;		// Define altura da tela

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
var P1_TURN = 1;
var P2_TURN = 2;
var player_turn = P1_TURN;

// Matriz com possíveis movimentos do jogador da vez. 1 indica que aquele movimento é possível
var possible_moves;
// var possible_moves = new Array( boardSize );

var i_test = 0;
var j_test = 0;

// --------------Fim da definição das variáveis globais ----------

// Função executada assim que a tela é carregada
window.onload = function() {
	gameAction();
};

function gameAction() {
	initializeBoard();
	initializePossibleMoves();
	getPossibleMoves( player_turn );
	canvas.addEventListener("mousedown", getMouseClick );
	console.log('---- Matriz board -----');
	print_matrix( board, boardSize );
	console.log('---- Matriz possible_moves -----');
	print_matrix( possible_moves, boardSize );
	drawCanvas();
}

// Função chamada quando houer um clique dentro do canvas
function getMouseClick( event ) {
	if( addPiece( event ) ) {	
		newTurn();
	}
}

function newTurn() {
	changeTurn();
	getPossibleMoves( player_turn );
	console.log('---- Matriz board -----');
	print_matrix( board, boardSize );
	console.log('---- Matriz possible_moves -----');
	print_matrix( possible_moves, boardSize );

	drawCanvas();
}

// Troca o turno, passando a vez para o outro jogador
function changeTurn() {
	if( player_turn == P1_TURN ) {
		player_turn = P2_TURN;
	}
	else if( player_turn == P2_TURN ) {
		player_turn = P1_TURN;
	}
	else {
		alert('Erro no changeTurn');
	}
}



// Define movimentos possíveis para o jogador da rodada
function getPossibleMoves( player ) {
	// Define todas as posições de possible_moves como zero
	var i, j;
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			possible_moves[i][j] = 0;
		}
	}

	// possible_moves[0][1] = 1;
	// print_matrix( possible_moves, boardSize );

	// board[0][2] = 2;
	// print_matrix( board, boardSize );
	
	// console.log('entrou no getPossibleMoves');
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			if( board[i][j] == player ) {
				// possible_moves[i][j+1] = 1;
				searchPossibleMoves( player, i, j);
				// possible_moves[i][j] = 1;
			}
		}
	}
	// possible_moves[0][1] = 1;
	// possible_moves[i_test][j_test] = 1;
	// i_test++;
	// j_test++;
}

function searchPossibleMoves( player_turn, i_piece, j_piece ) {
	var player, opponent, i, j;
	if( player_turn == P1_TURN ) {
		player = P1_TURN;
		opponent = P2_TURN;
	}
	else {
		player = P2_TURN;
		opponent = P1_TURN;
	}

	console.log('--------------------------------');
	console.log('Peça - i: ' + i_piece + ', j: ' + j_piece );

	// Movimentos horizontais e verticais 

	// look right
	if( j_piece <= boardSize ) {
		// console.log('got: ' + board[i_piece][j_piece+1]);
		// console.log('player_turn: ' + player);
		// console.log('opponent: ' + opponent);
		if( board[i_piece][j_piece+1] == opponent ) {
			// console.log('encontrou oponente à esquerda');
			for( j=j_piece+2; j<boardSize; j++ ) {
				// console.log('no for');
				if( board[i_piece][j] == opponent ) {
					// console.log('opponent');
					continue;
				}
				else if( board[i_piece][j] == player ) {
					// console.log('player');
					break;
				}
				else if (board[i_piece][j] == 0 ) {
					possible_moves[i_piece][j] = 1;
					// console.log('adicionou');
					break;
				}
				else {
					alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// // look left
	if( j_piece >= 1 ) {
		if( board[i_piece][j_piece-1] == opponent ) {
			for( j=j_piece-2; j>=0; j--) {
				if( board[i_piece][j] == opponent ) {
					continue;
				}
				else if( board[i_piece][j] == player ) {
					break;
				}
				else if (board[i_piece][j] == 0 ) {
					possible_moves[i_piece][j] = 1;
					break;
				}
				else {
					alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// // look up
	if( i_piece >= 1 ) {
		if( board[i_piece-1][j_piece] == opponent ) {
			for( i=i_piece-2; i>=0; i--) {
				if( board[i][j_piece] == opponent ) {
					continue;
				}
				else if( board[i][j_piece] == player ) {
					break;
				}
				else if ( board[i][j_piece] == 0 ) {
					possible_moves[i][j_piece] = 1;
					break;
				}
				else {
					alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}
	
	// // look down
	if( i_piece <= boardSize ) {
		if( board[i_piece+1][j_piece] == opponent ) {
			for( i=i_piece+2; i<boardSize; i++) {
				if( board[i][j_piece] == opponent ) {
					continue;
				}
				else if( board[i][j_piece] == player ) {
					break;
				}
				else if ( board[i][j_piece] == 0 ) {
					possible_moves[i][j_piece] = 1;
					break;
				}
				else {
					alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// Movimentos Diagonais

	// look right-down
	if( j_piece <= boardSize-2 && i_piece <= boardSize-2 ) {
		if( board[i_piece+1][j_piece+1] == opponent ) {
			for( i=i_piece+2, j=j_piece+2; i<boardSize && j<boardSize; i++, j++ ) {
				// if( i>= boardSize || j>=boardSize ) {
				// 	break;
				// }

				if( board[i][j] == opponent ) {
					continue;
				}
				else if( board[i][j] == player ) {
					break;
				}
				else if (board[i_piece][j] == 0 ) {
					possible_moves[i][j] = 1;
					break;
				}
				else {
					// alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// look left-up
	if( j_piece >= 1 && i_piece >= 1 ) {
		if( board[i_piece-1][j_piece-1] == opponent ) {
			for( i=i_piece-2, j=j_piece-2; i>=0 && j>=0 ; i--, j--) {
				if( board[i][j] == opponent ) {
					continue;
				}
				else if( board[i][j] == player ) {
					break;
				}
				else if (board[i_piece][j] == 0 ) {
					possible_moves[i][j] = 1;
					break;
				}
				else {
					// alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// look right-up
	if( j_piece <= boardSize-2 && i_piece >= 1 ) {
		if( board[i_piece-1][j_piece+1] == opponent ) {
			for( i=i_piece-2, j=j_piece+2; i>=0 && j<boardSize; i--, j++ ) {
				if( board[i][j] == opponent ) {
					continue;
				}
				else if( board[i][j] == player ) {
					break;
				}
				else if (board[i_piece][j] == 0 ) {
					possible_moves[i][j] = 1;
					break;
				}
				else {
					// alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}
	}

	// // look left-down
	if( j_piece >= 1 && i_piece <= boardSize ) {
		if( board[i_piece+1][j_piece-1] == opponent ) {
			for( i=i_piece+2, j=j_piece-2; i<boardSize && j>=0; i++, j--) {
				if( board[i][j] == opponent ) {
					continue;
				}
				else if( board[i][j] == player ) {
					break;
				}
				else if ( board[i][j] == 0 ) {
					possible_moves[i][j] = 1;
					break;
				}
				else {
					// alert('Erro inesperado no searchPossibleMoves');
				}
			}
		}

	}


	// Comentados para focar em uma ação por vez (no momento, está sendo tratada a busca para a direita)
	console.log('--------------------------------');



	// possible_moves[i_piece][j_piece] = 1;


}







// Adiciona nova peça ao tabuleiro. Se local clicado já estiver ocupado, retorna false. Caso contrário, adiciona peça e retorna true
function addPiece( event ) {
	var ret = false;
	var mousePos = getMousePos(canvas, event);
	var x = mousePos.x;
	var y = mousePos.y;
	//var h_space = parseInt( ( x - x_offset ) / space_size );
	//var v_space = parseInt( ( y - y_offset ) / space_size ); 
	var i, j;

	if( x >= x_offset && x <= ( boardWidth + x_offset) && y >= y_offset && y <= ( boardHeight + y_offset) ) {
		console.log( 'Posição válida para a peça' );
		i = parseInt( ( y - y_offset ) / space_size ); // posição horizontal da matriz
		j = parseInt( ( x - x_offset ) / space_size ); // posiçao vertical da matriz

		// if( possible_moves[h_space][v_space] ) {

		//var message2 = 'j: ' + j;
		//var message3 = 'i: ' + i;

		// console.log('------ posicao ------');
		// console.log( message3 );
		// console.log( message2 );

		// if( board[h_space][v_space] ) {
		if( board[i][j] != 0 ) {
			// console.log( 'ocupado' );
			ret = false;
		}
		else {
			if( possible_moves[i][j] ) {
				board[i][j] = player_turn;
				// console.log( 'livre' );
				ret = true;
			}
			else {
				alert('Você deve posicionar uma peço numa posição válida - marcada por uma cor diferente');
				ret = false;
			}
		}
		// }
	}
	// print_matrix( board );
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
	board = new Array(boardSize);			
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

function drawCanvas() {
	drawScreen();
	drawBoard();
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
function drawBoard() {	// Desenha tabuleiro (todas as casas)
	// Desenha tabuleiro vazio
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

	// drawPossibleMoves();
	drawPieces();
	// Desenha peças que já estão no tabuleiro
	// for (var i = 0; i < boardSize; i++) {
	// 	for (var j = 0; j < boardSize; j++) {
	// 		if( board[i][j] == P1_PIECE )  {
	// 			drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P1_COLOR);
	// 		}
	// 		else if( board[i][j] == P2_PIECE ) {
	// 			drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P2_COLOR);
	// 		}
	// 	}
	// }
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



function startGame() {

}