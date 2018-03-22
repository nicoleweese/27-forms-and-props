'use strict';

import './style/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

class SearchForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      redditBoard: '',
      queryLimit: ''
    }
    
    this.handleBoardChange = this.handleBoardChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBoardChange(e) {
    this.setState({ redditBoard: e.target.value });
  }

  handleNumberChange(e) {
    this.setState({ queryLimit: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('submitted');
    this.props.retreiveBoard(this.state.redditBoard, this.state.queryLimit);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={this.props.error ? 'error' : null}>
        <input
          type='text'
          placeholder='search for a reddit board'
          value={this.state.redditBoard}
          onChange={this.handleBoardChange}
        />
        <input
          type='number'
          placeholder='number of results desired'
          min='0'
          max='100'
          value={this.state.queryLimit}
          onChange={this.handleNumberChange}
        />
        <button>Click me!</button>
      </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props);    
  }
  

  render() {
    let limitedResults = this.props.results.slice(0, this.props.limit);
    console.log(limitedResults);

    return(
      <div>
        <ul>
          {limitedResults.map((item, i) => {
            return <li key={i}><a href={item.url}>{item.title}<p>{item.ups}</p></a></li>;
          })}
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      topics: {},
      boardSelected: null,
      limit: null,
      boardError: null
    }

    this.retreiveBoard = this.retreiveBoard.bind(this);
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  componentDidMount() {
    if (localStorage.topics) {
      try {
        this.setState({ topics: JSON.parse(localStorage.topics)});
      } catch (err) {
        console.error(err);
      }
    }
  }

  retreiveBoard(board, limit) { 
    this.setState({ limit })

    if(!this.state.topics[board]) {
      superagent.get(`http://www.reddit.com/r/${board}.json?limit=100`)
        .then(res => {
          if (!res) {
            return this.setState({boardError: true, boardSelected: null});
          }
          
          let info = res.body.data.children.map( x => {
            return {title: x.data.title,
                    url: x.data.url,
                    ups: x.data.ups};
          });
          let infoObj = { [board]: info };
          console.log(infoObj);
          let concat = Object.assign({}, infoObj, this.state.topics);
          console.log('concattttt', concat);
          
          try {
            this.setState({ topics: concat, boardSelected: board, boardError: false });
            localStorage.topics = JSON.stringify(this.state.topics);
          } catch (err) {
            console.error(err);
          }
        })
        .catch(()=> {
          return this.setState({boardError: true, boardSelected: null}); 
        });
    } else {
      this.setState({ boardSelected: board, boardError: false });
    }
  }

  render() {
    return (
      <main>
        <h1>Reddit Board Search</h1>
        <SearchForm retreiveBoard={this.retreiveBoard} error={this.state.boardError} />

        { this.state.boardError ?
          <div>
            <h3>Error! The board {this.state.boardSelected} does not exist</h3>
          </div>
          :
          this.state.boardSelected ? 
            <div>
              <h3>Board Selected</h3>
              <h4>{this.state.boardSelected}</h4>
              <SearchResultList results={this.state.topics[this.state.boardSelected]} limit={this.state.limit} />
            </div>
            :
            <div>
              <p>please select a reddit board </p>
            </div>
        }
      </main>
    )
  }
}

ReactDom.render(<App />, document.getElementById('root'));