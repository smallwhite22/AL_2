import React, {Component} from 'react';
import PostData from '../JSON/1/a1.json';

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

//題型總數 let qAllType = Object   .keys(qAllTypeDic)   .length; 總題數
let qAll = PostData.length;

//同題型內有幾題
let maxNr = PostData
  .filter(PostData => PostData.qc === qType)
  .length;

let newEx = qAllTypeDic[qType];

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
    if (haveIt.length < maxNr - 1) {
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
let quNum = generateUniqueRandom(maxNr) - 1;
console.log('quNum:', quNum, 'haveIt:', haveIt)

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

    // 設定 state
    this.state = {
      audioPath: '',
      text1: '輸入答案:',
      buttonCon: '送出答案',
      value: '',
      todos: [
        {
          id: PostData[0].n,
          ab: '範例: ' + PostData[0].ab,
          ch: '答案: ' + PostData[0].ch,
          qn: ''
        }, {
          id: PostData[quNum].n,
          ab: '題目: ' + PostData[quNum].ab,
          ch: '',
          qn: '1'
        }
      ]
    }
    console.log(this.state.todos)
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
    if (this.state.value == PostData[quNum].ch && currentQ < qAll) {
      currentQ = currentQ + 1;
      cQ = cQ + 1;
      this.doFirst(array, () => this.doSecond(idx));
      //答錯後執行的動作
    } else if (currentQ > qAll) {
      window
        .location
        .reload();
      console.log('重整頁面')
    } else if (this.state.value != PostData[quNum].ch && currentQ < qAll) {

      this.wrongSound(array, () => this.playWrongSound(idx));

    } else {
      window
        .location
        .reload();
      console.log('重整頁面')
    }

  }

  wrongSound(array, callback) {
    this.setState({
      audioPath: '../sound/wrong.mp3'
    }, callback)

  }
  playWrongSound(idx) {
    let audio = new Audio(this.state.audioPath)
    audio.play()
  }

  doFirst(array, callback) {
    this.state.todos[currentQ - 1].ch = '答案:' + PostData[quNum].ch;
    if (cQ == qAllTypeDic[qType] && currentQ < qAll) {
      console.log('產生題目，下一個範例個題號:', newEx)
      this.state.todos[currentQ - 1].ch = '答案:' + PostData[quNum].ch;
      currentQ = currentQ + 1;
      this.setState({
        audioPath: '../sound/right.mp3',
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos,
          // {   id: 'answer' + PostData[quNum].sn,   ab: '',   ch: '答案: ' +
          // PostData[quNum].ch },
          {
            id: 'ex' + PostData[newEx].sn,
            ab: '範例: ' + PostData[newEx].ab,
            ch: '答案: ' + PostData[newEx].ch
          }
        ]

      }, callback);

      qType = qType + 1;

      //下列參數設定有錯
      nextQ = qAllTypeDic[qType - 1] + nextQ;
      newEx = qAllTypeDic[qType] + newEx;
      cQ = 1;

      empty();
      maxNr = PostData
        .filter(PostData => PostData.qc === qType)
        .length;
      console.log('亂數陣列清空', maxNr // if (currentQ > qAll) {   alert('練習完成') }
      )

    } else {
      console.log('產生答案')
      this.state.todos[currentQ - 1].ch = '答案:' + PostData[quNum].ch;
      this.setState({

        audioPath: '../sound/right.mp3',
        // ES6 語法，就等於是把 todos 新增一個 item
        // todos: [   ...this.state.todos, {     id: 'answer' + PostData[quNum].sn, ab:
        // '',     ch: '答案: ' + PostData[quNum].ch   } ]

      }, callback)

    }

  }

  doSecond(idx) {

    let audio = new Audio(this.state.audioPath)
    audio.play()
    if (currentQ == qAll) {
      this.setState({text1: '全部答對了，練習結束', value: '', buttonCon: '再練習一次'})
    } else {
      quNum = nextQ + generateUniqueRandom(maxNr) - 1;
      console.log('quNum:', quNum, 'nextQ:', nextQ, 'maxNr:', maxNr, 'haveIt:', haveIt)
      console.log('cQ:', cQ, 'currentQ:', currentQ, 'qAll:', qAll, 'qAllTypeDic[qType]:', qAllTypeDic[qType])
      // 亂數隨機產生一個 id 設定 state
      this.setState({
        value: '',
        // ES6 語法，就等於是把 todos 新增一個 item
        todos: [
          ...this.state.todos, {
            id: PostData[quNum].sn,
            ab: '題目: ' + PostData[quNum].ab,
            ch: '',
            qn: cQ
          }
        ]
      })
    }
    console.log(this.state.todos)
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {

    // 從 state 取出資料
    let todos = this.state.todos;
    let answers = this.state.answers;

    return (
      <div>

        <ul className='list'>
          {todos.map((todo) => {

            // 傳回 jsx
            return (
              <li key={todo.id}>

                <div>
                  <div
                    className={todo.qn
                    ? 'class-a'
                    : 'class-b'}>{todo.qn}.</div>
                  <div
                    className={todo.qn
                    ? 'class-c'
                    : 'class-a'}>{todo.ab}</div>
                </div>

                <div
                  className={
                    !todo.qn && todo.ch ? "class-a" : 'class-b'
                   
                    }
                    
                    >
                     {todo.ch}</div>
              </li>
            );
          })
}
        </ul>
        <div className='wordBox'>
          {this.state.text1}<input
            className='input'
            type="text"
            value={this.state.value}
            onChange={this.handleChange}/>

          <button className='btn1' onClick={this.doIt}>{this.state.buttonCon}</button>
        </div>

      </div>
    );
  }
}

export default Post;
