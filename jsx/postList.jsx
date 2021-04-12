import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';

class PostList extends Component {

  constructor(props) {
    super(props);
    let ar = 1;
    const qno = PostData[ar].n;
    const qlist = PostData[ar].ab;
    const anlist = PostData[ar].ch;
    this.state = {
      value: '',
      arr:1,
      todos: [
        {
          nn: PostData[0].n,
          q: PostData[0].ab,
          an: PostData[0].ch
        }, {
          nn: qno,
          q: PostData[ar].ab,
          an: anlist
        }
      ]
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

    if (this.state.value == this.state.arr) {
      console.log(this.state.value, ',right answer')
    } else {
      console.log(this.state.value + this.ar, ',wrong answer')
    }
  }

  render() {
    let todos = this.state.todos;

    return (
      <div>
        <ul>
          {todos.map((todo) => {

            // 傳回 jsx
            return (
              <li key={todo.nn}>
                {todo.q}, {todo.an}
              </li>
            );
          })
}
        </ul>

        <form onSubmit={this.CheckA}>
          <label>
            Input:
            <input type="text" value={this.state.value} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>

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
