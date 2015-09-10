describe("PGNViewer", function() {
  var pgnViewer,
      pgn = ['[Event "Hoogovens A Tournament"]',
             '[Site "Wijk aan Zee NED"]',
             '[Date "1999.01.20"]',
             '[EventDate "?"]',
             '[Round "4"]',
             '[Result "1-0"]',
             '[White "Garry Kasparov"]',
             '[Black "Veselin Topalov"]',
             '[ECO "B06"]',
             '[WhiteElo "2812"]',
             '[BlackElo "2700"]',
             '[PlyCount "87"]',
             '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5',
             '7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7',
             '12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6',
             '17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4',
             '22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6',
             '26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7',
             'Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2',
             '35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8',
             'Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0'].join('\n');

  beforeEach(function() {
    pgnViewer = new PGNViewer(pgn);
  });

  describe("::new", function() {
    it("pgnViewer defined", function() {
      expect(pgnViewer).toBeDefined();
    });

    it("extracts the move history", function() {
      expect(new PGNViewer('1. e4 e5 1-0').history).toEqual(["e4", "e5"]);
      expect(pgnViewer.history).toEqual(
        ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'Qd2', 'c6', 'f3', 'b5',
        'Nge2', 'Nbd7', 'Bh6', 'Bxh6', 'Qxh6', 'Bb7', 'a3', 'e5', 'O-O-O', 'Qe7', 'Kb1',
        'a6', 'Nc1', 'O-O-O', 'Nb3', 'exd4', 'Rxd4', 'c5', 'Rd1', 'Nb6', 'g3', 'Kb8',
        'Na5', 'Ba8', 'Bh3', 'd5', 'Qf4+', 'Ka7', 'Rhe1', 'd4', 'Nd5', 'Nbxd5', 'exd5',
        'Qd6', 'Rxd4', 'cxd4', 'Re7+', 'Kb6', 'Qxd4+', 'Kxa5', 'b4+', 'Ka4', 'Qc3',
        'Qxd5', 'Ra7', 'Bb7', 'Rxb7', 'Qc4', 'Qxf6', 'Kxa3', 'Qxa6+', 'Kxb4', 'c3+',
        'Kxc3', 'Qa1+', 'Kd2', 'Qb2+', 'Kd1', 'Bf1', 'Rd2', 'Rd7', 'Rxd7', 'Bxc4',
        'bxc4', 'Qxh8', 'Rd3', 'Qa8', 'c3', 'Qa4+', 'Ke1', 'f4', 'f5', 'Kc1', 'Rd2',
        'Qa7']
      );
    });

    it("initializes to the start position", function() {
      expect(pgnViewer.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    });
  });

  describe("#forward", function() {
    it("moves forward by one half move", function() {
      pgnViewer.forward();
      expect(pgnViewer.fen()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
      pgnViewer.forward();
      expect(pgnViewer.fen()).toBe("rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");
    });

    it("returns the move made", function() {
      expect(pgnViewer.forward()).toEqual("e4");
    });

    it("returns false at the end of the game", function() {
      for (var i = 0, l = pgnViewer.history.length; i < l; i++)
        pgnViewer.forward();
      expect(pgnViewer.forward()).toBe(false);
    });
  });

  describe("#backward", function() {
    it("moves backward by one half move", function() {
      pgnViewer.forward();
      pgnViewer.forward();
      expect(pgnViewer.fen()).toBe("rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");
      pgnViewer.back();
      expect(pgnViewer.fen()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    });

    it("returns the move made", function() {
      pgnViewer.forward();
      expect(pgnViewer.back()).toEqual("e4");
    });

    it("returns false at the beginning of the game", function() {
      expect(pgnViewer.back()).toBe(false);
    });
  });

  describe("#goToEnd", function() {
    beforeEach(function() {
      pgnViewer.goToEnd();
    });

    it("sets the move counter", function() {
      expect(pgnViewer.moveNum).toBe(pgnViewer.history.length);
    });

    it("goes to the final position", function() {
      expect(pgnViewer.fen()).toBe("8/Q6p/6p1/5p2/5P2/2p3P1/3r3P/2K1k3 b - - 3 44");
    });

    it("can go backward", function() {
      expect(pgnViewer.back()).toBe("Qa7");
    });

    it("cannot go forward", function() {
      expect(pgnViewer.forward()).toBe(false);
    });
  });

  describe("#goToStart", function() {
    beforeEach(function() {
      for (var i = 0; i < 5; i++) pgnViewer.forward();
      pgnViewer.goToStart();
    });

    it("sets the move counter", function() {
      expect(pgnViewer.moveNum).toBe(0);
    });

    it("goes to the start position", function() {
      expect(pgnViewer.fen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    });

    it("can go forward", function() {
      expect(pgnViewer.forward()).toBe('e4');
    });

    it("cannot go back", function() {
      expect(pgnViewer.back()).toBe(false);
    });
  });
});
