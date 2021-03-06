import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    return (
        <button
            className={"square " + (props.isWinning ? "square--winning" : null)}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //9개의 사각형의 초기값을 null로 설정
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    renderSquare(i) {
        return (
            <Square
                isWinning={this.props.winningSquares.includes(i)}
                key={"square " + i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {

        return (
            
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        //누군가 승리하거나 square가 이미 다 채워졌다면
        if (calculateWinner(squares) || squares[i]) {
            return;
        } 
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        { move == this.state.stepNumber ? <b><i>{desc}</i></b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
            //alert('Winner is ' + winner + '!!!');
        } else if (!winner && this.state.stepNumber === 9 ) {
            alert('무승부!');
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={winner ? winner.line : []}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(lines[i]);
            return { player: squares[a], line: [a, b, c] };
        }
        
    }
    
    return null;
}


/*
이동 기록 목록에서 특정 형식(행, 열)으로 각 이동의 위치를 표시해주세요.
이동 목록에서 현재 선택된 아이템을 굵게 표시해주세요.
사각형들을 만들 때 하드코딩 대신에 두 개의 반복문을 사용하도록 Board를 다시 작성해주세요.
오름차순이나 내림차순으로 이동을 정렬하도록 토글 버튼을 추가해주세요.
승자가 정해지면 승부의 원인이 된 세 개의 사각형을 강조해주세요.
@승자가 없는 경우 무승부라는 메시지를 표시해주세요. 
*/