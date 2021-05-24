import React, {Component} from 'react';
//import PostData from '../JSON/1/a1.json';
import Highlighter from 'react-highlight-words';

//JSON檔案路徑
let postPath = 1;
const PostData = require('../JSON/1/b' + postPath + '.json');
const AudioData = require('../JSON/1/audio_b' + postPath + '.json');
//題型編號
let qType = 1;
//不重覆亂數的容器
let haveIt = [];

let cQ = 1;

let audioNo = 0;

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
let qAllType = Object.keys(qAllTypeDic).length;
console.log('題型類型總共有:' + qAllType);

//同題型內有幾題
let maxNr = PostData.filter((PostData) => PostData.tn == qType).length;

let newEx = qAllTypeDic[qType];

function QuestionNumber() {
  maxNr = PostData.filter((PostData) => PostData.qc == qType).length;
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
      console.log('No more numbers available.', qType, maxNr);
      return false;
    }
  }
}

function countQn() {
  for (let i = 1; i <= qType - 1; i++) {
    directQ = directQ + qAllTypeDic[i];
  }
  console.log('i = ', directQ, ',該題型範例前的題目數量 = ', qAllTypeDic[i]);
}

//隨機產生的題號
let quNum = generateUniqueRandom(maxNr) - 1;

class Post extends Component {
  // 建構子，每個 class 第一次產生時都會執行到這邊
  constructor(props) {
    super(props);
    this.s1chBtn = this.s1chBtn.bind(this);
    this.s1abBtn = this.s1abBtn.bind(this);
    this.s1Tos2 = this.s1Tos2.bind(this);
    this.s2Tos3 = this.s2Tos3.bind(this);
    this.s3Tos4 = this.s3Tos4.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.showQn = this.showQn.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.sendEnter = this.sendEnter.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.s2Audio1 = this.s2Audio1.bind(this);
    this.audioControl = this.audioControl.bind(this);

    // 這一行有點難解釋，想深入研究的麻煩自己查資料
    //
    this.state = {
      s1start: true,
      s1ch: false,
      s1ab: false,
      s2start: false,
      s2s: true,
      s2role: AudioData[audioNo].role,
      s3start: false,
      s4start: false,
      s4ex: false,
      s4an: false,
      s4qn: false,
      s4correct: false,
      s4showList: false,
      audioGoing:true,
      value: '',
      searchText: PostData[0].keyw,
      textToHighlight: PostData[0].ab,
      audioPath: AudioData[audioNo].path,
      resultPicPath: '',
      question: PostData[quNum].keyw,
      answer: PostData[quNum].ab,
      btnCon: '下一題',
      todos: [
        {
          id: '',
          ab: '',
          keyw: '',
        },
      ],
    };
  }

  sendAnswer(idx, array) {
    console.log('cQ: ', cQ);
    if (this.state.value == this.state.answer && cQ < maxNr) {
      this.rightFunc(array, () => this.rightFunc2(idx));
    } else if (this.state.value != this.state.answer) {
      this.wrongFunc(array, () => this.wrongFunc2(idx));
    }
  }

  rightFunc(array, callback) {
    if (cQ == 1) {
      this.setState(
        {
          audioPath: './sound/right.mp3',
          resultPicPath: './images/pic-right.png',
          s4correct: true,
          s4showList: true,
          todos: [
            {
              id: cQ,
              ab: PostData[quNum].ab,
              keyw: PostData[quNum].keyw,
            },
          ],
        },
        callback
      );
    } else if (cQ > 1 && cQ < maxNr - 1) {
      this.setState(
        {
          audioPath: './sound/right.mp3',
          resultPicPath: './images/pic-right.png',
          s4correct: true,
          s4showList: true,
          todos: [
            ...this.state.todos,
            {
              id: cQ,
              ab: PostData[quNum].ab,
              keyw: PostData[quNum].keyw,
            },
          ],
        },
        callback
      );
    } else if (cQ == maxNr - 1) {
      this.setState(
        {
          audioPath: './sound/right.mp3',
          resultPicPath: './images/pic-right.png',
          s4correct: true,
          s4showList: true,
          btnCon: '重新開始',
          todos: [
            ...this.state.todos,
            {
              id: cQ,
              ab: PostData[quNum].ab,
              keyw: PostData[quNum].keyw,
            },
          ],
        },
        callback
      );
    }
  }

  rightFunc2(idx) {
    let audio = new Audio(this.state.audioPath);
    audio.play();
  }

  wrongFunc(array, callback) {
    this.setState(
      {
        audioPath: './sound/wrong.mp3',
        resultPicPath: './images/pic-wrong.png',
      },
      callback
    );
  }

  wrongFunc2(idx) {
    let audio = new Audio(this.state.audioPath);
    audio.play();
  }

  nextQuestion(idx, array) {
    // console.log(
    //   'quNum: ',
    //   quNum,
    //   'directQ: ',
    //   directQ,
    //   'haveIt: ',
    //   haveIt,
    //   'maxNr: ',
    //   maxNr
    // );
    if (cQ < maxNr - 1) {
      cQ = cQ + 1;
      quNum = directQ + generateUniqueRandom(maxNr) - 1;
      this.next1(array, () => this.next2(idx));
    } else {
      window.location.reload();
    }
  }

  next1(array, callback) {
    this.setState(
      {
        audioPath: '',
        resultPicPath: '',
        s4correct: '',
        question: PostData[quNum].keyw,
        answer: PostData[quNum].ab,
        value: '',
      },
      callback
    );
  }

  next2(idx) {}

  sendEnter = (event) => {
    if (event.key === 'Enter') {
      this.sendAnswer();
    }
  };

  componentDidMount() {}

  s1chBtn() {
    this.setState((prevState) => ({
      s1ch: !prevState.s1ch,
    }));
  }

  s1abBtn() {
    this.setState((prevState) => ({
      s1ab: !prevState.s1ab,
    }));
  }

  s1Tos2() {
    this.setState({
      s1start: false,
      s2start: true,
    });

    this.s2Audio1();

    //this.s2Audio1(array, () => this.s2Audio2(idx));
  }

  s2Audio1() {
    console.log('audioNo: ', audioNo);
    if (audioNo < AudioData.length && !this.state.s3start) {
      audioNo = audioNo + 1;
      this.setState({
        audioPath: AudioData[audioNo].path,
        s2s: false,
      });
      let audio = new Audio(this.state.audioPath);
      audio.play();
      audio.onended = () => {
        this.s2Audio1();
      };
    } else {
    }
  }

  audioControl(){
    if(this.state.audioGoing){
      let audio = new Audio(this.state.audioPath);
      audio.pause();
      this.setState({
        audioGoing:false
      })
    }
    else{
      let audio = new Audio(this.state.audioPath);
      audio.play();
      this.setState({
        audioGoing:true
      })
    }
  }

  s2Tos3() {
    this.setState({
      s2start: false,
      s3start: true,
    });
  }

  s3Tos4() {
    this.setState({
      s3start: false,
      s4start: true,
    });
  }

  showAnswer() {
    this.setState({
      s4an: true,
    });
  }

  showQn() {
    this.setState({
      s4qn: true,
    });
  }

  //抓取input輸入的值
  handleChange(e) {
    const value = e.target.value;
    this.setState({value: value});
  }

  handleCopy(e) {
    // e.preventDefault() alert('不要複製貼上喔');
  }

  //點下提交按鈕會先執行這個

  render() {
    let todos = this.state.todos;
    return (
      <div>
        {/* 第一階段：說明 */}
        {this.state.s1start && (
          <div className={'s1Box'}>
            <div>聽說直接教學法（說明有語音）</div>
            <div className={'s1BtnBox'}>
              <div>
                <button onClick={this.s1chBtn}>
                  {this.state.s1ch ? '隱藏中文' : '顯示中文'}
                </button>
                <button onClick={this.s1abBtn}>
                  {this.state.s1ab ? '隱藏族語' : '顯示族語'}
                </button>
              </div>
            </div>

            {this.state.s1ch && <div className={'s1Text'}>我是中文</div>}
            {this.state.s1ab && <div className={'s1Text'}>我是族語</div>}

            <div>
              <button>再聽一次說明</button>
              <button onClick={this.s1Tos2}>開始聽說教學</button>
            </div>
          </div>
        )}
        {/* 第二階段：對話沒有文字 */}
        {this.state.s2start && (
          <div className={'s2Box'}>
            <div className={'s2ppl'}>
              <div>
                <img src={'./images/woman.png'} />
              </div>
              <div>
                <img src={'./images/man.png'} />
              </div>
            </div>
            <div className={'s2pic'}>
              <div>
                <img src={'./images/speaker.png'} />
              </div>
              <div>
                <img src={'./images/speaker.png'} />
              </div>
            </div>
            <div>
              <button onClick={this.audioControl}>暫停</button>
              <button onClick={this.s2Tos3}>下一階段</button>
            </div>
          </div>
        )}
        {/* 第三階段：自己錄音自己聽*/}
        {this.state.s3start && (
          <div className={'s3Box'}>
            <ul>
              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/woman.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>

              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/man.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>
              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/woman.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>

              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/man.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>
              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/woman.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>

              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/man.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>
              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'../images/woman.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>

              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/man.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>
              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/woman.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>

              <li>
                <div>
                  <button className={'s3Btn1'}>
                    <img src={'./images/man.png'} />
                  </button>
                  <button>錄音</button>
                  <button>聽錄音</button>
                </div>
              </li>
            </ul>
            <div>
              <button onClick={this.s3Tos4}>下一階段</button>
            </div>
          </div>
        )}
        {/* 第四階段：打字練習*/}
        {this.state.s4start && (
          <div className={'s4Box'}>
            <div className={'s4Title'}>聽說教學法練習</div>

            {!this.state.s4ex && (
              <div>
                <div className={'s4rule'}>
                  說明：依照題目的詞，參考範例在欄位中打出完整的句子
                </div>
                <div className={'s4ex_text'}>
                  <div>範例題目：</div>
                  <div>{PostData[0].keyw}</div>
                </div>
                {this.state.s4an && (
                  <div>
                    <div className={'s4ex_an'}>
                      範例答案：
                      <Highlighter
                        highlightClassName='color-red'
                        searchWords={[this.state.searchText]}
                        autoEscape={true}
                        textToHighlight={this.state.textToHighlight}
                      />
                    </div>
                  </div>
                )}
                {!this.state.s4an && (
                  <div>
                    <button onClick={this.showAnswer}>顯示範例答案</button>
                  </div>
                )}
                {this.state.s4an && !this.state.s4qn && (
                  <div>
                    <div>
                      <button onClick={this.showQn}>開始作答</button>
                    </div>
                  </div>
                )}
                {this.state.s4qn && (
                  <div>
                    <ul className='s4list'>
                      {todos.map((todo) => {
                        return (
                          <li key={todo.id}>
                            {this.state.s4showList && (
                              <div>
                                <div>
                                  {todo.id}.題目:{todo.keyw}
                                </div>
                                <div>答案:{todo.ab}</div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <div>
                      {!this.state.s4correct && (
                        <div className={'s4_answerArea'}>
                          <div className={'s4_qu'}>
                            {cQ}.題目:{this.state.question}
                          </div>
                          輸入答案：
                          <input
                            type='text'
                            value={this.state.value}
                            onChange={this.handleChange}
                            onPaste={this.handleCopy}
                            onKeyPress={this.sendEnter}
                            className={'input'}
                          />
                          <button
                            onClick={this.sendAnswer}
                            className={'s4Btn_send'}>
                            送出答案
                          </button>
                        </div>
                      )}
                      {this.state.s4correct && (
                        <div className={'s4NextQu'}>
                          <button onClick={this.nextQuestion}>
                            {this.state.btnCon}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={'s4pic'}>
                      <img src={this.state.resultPicPath} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Post;
