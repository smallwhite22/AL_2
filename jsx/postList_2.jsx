import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';

//題號，預設1代表是範例
let newId = 1;
//題型
let qType = 1;
//不重覆亂數的容器
let haveIt = [];

//目前所在的題號
let currentQ = 1;

let cQ = 1;

let nextQ = 0;

// 整理JSON內元素資料相同的個數，ex:第一個題型的總數為qAllTypeDic[1]。
// 當最後一個題型為空的時候，!qAllTypeDic[?]會為true
let qAllTypeDic = {},
  e;
for (var i = 0, l = PostData.length; i < l; i++) {
  e = PostData[i];
  qAllTypeDic[e.qc] = (qAllTypeDic[e.qc] || 0) + 1;
}

//題型總數
let qAllType = Object
  .keys(qAllTypeDic)
  .length;

//總題數
let qAll = PostData.length;

//同題型內有幾題
let maxNr = PostData
  .filter(PostData => PostData.qc === qType)
  .length;

let newEx = qAllTypeDic[qType] + qType -1;

//產生不重複的隨機數字
function generateUniqueRandom(maxNr) {
  //Generate random number
  let random = (Math.random() * maxNr).toFixed();

  //Coerce to number by boxing
  random = Number(random);

  if (!haveIt.includes(random) && random != 0 && random != 1) {
    haveIt.push(random);
    return random;
  } else {
    if (haveIt.length < maxNr-1) {
      //Recursively generate number
      return generateUniqueRandom(maxNr);
    } else {
      console.log('No more numbers available.', qType, maxNr)
      return false;
    }
  }
}

function empty() {
  haveIt.length = 0;
}

//隨機產生的題號
let quNum = generateUniqueRandom(maxNr)-1;
console.log('quNum:', quNum,'haveIt:',haveIt)
class Post extends Component {

  // 建構子，每個 class 第一次產生時都會執行到這邊
  constructor(props) {
    super(props);

    // 這一行有點難解釋，想深入研究的麻煩自己查資料
    //

    this.handleChange = this
      .handleChange
      .bind(this);

    this.doIt = this
      .doIt
      .bind(this);
    this.doFirst = this
      .doFirst
      .bind(this);
    this.doSecond = this
      .doSecond
      .bind(this);

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
          id: PostData[quNum].n,
          ab: PostData[quNum].ab,
          ch: ''
        }
      ]
    }
  }

  componentDidMount() {}

  //抓取input輸入的值
  handleChange(e) {
    const value = e.target.value
    this.setState({value: value})
  }

  //點下提交按鈕會先執行這個
  doIt(idx, array) {

    //答對後執行的動作
    if (this.state.value == PostData[quNum].ch) {
      currentQ = currentQ + 1;
      cQ = cQ + 1;
      this.doFirst(array, () => this.doSecond(idx));
      //答錯後執行的動作
    } else {
      alert('答錯了')
      this.setState({value: ''})
    }
  }

  doFirst(array, callback) {

    if (cQ == qAllTypeDic[qType] && currentQ <= qAll) {
      console.log('產生題目，下一個範例個題號:', newEx)
      this.setState({
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos, {
            id: 'answer' + PostData[quNum].sn,
            ab: '',
            ch: PostData[quNum].ch
          }, {
            id: 'ex' + PostData[newEx].sn,
            ab: 'ex' + PostData[newEx].ab,
            ch: 'ex' + PostData[newEx].ch
          }
        ]

      }, callback);

      qType = qType + 1;
      
      
      //下列參數設定有錯
      nextQ = qAllTypeDic[qType] + qType;
      newEx = qAllTypeDic[qType] + qType;
      cQ = 1;

      empty();
      maxNr = PostData
        .filter(PostData => PostData.qc === qType)
        .length;
      console.log('亂數陣列清空', maxNr // if (currentQ > qAll) {   alert('練習完成') }
      )

    } else {
      console.log('產生答案')
      this.setState({
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos, {
            id: 'answer' + PostData[quNum].sn,
            ab: '',
            ch: PostData[quNum].ch
          }
        ]

      }, callback)
    }

  }

  doSecond(idx) {
    quNum = nextQ + generateUniqueRandom(maxNr)-qType;
    console.log('quNum:', quNum, 'nextQ:', nextQ, 'maxNr:', maxNr,'haveIt:',haveIt)
    console.log('cQ:',cQ,'currentQ:',currentQ,'qAllTypeDic[qType]:',qAllTypeDic[qType])
    // 亂數隨機產生一個 id 設定 state
    this.setState({
      value: '',
      // ES6 語法，就等於是把 todos 新增一個 item
      todos: [
        ...this.state.todos, {
          id: PostData[quNum].sn,
          ab: PostData[quNum].ab,
          ch: ''
        }
      ]
    })
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
        </ul>
        Input:
        <input type="text" value={this.state.value} onChange={this.handleChange}/>
        <button onClick={this.doIt}>Add item</button>
      </div>
    );
  }
}

export default Post;