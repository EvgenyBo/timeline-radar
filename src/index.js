import React, { Component } from 'react';
import { render } from 'react-dom';
import ChannelView from './components/ChannelView/ChannelView';
import ChannelMap from './components/ChannelMap/ChannelMap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'ChannelView'
    };
  }

  changeGraph = (name) => {
    this.setState({
      name: name
    })
  }

  render() {
    const { name } = this.state;
    let Graph = null;
    if(name === 'ChannelView') Graph = <ChannelView width={'100%'} />
    if(name === 'ChannelMap') Graph = <ChannelMap width={'100%'} />
    return (
      <div>
        <button onClick={() => this.changeGraph('ChannelView')}>ChannelView</button>
        <button onClick={() => this.changeGraph('ChannelMap')}>ChannelMap</button>
        <h1>{name}</h1>
        {Graph}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
