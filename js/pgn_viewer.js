function PGNViewer(pgn) {
  var c = new Chess();
  c.load_pgn(pgn);

  this.history = c.history();
  this.header = c.header();
  this.chess = new Chess();
  this.moveNum = 0;
  this.deviatedAt = null;

  var onDrop = function(source, target) {
    var data = {from: source, to: target, promotion: 'q'};
    return this.move(data);
  }
  var onSnapEnd = function() {
    this.board.position(this.chess.fen());
  }
  this.board = ChessBoard('board',
    {position: 'start',
     draggable: true,
     onDrop: onDrop.bind(this),
     onSnapEnd: onSnapEnd.bind(this),
     pieceTheme: 'chessboardjs/img/chesspieces/wikipedia/{piece}.png'});


  this.displayNotation();
  this.setHeaderInfo();
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
    if (this.deviatedAt || this.endOfGame()) {
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
      if (this.deviatedAt && this.moveNum < this.deviatedAt)
        this.deviatedAt = null;
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

    while(this.deviatedAt) { this.back(); }

    var val;
    if (this.moveNum < num) {
      while (this.moveNum !== num) val = this.forward();
    } else {
      while(this.moveNum !== num) val = this.back();
    }
    return val;
  },

  displayNotation: function() {
    var notation = $('#notation').find('table');
    for (var i = 0, l = Math.floor(this.history.length / 2); i < l; i++) {
      var row = $('<tr>');
      $('<td>', {class: 'number', text: (i + 1).toString()}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[i * 2], data: {move: i * 2 + 1}}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[i * 2 + 1], data: {move: i * 2 + 2}}).appendTo(row);
      notation.append(row);
    }
    if (this.history.length % 2 === 1) {
      row = $('<tr>');
      $('<td>', {class: 'number', text: ((this.history.length + 1)/ 2).toString()}).appendTo(row);
      $('<td>', {class: 'move', text: this.history[this.history.length - 1], data: {move: this.history.length}}).appendTo(row);
      $('<td>', {class: 'move'}).appendTo(row);
      notation.append(row);
    }
  },

  setHeaderInfo: function() {
    var black = "";
    if (this.header.hasOwnProperty('Black')) {
      black += this.header.Black;
    }
    if (this.header.hasOwnProperty('BlackElo')) {
      black += " (" + this.header.BlackElo + ")";
    }

    var white = "";
    if (this.header.hasOwnProperty('White')) {
      white += this.header.White;
    }
    if (this.header.hasOwnProperty('WhiteElo')) {
      white += " (" + this.header.WhiteElo + ")";
    }

    $('#whiteplayer').find('.name').text(white || "White");
    $('#blackplayer').find('.name').text(black || "Black");
  },

  updateBoard: function() {
    this.board.position(this.fen());
  },

  move: function(data) {
    var move;
    if (move = this.chess.move(data)) {
      this.moveNum++;
      if (this.deviatedAt === null && move.san !== this.history[this.moveNum - 1])
        this.deviatedAt = this.moveNum;
      return move;
    } else {
      return 'snapback';
    }
  }
};
