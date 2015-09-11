function PGNViewer(pgn) {
  this.history = (function() {
    var chess = new Chess();
    chess.load_pgn(pgn);
    return chess.history();
  }());
  this.chess = new Chess();
  this.moveNum = 0;
  this.board = ChessBoard('board',
    {position: 'start', pieceTheme: 'chessboardjs/img/chesspieces/wikipedia/{piece}.png'});

  this.displayNotation();
}

PGNViewer.prototype = {
  fen: function() {
    return this.chess.fen();
  },

  endOfGame: function() {
    return this.moveNum === this.history.length;
  },

  startOfGame: function() {
    return this.moveNum === 0;
  },

  forward: function() {
    if (this.endOfGame()) {
      return false;
    } else {
      var move = this.history[this.moveNum];
      this.chess.move(move);
      this.moveNum++;
      return move;
    }
  },

  back: function() {
    if (this.startOfGame()) {
      return false;
    } else {
      var move = this.chess.undo().san;
      this.moveNum--;
      return move;
    }
  },

  goToEnd: function() {
    while (this.forward()) {}
  },

  goToStart: function() {
    while (this.back()) {}
  },

  skipForward: function() {
    for (var i = 0; i < 9; i++)
      this.forward();
    return this.forward();
  },

  skipBack: function() {
    for(var i = 0; i < 9; i++)
      this.back();
    return this.back();
  },

  goToMove: function(num) {
    if (num < 0 || num > this.history.length)
      return false;

    var val;
    if (this.moveNum < num) {
      while (this.moveNum !== num) val = this.forward();
    } else {
      while(this.moveNum !== num) val = this.back();
    }
    return val;
  },

  displayNotation: function() {
    var notation = $('#notation');
    for (var i = 0, l = Math.floor(this.history.length / 2); i < l; i++) {
      var row = $('<tr>');
      $('<td>', {class: 'number', text: (i + 1).toString()}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[i * 2]}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[i * 2 + 1]}).appendTo(row);
      notation.append(row);
    }
    if (this.history.length % 2 === 1) {
      row = $('<tr>');
      $('<td>', {class: 'number', text: ((this.history.length + 1)/ 2).toString()}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[this.history.length - 1]}).appendTo(row);
      $('<td>', {class: 'move'}).appendTo(row);
      notation.append(row);
    }
  },

  updateBoard: function() {
    this.board.position(this.fen());
  }
};
