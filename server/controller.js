const quotes = [{ quote: "holder", ratings: [0], averageRating: 0 }];
let average = 0;
let sum = 0;

module.exports = {
  rateQuote: (req, res) => {
    if (!req.session.votes) {
      req.session.votes = [];
    }

    let { quote } = req.body;
    let { rating } = req.params;
    let index = quotes.findIndex(ele => ele.quote[0] === quote[0]);

    let getAverage = () => {
      sum = quotes[index].ratings.reduce(
        (accumulator, currentValue) =>
          parseInt(accumulator) + parseInt(currentValue)
      );
      average = sum / quotes[index].ratings.length;
    };
    if (index === -1) {
      quotes.push({ quote: quote, ratings: [rating], averageRating: rating });
      req.session.votes.push(quote);

      res.status(200).json(rating);
    } else {
      quotes[index].ratings = [...quotes[index].ratings, rating];
      getAverage();
      quotes[index].averageRating = average;

      res.status(200).json(average);
    }
  },
  getAverageRating: (req, res) => {
    let { quote } = req.body;

    let averageIndex = quotes.findIndex(ele => {
      return ele.quote[0] == quote[0];
    });

    if (averageIndex === -1) {
      res.status(200).json(0);
    } else {
      res.status(200).json(quotes[averageIndex].averageRating);
    }
  },
  getSessionInfo: (req, res) => {
    res.status(200).json(req.session);
  }
};
