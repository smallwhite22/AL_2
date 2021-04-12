import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';
var newId = 1;
var an = false;
class Post extends Component {

  // 建構子，每個 class 第一次產生時都會執行到這邊
  constructor(props) {
    super(props);

    // 這一行有點難解釋，想深入研究的麻煩自己查資料
    //
    this.onClick = this
      .onClick
      .bind(this);

    this.handleChange = this
      .handleChange
      .bind(this);

    this.showAnswer = this
      .showAnswer
      .bind(this);

    this.handleClick = this
      .handleClick
      .bind(this)

    // 設定 state
    this.state = {
      value: '',
      answers: [
        {
          id: '',
          ch: ''
        }
      ],
      todos: [
        {
          id: PostData[0].n,
          ab: PostData[0].ab,
          ch: PostData[0].ch
        }, {
          id: PostData[1].n,
          ab: PostData[1].ab,
          ch: ''
        }
      ]
    }
  }
  handleChange(e) {
    const value = e.target.value
    this.setState({value: value})
  }

  showAnswer() {

    if (this.state.value == PostData[newId].ch) {
      an = true;
      console.log(an)
      this.setState({
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos, {
            id: '',
            ab: '',
            ch: PostData[newId].ch
          }
        ]

      })
    }

  }

  onClick() {

    if (this.state.value == PostData[newId].ch && an == true) {
      an = false;
      newId = newId + 1;
      // 亂數隨機產生一個 id 設定 state
      this.setState({
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos, {
            id: PostData[newId].sn,
            ab: PostData[newId].ab,
            ch: ''
          }
        ]

      })
      console.log(this.state.value, PostData[newId].ab, newId,an)

    } else {
      console.log(PostData[newId].ab, 'no!!', newId,an)

    }

  }

  handleClick = () => {
    this.showAnswer();
    this.onClick();
  }

  render() {

    // 從 state 取出資料
    let todos = this.state.todos;
    let answers = this.state.answers;

    return (
      <div>

        <ul>
          {todos.map((todo) => {

            // 傳回 jsx
            return (
              <li key={todo.id}>
                <p>{todo.ab}</p>
                <p>{todo.ch}</p>
              </li>
            );
          })
}
          {/* {answers.map((answer) => {

            // 傳回 jsx
            return (
              <li key={answer.id}>
                <p>{answer.ch}</p>
              </li>
            );
          })
} */}

        </ul>

        Input:
        <input type="text" value={this.state.value} onChange={this.handleChange}/>
        <button onClick={this.handleClick}>Add item</button>
      </div>
    );
  }
}

export default Post;
