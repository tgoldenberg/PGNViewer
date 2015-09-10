function PGNViewer(pgn) {
  this.history = (function() {
    var chess = new Chess();
    chess.load_pgn(pgn);
    return chess.history();
  }());
  this.chess = new Chess();
  this.moveNum = 0;
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
  }
};
