import React, { Component } from 'react';
import axios from 'axios';
import Title from '../../Components/Title';
import Buttons from '../Buttons';
import Message from '../../Components/Message';
import ColorCodes from '../ColorCodes';
import Loader from '../../Components/Loader';
import Tickers from '../../Components/Tickers';
import {
  handleFilterFunc, sortName, sortValue, displayCategory,
} from '../../handlers';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      manipulatedData: [],
      filter: '',
      sortBy: null,
      message: '',
    };
  }

  componentDidMount = async () => {
    try {
      setInterval(async () => {
        this.fetchData();
      }, 10000);
    } catch (error) {
      throw new Error(error);
    }
  }

  handleSort = (data, category) => {
    const { sortBy } = this.state;
    let order;
    if (sortBy === null || (sortBy.title !== category)) {
      order = 'ascending';
    }
    if (sortBy && sortBy.title === category && sortBy.order === 'ascending') {
      order = 'descending';
    }
    if (sortBy && sortBy.title === category && sortBy.order === 'descending') {
      order = null;
    }
    if (order) {
      const sortedArray = category === 'name' ? sortName(data, order) : sortValue(data, order, category);
      this.setState({
        sortBy: { title: category, order },
        filter: '',
        manipulatedData: sortedArray,
        message: `Data sorted by ${displayCategory(category)} in ${order} order.`,
      });
    } else {
      const sortedArray = sortValue(data, 'ascending', 'rank');
      this.setState({
        sortBy: null,
        manipulatedData: sortedArray,
        message: '',
      });
    }
  };

  handleFilter = (data, string) => {
    const { filter } = this.state;
    const filteredData = handleFilterFunc(data, string);
    const message = filter ? 'Data filtered.' : '';
    this.setState({ message, manipulatedData: filteredData, sortBy: null });
  };

  handleTextChange = (e) => {
    const { data } = this.state;
    const field = e.target.name;
    const newValue = e.target.value;
    this.setState({ [field]: newValue }, () => {
      this.handleFilter(data, newValue);
    });
  };

  manipulateOnRefetch = (data) => {
    const { filter, sortBy } = this.state;
    if (filter) {
      return handleFilterFunc(data, filter);
    }
    if (sortBy && sortBy.title === 'name') {
      return sortName(data, sortBy.order);
    }
    if (sortBy && sortBy.title !== 'name') {
      return sortValue(data, sortBy.order, sortBy.title);
    }
    return data;
  };

  fetchData = () => {
    axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=250')
      .then((response) => {
        const result = response.data;
        this.setState({ data: result, manipulatedData: this.manipulateOnRefetch(result) });
      })
      .catch((err) => { throw new Error(err); });
  }

  render = () => {
    const {
      data,
      manipulatedData,
      message,
      filter,
      sortBy,
    } = this.state;

    return (
      <React.Fragment>
        <Title
          size="h3"
          text={`There are ${data.length} coins on the market`} />
        <Buttons
          data={data}
          filter={filter}
          handleTextChange={this.handleTextChange}
          handleSort = {this.handleSort}/>
        <Message message={message}/>
        <ColorCodes />
        {!data.length ? <Loader /> : <Tickers
          manipulatedData = {manipulatedData}
          sortBy={sortBy}/>}
      </React.Fragment>
    );
  }
}

export default Main;
