


var space_size = 60;
var pieceRaidus = 20;

var screenWidth = 800;		// Define largura da tela
var screenHeight = 600;		// Define altura da tela

var boardWidth = boardHorizontalSpaces * space_size;			// Define largura do canvas do tabuleiro
var boardHeight = boardVerticalSpaces * space_size;			// Define altura do canvas do tabuleiro

var boardHorizontalSpaces = 8;	// numero de casas na horizontal (default 8)
var boardVerticalSpaces = 8; 	// numero de casas na vertical (default 8)
var board;	// matrix representando cada casa do tabuleiro

// Variáveis de offset usadas para centralizaro tabuleiro
var x_offset = ( screenWidth - 8*space_size ) / 2;
var y_offset = ( screenHeight - 8*space_size ) / 2;

var P1_COLOR = "rgb(255,222,173)";		// peças do player 1 recebem cor creme
var P2_COLOR = "rgb(0,0,0)";			// peças do player 2 recebem cor preta


function gameAction() {

}

function startGame() {

}

function createBoard() {	// Desenha tabuleiro (todas as casas)

	// draw_empty_square( 50, 50, 50 );
	// draw_empty_square( 50, 100, 50 );


	for( i=0; i<boardVerticalSpaces; i++ ) {
		for( j=0; j<boardHorizontalSpaces; j++ ) {
			draw_empty_square( i*space_size + x_offset, j*space_size + y_offset, space_size );
		}
	}
	// draw_empty_square( 1*space_size, 0*space_size );
	// draw_empty_square( 2*space_size, 0*space_size );
	// draw_empty_square( 3*space_size, 0*space_size );
	// draw_empty_square( 4*space_size, 0*space_size );
	// draw_empty_square( 5*space_size, 0*space_size );
	// draw_empty_square( 6*space_size, 0*space_size );
	// draw_empty_square( 7*space_size, 0*space_size );
	// draw_empty_square( 8*space_size, 0*space_size );

	
	
}

function draw_screen() {
	var canvas = document.getElementById("canvas");

	if( canvas.getContext ) {
		var ctx_board = canvas.getContext("2d");

		ctx_board.canvas.width  = screenWidth;	// Seta largura do canvas do tabuleiro
	  	ctx_board.canvas.height = screenHeight;	// Seta altura do canvas do tabuleiro
	}
}

function draw_empty_square( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.rect(x,y,size,size);
	ctx.stroke();
}

window.onload = function() {
	// initializeBoard();
	draw_screen()
	createBoard();
}