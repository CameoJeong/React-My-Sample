import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { favoritecolor: "red" };
    }
    // componentDidMount() { //method called after the component is rendered
    //     console.log("componentDidMount");
    //     setTimeout(() => {
    //         this.setState({ favoritecolor: "yellow" })
    //     }, 2000)
    // }
    // static getDerivedStateFromProps(props, state) {  //first method called component gets updated
    //     console.log("getDerivedStateFromProps");
    //     return { favoritecolor: props.favcol };
    // }
    getSnapshotBeforeUpdate(prevProps, prevState) { //have access to the props and state before the update
        console.log("getSnapshotBeforeUpdate");
        document.getElementById("div1").innerHTML =
            "Before the update, the favorite was " + prevState.favoritecolor;
        return null;
    }
    componentDidUpdate() { // if getSnapshotBeforeUpdate method is present, this method must be existing, called after update
        console.log("componentDidUpdate");
        document.getElementById("div2").innerHTML =
            "The updated favorite is " + this.state.favoritecolor;
    }
    shouldComponentUpdate() { //wheter update method render or not
        console.log("shouldComponentUpdate");
        return true;
    }
    changeColor = () => {
        this.setState({ favoritecolor: "blue" });
    }

    render() {
        console.log("render");

        return (
            <div>
                <Child></Child>
                <h1>My Favorite Color is {this.state.favoritecolor}</h1>
                <button type="button" onClick={this.changeColor}>Change color</button>
                <div id="div1"></div>
                <div id="div2"></div>
            </div>
        );
    }
}

class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: true };
    }
    // componentWillUnmount() {
    //   console.log("The component named Header is about to be unmounted.");
    // }
    // componentDidMount() {
    //   console.log("The component named Header is about to be mounted.");
    // }
    delHeader = (param1, b) => {
        console.log(param1);
        console.log(b);
        this.setState(state => ({
            show: !state.show,
        }));
    }
    render() {
        if (this.state.show) {
            return (
                <div>
                    <h1>Hello World!</h1>
                    <button type="button" onClick={(b) => this.delHeader("test", b)}>Toggle Header</button>
                </div>
            );
        }
        return (
            <button type="button" onClick={(b) => this.delHeader("test", b)}>Toggle Header</button>
        );


    }
}

// ReactDOM.render(<Header /*favcol="yellow"*/ />, document.getElementById('root'));


function Square(props) {
    console.log("Square rendered")
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {    
    console.log("Board rendered")

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
                squares: Array(9).fill("?"),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i] != '?') {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
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
          xIsNext: (step % 2) === 0,
        });
      }
    render() {
        console.log("Game rendered")

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
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
        if (squares[a] === 'X' && squares[a] === squares[b] && squares[a] === squares[c]) {
            return 'X';
        }
        if (squares[a] === 'O' && squares[a] === squares[b] && squares[a] === squares[c]) {
            return 'O';
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

registerServiceWorker();
