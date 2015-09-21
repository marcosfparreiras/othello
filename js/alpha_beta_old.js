// retorna uma ação
// entradas: state - current state in game
// depth = 0
// board = board
// utilty = 0
// successors = []
// player_turn
// function alphaBetaSearch( state ) {
// 	var next_state; // o retorno da busca miniMax será um novo estado de tabuleiro, que deverá ser retornado como sendo a jogada efetuada

// 	next_state = maxValue_ab( state, -INFINITY, +INFINITY);
// 	return next_state;	// Retorna não só o novo tabuleiro como também possible_moves

// 	// Bloco de código para verificar se retorno de board está ok
// 	// var board_test = new Array(boardSize);
// 	// for (var i = 0; i < boardSize; i++) {
// 	// 	board_test[i] = new Array(boardSize);
// 	// }
// 	// board_test[2][2] = 2;
// 	// board_test[2][3] = 2;
// 	// board_test[3][3] = 2;
// 	// board_test[2][1] = 1;
// 	// board_test[1][2] = 1;
// 	// return board_test;

	
// }

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
// function maxValue_ab( state, alpha, beta ) {
// 	var v, sucessors;
// 	if( isTerminalState( state ) ) {
// 		sucessors = [];
// 		return {
// 			depth: state.depth,
// 			utility: getUtility( state ),
// 			board: state.board,
// 			sucessors: sucessors
// 		};
// 		// return getUtility( state );
// 	}
// 	v = {};

// 	v.depth = state.depth;
// 	v.board = board;
// 	v.successors = [];
// 	v.utility = 0;
// 	v.player_turn = player_turn;
// 	v = -INFINITY;
// 	sucessors = getSuccessors( state );
// 	for (var i = 0; i <= sucessors.length ; i++) {
// 		var s = sucessors[i];
// 		v = Math.max( v, minValue_ab( s, alpha, beta) );
// 		if( v >= beta ) {
// 			return v;
// 		}
// 		alpha = Math.max( alpha, v );
// 	}
// }

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
// function minValue_ab( state, alpha, beta ) {
// 	var v, sucessors;
// 	if( isTerminalState( state ) ) {
// 		sucessors = [];
// 		return {
// 			depth: state.depth,
// 			utility: getUtility( state ),
// 			board: state.board,
// 			sucessors: sucessors
// 		};
// 		// return getUtility( state );
// 	}
// 	v = +INFINITY;
// 	sucessors = getSuccessors( state );
// 	for (var i = 0; i <= sucessors.length ; i++) {
// 		var s = sucessors[i];
// 		v = Math.min( v, maxValue_ab( s, alpha, beta) );
// 		if( v <= alpha ) {
// 			return v;
// 		}
// 		beta = Math.min( beta, v );
// 	}