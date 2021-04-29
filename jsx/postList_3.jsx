import React, {Component} from 'react';
import PostData from '../JSON/1/a1.json';
import Highlighter from "react-highlight-words";

//題型編號
let qType = 0;
//不重覆亂數的容器
let haveIt = [];

//目前所在的題號
let currentQ = 1;

let cQ = 0;

let nextQ = 0;

//該類型前的資料數量，需經過qType和countQn()計算
let directQ = 0;

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
console.log('題型類型總共有:' + qAllType)
//總題數
let qAll = PostData.length;

//同題型內有幾題
let maxNr = PostData
  .filter(PostData => PostData.qc == qType)
  .length;
console.log('maxNr: ', maxNr)
let newEx = qAllTypeDic[qType];

function QuestionNumber() {
  maxNr = PostData
    .filter(PostData => PostData.qc == qType)
    .length;
}

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

function countQn() {
  for (let i = 1; i <= qType - 1; i++) {
    directQ = directQ + qAllTypeDic[i]
  }
  console.log('i = ', directQ, ',該題型範例前的題目數量 = ', qAllTypeDic[i])
}

//隨機產生的題號
let quNum = 0;

class Post extends Component {
  // 建構子，每個 class 第一次產生時都會執行到這邊
  constructor(props) {
    super(props);

    // 這一行有點難解釋，想深入研究的麻煩自己查資料
    //

    this.gotoQuestion = this
      .gotoQuestion
      .bind(this);

    this.handleChange = this
      .handleChange
      .bind(this);

    this.handleCopy = this
      .handleCopy
      .bind(this);

    this.doIt = this
      .doIt
      .bind(this);

    this.showExample = this
      .showExample
      .bind(this);

    this.showQuestion = this
      .showQuestion
      .bind(this);

    // 設定 state
    this.state = {
      start: false,
      inputVisibility: true,
      audioPath: '',
      text1: '輸入答案:',
      text2: '',
      buttonCon: '送出答案',
      value: '',
      topic: '',
      searchText: PostData[0].ab,
      textToHighlight: PostData[0].ch,
      activeIndex: -1,
      caseSensitive: false,
      question: '',
      answer: '',
      btnCon: '顯示範例答案',
      show1: false,
      show2: false
    }
    console.log(this.state.todos)
  }

  componentDidMount() {}

  //抓取input輸入的值
  handleChange(e) {
    const value = e.target.value
    this.setState({value: value});

  }

  handleCopy(e) {
    e.preventDefault()
    alert('不要複製貼上喔');

  }

  //點下提交按鈕會先執行這個
  doIt(idx, array) {
    countQn();
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
    console.log('i = ', directQ)
    this.setState({
      text2: '答錯了，再試一次',
      audioPath: './sound/wrong.mp3'
    }, callback)

  }
  playWrongSound(idx) {
    let audio = new Audio(this.state.audioPath)
    audio.play()
  }

  doFirst(array, callback) {

    if (cQ == qAllTypeDic[qType] && currentQ < qAll) {
      console.log('產生題目，下一個範例個題號:', newEx)
      this.state.todos[currentQ - 1].ch = '答案: ' + PostData[quNum].ch;
      currentQ = currentQ + 1;
      this.setState({
        text2: '答對了，繼續下一題', audioPath: './sound/right.mp3',
        // ES6 語法，就等於是把 todos 新增一個 item

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
      this.state.todos[currentQ - 1].ch = '答案: ' + PostData[quNum].ch;
      this.setState({
        text2: '答對了，繼續下一題', audioPath: './sound/right.mp3',
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
      this.setState({inputVisibility: false, text2: '', text1: '全部答對了，練習結束', value: '', buttonCon: '再練習一次'})
    } else {
      quNum = nextQ + generateUniqueRandom(maxNr) - 1;
      console.log('quNum:', quNum, 'nextQ:', nextQ, 'maxNr:', maxNr, 'haveIt:', haveIt)
      console.log('cQ:', cQ, 'currentQ:', currentQ, 'qAll:', qAll, 'qAllTypeDic[qType]:', qAllTypeDic[qType])
      // 亂數隨機產生一個 id 設定 state
      this.setState({
        value: '',
        // ES6 語法，就等於是把 todos 新增一個 item

      })
    }
    console.log(this.state.todos)
    window.scrollTo(0, document.body.scrollHeight);
  }

  gotoQuestion = (ev, idx, array) => {
    qType = ev.currentTarget.value

    countQn()
    QuestionNumber()
    this.setState({start: true})
    this.doQuestionFirst(array, () => this.doQuestionSecond(idx));
    console.log('directQ: ', directQ, 'start', this.state.start, 'quNum: ', quNum, 'maxNr: ', maxNr)
  }

  doQuestionFirst(array, callback) {
    quNum = directQ + generateUniqueRandom(maxNr) - 1

    this.setState({
      searchText: PostData[directQ].ab,
      textToHighlight: PostData[directQ].ch,
      topic: PostData[directQ].lv
    }, callback)
  }
  doQuestionSecond(idx) {
    console.log('qType: ', qType, 'directQ: ', directQ, 'start', this.state.start, 'quNum: ', quNum, 'maxNr: ', maxNr)
  }

  showExample() {

    this.setState({show1: true, btnCon: '顯示題目'})

  }
  showQuestion() {
    cQ=cQ+1;
    this.setState({show2: true, question: PostData[quNum].ab})
  }

  render() {
    return (
      <div>
        <div className={this.state.start
          ? 'hide'
          : null}>
          <ul className={'css_topic'}>
            {PostData
              .filter(qabtn => qabtn.qa == 1)
              .map(PostData => <li key={PostData.en}>
                <button onClick={this.gotoQuestion} value={PostData.qc}>{PostData.lv}</button>
              </li>)
}
          </ul>
        </div>
        <div className={this.state.start
          ? null
          : 'hide'}>
          <div>{this.state.topic}</div>
          <div className={'color-red'}>{this.state.searchText}</div>
          <div
            className={this.state.show1
            ? 'fade-in'
            : 'opacity0'}><Highlighter
            highlightClassName="color-red"
            searchWords={[this.state.searchText]}
            autoEscape={true}
            textToHighlight={this.state.textToHighlight}/>
          </div>
          <div
            className={this.state.show2
            ? 'fade-in'
            : 'opacity0'}>
            <div>{cQ}/{maxNr}</div>
            <div>{this.state.question}</div>
            <div>{this.state.answer}</div>
          </div>
          <div>
            <button
              onClick={this.showExample}
              className={this.state.show1
              ? 'hide'
              : null}>{this.state.btnCon}</button>
            <button
              onClick={this.showQuestion}
              className={this.state.show1
              ? null
              : 'hide'}>{this.state.btnCon}</button>
          </div>
        </div>
      </div>
    )

  }
}

export default Post;
