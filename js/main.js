
// Arquivo principal de JavaScript para a implementação do jogo Othello para HTML5

// ---------------- Definição das variáveis globais ----------

// Define tamanho de cada um dos 64 quadrados (8x8) do tabuleiro
var space_size = 70;
// Define raio das peças que serão poscionadas sobre o tabuleiro
var pieceRaidus = 30;

// Define largura e altura da tela, respectivamente
var screenWidth = 800;		// Define largura da tela
var screenHeight = 600;		// Define altura da tela

// Define número de casas que o tabuleiro terá na horizontal e na vertical (para o caso de criar níveis diferentes com tabuleiros de tamanhos diferentes)
var boardHorizontalSpaces = 8;	// numero de casas na horizontal (default 8)
var boardVerticalSpaces = 8; 	// numero de casas na vertical (default 8)

// Calcula largura e altura do tabuleiro baseado no número de peças que serão usadas e o tamanho de cada uma delas
var boardWidth = boardHorizontalSpaces * space_size;			// Define largura do canvas do tabuleiro
var boardHeight = boardVerticalSpaces * space_size;			// Define altura do canvas do tabuleiro

// Variáveis de offset usadas para centralizaro tabuleiro
var x_offset = ( screenWidth - 8*space_size ) / 2;
var y_offset = ( screenHeight - 8*space_size ) / 2;

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

// --------------Fim da definição das variáveis globais ----------

// Função executada assim que a tela é carregada
window.onload = function() {
	initializeBoard();
	drawScreen();
	drawBoard();
	// canvas.addEventListener("mousedown", getPosition, false);
	canvas.addEventListener("mousedown", getMouseClick );

	
	// print_matrix( board )
}

function getMouseClick( event ) {
	if( addPiece( event ) ) {
		drawBoard();
		changeTurn();
	}
}

function changeTurn() {
	if( player_turn == P1_TURN ) {
		player_turn = P2_TURN
	}
	else {
		player_turn = P1_TURN
	}
}

// Adiciona nova peça ao tabuleiro. Se local clicado já estiver ocupado, retorna false. Caso contrário, adiciona peça e retorna true
function addPiece( event ) {
	var ret = false;
	var mousePos = getMousePos(canvas, event);
	var x = mousePos.x;
	var y = mousePos.y;
	var h_space = parseInt( ( x - x_offset ) / space_size );
	var v_space = parseInt( ( y - y_offset ) / space_size ); 

	if( x >= x_offset && x <= ( boardWidth + x_offset) && y >= y_offset && y <= ( boardHeight + y_offset) ) {
		console.log( 'OK' );
		var h_space = parseInt( ( x - x_offset ) / space_size );
		var v_space = parseInt( ( y - y_offset ) / space_size ); 

		var message2 = 'h_space: ' + h_space;
		var message3 = 'v_space: ' + v_space;

		console.log( message2 );
		console.log( message3 );

		if( board[h_space][v_space] ) {
			console.log( 'ocupado' );
			ret = false;
		}
		else {
			board[v_space][h_space] = player_turn;
			console.log( 'livre' );
			ret = true;
		}
	}
	// print_matrix( board );
	return ret


	// var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	// var message2 = 'h_space: ' + h_space;
	// var message3 = 'v_space: ' + v_space;
	// var message4 = 'x: ' + x + 'y: ' + y;

	// console.log( message );
	// console.log( message2 );
	// console.log( message3 );
	// console.log( message4 );

	// if( h_space >= 0 && h_space < boardVerticalSpaces && v_space >= 0 && v_space < boardHorizontalSpaces ) {
	// 	// console.log( 'OK' );
	// }


}

// Retorna posição do clique com relação ao canvas. Retorno pode ser acessado como ret.x e ret.y
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


function getPosition(event) {
	var x = event.x;
	var y = event.y;

	var canvas = document.getElementById("canvas");

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	alert("x:" + x + " y:" + y);
}

function gameAction() {

}

function startGame() {

}

// Inicializa tabuleiro com todas as casas vazias - board[a][b] diz respeito à linha a e coluna b
function initializeBoard() {
	board = new Array(boardVerticalSpaces);			
	for (var i = 0; i < boardVerticalSpaces; i++) {
		board[i] = new Array(boardHorizontalSpaces);
	}
	for (var i = 0; i < boardVerticalSpaces; i++) {
		for (var j = 0; j < boardHorizontalSpaces; j++) {
			board[i][j] = 0;
		}
	}

	h_half_board_pieces = parseInt( boardVerticalSpaces / 2 );
	v_half_board_pieces = parseInt( boardHorizontalSpaces / 2 );

	// Posiciona as duas peças iniciais do Player 1
	board[v_half_board_pieces][h_half_board_pieces-1] = P1_PIECE;
	board[v_half_board_pieces-1][h_half_board_pieces] = P1_PIECE;

	// Posiciona as duas peças iniciais do Player 2
	board[v_half_board_pieces-1][h_half_board_pieces-1] = P2_PIECE;
	board[v_half_board_pieces][h_half_board_pieces] = P2_PIECE;
}

// Desenha tabuleiro (já preenchido com as peças que o compõem)
function drawBoard() {	// Desenha tabuleiro (todas as casas)
	// Desenha tabuleiro vazio
	for( i=0; i<boardVerticalSpaces; i++ ) {
		for( j=0; j<boardHorizontalSpaces; j++ ) {
			draw_empty_square( i*space_size + x_offset, j*space_size + y_offset, space_size );
		}
	}

	// Desenha peças que já estão no tabuleiro
	for (var i = 0; i < boardVerticalSpaces; i++) {
		for (var j = 0; j < boardHorizontalSpaces; j++) {
			if( board[i][j] == P1_PIECE )  {
				draw_peace( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P1_COLOR);
			}
			else if( board[i][j] == P2_PIECE ) {
				draw_peace( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P2_COLOR);
			}
		}
	}
}

// Desenha canvas
function drawScreen() {
	var canvas = document.getElementById("canvas");
	if( canvas.getContext ) {
		var ctx_board = canvas.getContext("2d");
		ctx_board.canvas.width  = screenWidth;	// Seta largura do canvas do tabuleiro
	  	ctx_board.canvas.height = screenHeight;	// Seta altura do canvas do tabuleiro
	}
}

// Desenha quadrado com início no ponto (x,y) e de tamanho size. O ponto (x,y) é referente ao canto superior esquerdo do quadrado
function draw_empty_square( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.rect(x,y,size,size);
	ctx.stroke();
}

// Desenha círculo (peça) com início no ponto (x,y), de raio radius e de cor color
function draw_peace( x, y, radius, color ) {
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
function print_matrix( matrix ) {
	console.log( 'teste' );
	for (var i = 0; i < boardVerticalSpaces; i++) {
		console.log( matrix[i].join(" ") );
	}
}

