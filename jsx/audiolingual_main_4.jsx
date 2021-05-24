import React, {Component} from 'react';
import PostList from './postList_4.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <div><PostList/></div>
        <div></div>
      </div>
    )
  }
}



ReactDOM.render(
  <App/>, document.getElementById('root'))

