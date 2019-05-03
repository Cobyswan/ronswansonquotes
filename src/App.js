import React, { Component } from "react";
import "./App.css";
import axios from "axios";
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: [],
      averageRating: 0,
      votes: [],
      voted: false
    };
  }

  getSessionInfo() {
    axios.get("/api/session").then(res => {
      this.setState({ votes: res.data.votes });
    });
  }

  checkIfVoted() {
    let { quote } = this.state;
    if (this.state.votes) {
      console.log('Compared Quote:', quote)
      for(let i = 0; i < this.state.votes.length; i++){
        console.log(this.state.votes[i])
        if(this.state.votes[i][0] === quote[0]){
          this.setState({voted: true})
          console.log("Did vote:", this.state.voted);
        }
      }
    }
  }

  componentDidMount() {
    this.getSessionInfo();
  }

  wordCount = quoteArr => {
    let quote = quoteArr.toString();
    return quote.split(" ").length;
  };

  getSmallQuote() {
    axios.get("http://ron-swanson-quotes.herokuapp.com/v2/quotes").then(res => {
      let count = this.wordCount(res.data);
      if (count <= 4) {
        if (res.data !== this.state.props)
          return this.setState({ quote: res.data });
      } else {
        this.getSmallQuote();
      }
    });
    this.setState({ voted: false });
  }

  getMediumQuote() {
    axios.get("http://ron-swanson-quotes.herokuapp.com/v2/quotes").then(res => {
      let count = this.wordCount(res.data);
      if (count <= 12 && count >= 5) {
        if (res.data !== this.state.props) this.setState({ quote: res.data });
      } else {
        this.getMediumQuote();
      }
    });
    this.setState({ voted: false });
  }

  getLargeQuote() {
    axios.get("http://ron-swanson-quotes.herokuapp.com/v2/quotes").then(res => {
      let count = this.wordCount(res.data);
      if (count >= 13) {
        if (res.data !== this.state.props)
          return this.setState({ quote: res.data });
      } else {
        this.getLargeQuote();
      }
    });
    this.setState({ voted: false });
  }

  rateQuote(rating) {
    let { quote } = this.state;
    axios.put(`/api/rate_quote/${rating}`, { quote }).then(res => {
      this.setState({ averageRating: res.data, voted: true });
    });
  }

  getQuoteAverage() {
    let { quote } = this.state;

    axios.put(`/api/get_average_rating`, { quote }).then(res => {
      this.setState({ averageRating: res.data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.quote !== prevState.quote) {
      this.getQuoteAverage();
      this.getSessionInfo();
      this.checkIfVoted();
    }
  }

  render() {
    console.log('render vote:', this.state.voted);
    return (
      <div className="mainContainer">
        <img
          className="mainContainer__Ron"
          src="https://parade.com/wp-content/uploads/2013/10/tv-show-best-boss-ron-swanson.jpg"
        />
        <div className="mainContainer__Buttons">
          <button onClick={() => this.getSmallQuote()}>Small Quote</button>
          <button onClick={() => this.getMediumQuote()}>Medium Quote</button>
          <button onClick={() => this.getLargeQuote()}>Large Quote</button>
        </div>
        <div className="mainContainer__Quote">{this.state.quote}</div>
        <div className="mainContainer__Ratings">
          {this.state.quote.length === 0 ? (
            ``
          ) : (
            <div className="mainContainer__ratingButtons">
              {
                !this.state.voted
              ?
              <div>
              <button onClick={() => this.rateQuote(1)}>1</button>
              <button onClick={() => this.rateQuote(2)}>2</button>
              <button onClick={() => this.rateQuote(3)}>3</button>
              <button onClick={() => this.rateQuote(4)}>4</button>
              <button onClick={() => this.rateQuote(5)}>5</button>
              </div>
              :
              `You've already voted`
              }
              <div className="mainContainer__Average">{` Average Rating: ${this.state.averageRating}`}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
