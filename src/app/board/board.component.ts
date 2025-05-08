import { Component, OnInit } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  imports: [SquareComponent,CommonModule],
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: (string | null)[] | undefined;
  xIsNext: boolean | undefined;
  winner: string | null = null;
  isBotGame : boolean = false;
  human : string = 'X';
  currentPlayer :string = this.human;
  ai :string = 'O';

  score : Map<string,number> = new Map([
    ['X', 0],
    ['O', 0]
  ]);
  
  scores = {
    'X': -10,
    'O':  10,
    'tie': 0
  };

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  getAvailableSpot() {
    // Check if squares exists and is an array
    if (!Array.isArray(this.squares) || this.squares.length === 0) {
      return -1;
    }
    for (let i = 0; i < this.squares.length; i++) {
      console.log("i=", i);
      if (this.squares[i] == null) {
        return i;
      }
    }
    return -1;
  }

  makeMove(idx: number) {
    console.log("we just entered makeMove");
    
    if (this.squares && !this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    
    
    this.winner = this.calculateWinner();
    if(this.isBotGame){
      this.playBot();
    }
    

  }



  playBot(){
    if (this.winner != null && this.score != undefined){
      let currentWinnerScore = Number(this.score.get(this.winner));
      this.score.set(this.winner,currentWinnerScore+1);
      console.log(this.score);
    }
    let indexAdv = Number(this.bestMove());    
    if (this.squares && !this.squares[indexAdv]) {
      this.squares.splice(indexAdv, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    if(this.squares){
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
          this.squares[a] &&
          this.squares[a] === this.squares[b] &&
          this.squares[a] === this.squares[c]
        ) {
          return this.squares[a];
        }
      }
      for(let i=0;i<9;i++){
        if(this.squares[i] == null){
            return null;
        }
      }
      return "tie";
    }
    return null;
    
  }

  minimax(board:(string|null)[], depth:number, isMaximizing:boolean) {
    let result = this.calculateWinner();
    if (result !== null && (result == 'X' || result == 'O' || result == 'tie') ) {
      return this.scores[result];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
          // Is the spot available?
          if (board[i] == null) {
            board[i] = this.ai;
            let score = this.minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
          // Is the spot available?
          if (board[i] == null) {
            board[i] = this.human;
            let score = this.minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
      }
      return bestScore;
    }
  }
  
  bestMove() {
    // AI to make its turn
    if (!this.squares){
      return ;
    }
    let board = this.squares;

    let bestScore = -Infinity;
    let move = 0;
    for (let i = 0; i < 9; i++) {
        // Is the spot available?
        if (board[i] == null) {
          board[i] = this.ai;
          let score = this.minimax(board, 0, false);
          console.log("score of this i:", i ,score);         
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move =  i ;
          }
        
      }
    } 
    return move;
  }  

}
