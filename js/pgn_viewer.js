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
      var move = this.chess.undo();
      this.moveNum--;
      return move;
    }
  }
};
