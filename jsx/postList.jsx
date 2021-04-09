import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';
let ar = 1;
let pp = PostData[ar].ex;

class PostList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.CheckA = this
      .CheckA
      .bind(this);
    this.handleChange = this
      .handleChange
      .bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  CheckA(event) {
    event.preventDefault();

    if (this.state.value == PostData[1].en) {
      console.log('EEEEE')
    } else {
      console.log('YYYYY')
    }
    console.log(this.state.value);
  }

  render() {

    return (
      <div>
        <div>
          <p>{PostData[0].ab}</p>
          <p>{PostData[0].en}</p>
        </div>
        <div>
          <p>{PostData[1].ab}</p>
          <p>{PostData[1].en}</p>
          <form onSubmit={this.CheckA}>
            <label>
              Name:
              <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    )
    // if (pp == false) {   console.log('yes')   return (     <div> <h1>YES!!</h1>
    // <h1>{PostData[3].ab}</h1> {PostData.map((postDetail, index) => { return (
    // <div key={postDetail.n}>             <h2
    // value={postDetail.en}>{postDetail.ab[0]}</h2>           </div>         )  })}
    //     </div>   ) } else {   console.log(pp)   return (     <p>no</p>   ) }

  }

}

export default PostList;
