'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

class SearchForm extends React.Component {
  constructor(props) {
    this.state = {
      redditBoard = null,
      queryLimit = null
    }
    
    this.handleBoardChange = this.handleBoardChange.bind();
    this.handleNumberChange = this.handleNumberChange.bind();
    this.handleSubmit = this.handleSubmit.bind();
  }

  handleBoardChange(e) {
    this.setState({ redditBoard: e.target.value });
  }

  handleNumberChange(e) {
    this.setState({ queryLimit: e.target.value });
  }

  handleSubmit() {
    e.preventDefault();
    // add submit code here
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          id='redditBoard'
          placeholder='search for a reddit board'
          value={this.state.redditBoard}
          onChange={this.handleBoardChange}
        />
        <input
          type='number'
          id='queryLimit'
          placeholder='number of results desired'
          value={this.state.queryLimit}
          onChange={this.handleNumberChange}
        />
      </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props) {

  }

  render() {
    return (

    )
  }
}