import React, {Component} from 'react';
//import PostData from '../JSON/1/a1.json';
import Highlighter from "react-highlight-words";

//JSON檔案路徑
let postPath = 1;
const PostData = require('../JSON/1/a' + postPath + '.json');
//題型編號
let qType = 0;
//不重覆亂數的容器
let haveIt = [];

let cQ = 0;

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

//同題型內有幾題
let maxNr = PostData
  .filter(PostData => PostData.qc == qType)
  .length;

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
    this.sendAnswer = this
      .sendAnswer
      .bind(this);

    this.gotoQuestion = this
      .gotoQuestion
      .bind(this);

    this.handleChange = this
      .handleChange
      .bind(this);

    this.handleCopy = this
      .handleCopy
      .bind(this);

    this.showExample = this
      .showExample
      .bind(this);

    this.showQuestion = this
      .showQuestion
      .bind(this);

    this.nextQuestion = this
      .nextQuestion
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
      show2: false,
      show3: false,
      correct: false,
      resultPicPath: ''
    }

  }

  componentDidMount() {}

  //抓取input輸入的值
  handleChange(e) {
    const value = e.target.value
    this.setState({value: value});

  }

  handleCopy(e) {
    // e.preventDefault() alert('不要複製貼上喔');

  }

  //點下提交按鈕會先執行這個

  wrongSound(array, callback) {
    console.log('i = ', directQ)
    this.setState({
      audioPath: './sound/wrong.mp3',
      resultPicPath: './images/pic-wrong.png'
    }, callback)

  }
  playWrongSound(idx) {
    let audio = new Audio(this.state.audioPath)
    audio.play()
  }
  rightSound(array, callback) {
    if (cQ < maxNr - 1) {
      this.setState({
        audioPath: './sound/right.mp3',
        resultPicPath: './images/pic-right.png',
        correct: true,
        show2: false,
        btnCon: '下一題'
      }, callback)
    } else {
      this.setState({
        audioPath: './sound/right.mp3',
        resultPicPath: './images/pic-right.png',
        correct: true,
        show2: false,
        btnCon: '其他題型'
      }, callback)
    }

  }
  playRightSound(idx) {
    let audio = new Audio(this.state.audioPath)
    audio.play()
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

    this.setState({show1: true, show2: true, btnCon: '顯示題目'})

  }
  showQuestion() {
    cQ = cQ + 1
    this.setState({show2: false, show3: true, question: PostData[quNum].ab, answer: PostData[quNum].ch})
  }

  sendAnswer(idx, array) {
    if (this.state.value == this.state.answer && cQ < maxNr) {
      this.rightSound(array, () => this.playRightSound(idx));
    } else if (this.state.value != this.state.answer) {
      this.wrongSound(array, () => this.playWrongSound(idx));
    }

  }

  nextQuestion(idx, array) {
    if (cQ < maxNr - 1) {
      cQ = cQ + 1
      quNum = directQ + generateUniqueRandom(maxNr) - 1
      this.next1(array, () => this.next2(idx));
    } else {
      window
        .location
        .reload();
    }
  }

  next1(array, callback) {

    this.setState({
      show2: false,
      correct: false,
      question: PostData[quNum].ab,
      answer: PostData[quNum].ch,
      resultPicPath: '',
      value: ''
    }, callback)

  }
  next2(idx) {}

  render() {
    return (
      <div>
        <div className={this.state.start
          ? 'hide'
          : null}>
          <ul className={'css_topic'}>
            {PostData
              .filter(qabtn => qabtn.qa == 1)
              .map(PostData => <li key={PostData.sn}>
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
            className={this.state.show3
            ? 'fade-in'
            : 'opacity0'}>
            <div>{cQ}/{maxNr - 1}</div>
            <div>{this.state.question}</div>
            <div className={this.state.correct
              ? null
              : 'hide'}>{this.state.answer}</div>
          </div>
          <div>
            <button
              onClick={this.showExample}
              className={this.state.show1
              ? 'hide'
              : null}>{this.state.btnCon}</button>
            <button
              onClick={this.showQuestion}
              className={this.state.show2
              ? null
              : 'hide'}>{this.state.btnCon}</button>
          </div>
          <div
            className={this.state.show3 && !this.state.correct
            ? null
            : 'hide'}>

            輸入答案:<input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              onPaste={this.handleCopy}/>

            <button className='btn1' onClick={this.sendAnswer}>{this.state.buttonCon}</button>
          </div>
          <div className={this.state.correct
            ? null
            : 'hide'}>
            <button onClick={this.nextQuestion}>{this.state.btnCon}</button>
          </div>
          <div><img src={this.state.resultPicPath}/></div>
        </div>
      </div>
    )

  }
}

export default Post;
