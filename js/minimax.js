
// var include_js = document.createElement('script');
// include_js.src = 'path/to/js'


// retorna uma ação
// entradas: state - current state in game
// depth = 0
// board = board
// utilty = 0
// successors = []
function alphaBetaSearch( state ) {
	var v, state;
	state = {};

	state.depth = 0;
	state.board = board;
	state.successors = [];
	state.utility = 0;
	
	v = maxValue( state, -999999999, +999999999);
	return v.board;
}

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
function maxValue( state, alpha, beta ) {
	var v, sucessors;
	if( isTerminalState( state ) ) {
		sucessors = [];
		return {
			depth: state.depth,
			utility: getUtility( state ),
			board: state.board,
			sucessors: sucessors
		};
		// return getUtility( state );
	}
	v = -999999999;
	sucessors = getSucessors( state );
	for (var i = 0; i <= sucessors.length ; i++) {
		var s = sucessors[i];
		v = max( v, minValue( s, alpha, beta) );
		if( v >= beta ) {
			return v;
		}
		alpha = max( alpha, v );
	}
}

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
function minValue( state, alpha, beta ) {
	var v, sucessors;
	if( isTerminalState( state ) ) {
		return {
			depth: state.depth,
			utility: getUtility( state ),
			board: state.board,
			sucessors: []
		};
		// return getUtility( state );
	}
	v = +999999999;
	sucessors = getSucessors( state );
	for (var i = 0; i <= sucessors.length ; i++) {
		var s = sucessors[i];
		v = min( v, maxValue( s, alpha, beta) );
		if( v <= alpha ) {
			return v;
		}
		beta = min( beta, v );
	}
}


// retorna true se estado for terminal e false caso contrário
function isTerminalState( state ) {
	if( isBoardFull() ) {
		return true;
	}

	// Adicionar verificação de ausência de movimento para os dois lados

	if( state.depth >= 10 ) {
		return true;
	}
	else {
		return false;
	}

}

// retorna valor de utilidade do estado
function getUtility( state ) {


}

// retorna estados sucessores do estado passado como parâmetro
function getSucessors( state ) {


}