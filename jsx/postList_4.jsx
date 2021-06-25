import React, {Component} from 'react';
//import PostData from '../JSON/1/a1.json';
import Highlighter from 'react-highlight-words';
//import ReactRecord from 'react-record';
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'; //B
import {ReactMic} from 'react-mic'; // C
import ReactMicRecord from 'react-mic-record'; //D

let context = new AudioContext();
console.log(context);
//JSON檔案路徑
let postPath = 1;
const PostData = require('../JSON/1/b' + postPath + '.json');
const AudioData = require('../JSON/1/audio_b' + postPath + '.json');
const IntroData = require('../JSON/1/instructions_b' + postPath + '.json');
//題型編號
let qType = 1;
//不重覆亂數的容器
let haveIt = [];

let myRecordNo = 0;
let blobBox = [''];
blobBox.length = AudioData.length;
for (var i = 0, l = blobBox.length; i < l; i++) {
  blobBox[i] = './sound/blank.mp3';
}
//錄影暫存路徑的容器

let cQ = 1;

//聲音路徑設定
let audioNo = 0;
let audioPath = AudioData[audioNo].path;
let audio = new Audio(audioPath);
//該類型前的資料數量，需經過qType和countQn()計算
let directQ = 0;

//錯誤次數
let wrongTime = 1;
let wrongTotal = 3;

//聽寫練習題號
let audioQ = 0;

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

// window.onload = function () {
//   audio.pause();
//   audioPath = IntroData[0].path;
//   audio = new Audio(audioPath);
//   audio.play();
// };

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

class RecorderD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      path: null,
    };
  }

  startRecording = () => {
    this.setState({
      record: true,
    });
  };

  stopRecording = () => {
    this.setState({
      record: false,
    });
  };

  play = () => {
    audio.pause();
    audio = new Audio(this.state.path);
    audio.play();
    console.log('path: ', this.state.path);
  };

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    this.setState({
      path: recordedBlob.blobURL,
    });
    blobBox[this.props.value - 1] = recordedBlob.blobURL;
    console.log(`value: `, this.props.value);
    console.log(`blobBox: `, blobBox);
  };

  render() {
    return (
      <div className={'recordBox'}>
        <ReactMicRecord
          record={this.state.record}
          className='sound-wave'
          onStop={this.onStop}
          strokeColor='#000000'
          backgroundColor='#FF4081'
        />
        <button
          onClick={this.startRecording}
          type='button'
          className={this.state.record ? 'btnRecording' : 'btnRecord'}></button>
        <button
          onClick={this.stopRecording}
          type='button'
          className={
            !this.state.record ? 'btnStopRecordNotActive' : 'btnStopRecord'
          }></button>
        <button
          onClick={this.play}
          type='button'
          className={!this.state.path ? 'btnPlayNotReady' : 'btnPlay'}></button>
      </div>
    );
  }
}
class RecorderC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      path: '',
    };
  }

  startRecording = () => {
    this.setState({record: true});
  };

  stopRecording = (recordedBlob) => {
    this.setState({
      record: false,
    });
    console.log('path: ');
  };

  play = () => {
    audio = new Audio(this.state.path);
    audio.play();
    console.log('path: ', this.state.path);
  };

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    this.setState({
      path: recordedBlob.blobURL,
    });
  };

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className='sound-wave'
          onStop={this.onStop}
          onData={this.onData}
          strokeColor='#000000'
          backgroundColor='#FF4081'
        />
        <button onClick={this.startRecording} type='button'>
          Start
        </button>
        <button onClick={this.stopRecording} type='button'>
          Stop
        </button>
        <button onClick={this.play} type='button'>
          Play
        </button>
      </div>
    );
  }
}

class RecorderB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordState: null,
      blobURL: null,
    };
  }

  start = () => {
    context.resume().then(() => {
      console.log('Playback resumed successfully');
    });
    this.setState({
      recordState: RecordState.START,
    });
  };

  stop = () => {
    this.setState({
      recordState: RecordState.STOP,
    });
  };

  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log('audioData', audioData);
    this.setState({
      blobURL: audioData.url,
    });
  };

  play = () => {
    audio = new Audio(this.state.blobURL);
    audio.play();
    console.log('path:', this.state.blobURL);
  };

  render() {
    const {recordState} = this.state;

    return (
      <div>
        <AudioReactRecorder state={recordState} onStop={this.onStop} />

        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.play}>Play</button>
      </div>
    );
  }
}
/*
class RecordVoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: null,
      isRecording: false,
    };
  }

  startRecording = () => {
    this.setState({
      isRecording: true,
    });
  };

  stopRecording = () => {
    this.setState({
      isRecording: false,
    });
  };

  onData = (recordedBlob) => {
    console.log('chunk of data is: ', recordedBlob);
  };

  onSave = (blobObject) => {
    console.log('You can tap into the onSave callback', blobObject);
  };

  onStop = (blobObject) => {
    console.log('blobObject is: ', blobObject);
    this.setState({
      blobURL: blobObject.blobURL,
    });
  };

  onStart = () => {
    console.log('You can tap into the onStart callback');
  };



  render() {
    const {isRecording} = this.state;
    return (
      <div className='record-mic'>
        <ReactRecord
          record={isRecording}
          onStop={this.onStop}
          onStart={this.onStart}
          onSave={this.onSave}
          onData={this.onData}>
          <div>
            <audio
              ref={(c) => {
                this.audioSource = c;
              }}
              controls='controls'
              src={this.state.blobURL}>
              <track kind='captions' />
            </audio>
          </div>
          <button onClick={this.startRecording} type='button'>
            Start
          </button>
          <button onClick={this.stopRecording} type='button'>
            Stop
          </button>
        </ReactRecord>
      </div>
    );
  }
}
*/
class S4Audio extends Component {
  constructor(props) {
    super(props);
    this.s4AudioFunc = this.s4AudioFunc.bind(this);
    this.state = {
      //s4AudioGoing: false,
    };
  }

  s4AudioFunc = (ev) => {
    if (!this.state.s4AudioGoing) {
      this.setState({
        //s4AudioGoing: true,
      });
      audio.pause();
      audioPath = ev.currentTarget.value;
      audio = new Audio(audioPath);
      audio.play();
      audio.onended = () => {
        this.setState({
          // s4AudioGoing: false,
        });
      };
    } else {
      audio.pause();
      this.setState({
        //s4AudioGoing: false,
      });
    }
  };

  render() {
    return (
      <button
        value={this.props.pathName}
        onClick={this.s4AudioFunc}
        className={
          this.state.s4AudioGoing ? 'audioStop' : 'audioFunc'
        }></button>
    );
  }
}

class Post extends Component {
  // 建構子，每個 class 第一次產生時都會執行到這邊
  constructor(props) {
    super(props);
    this.s1chBtn = this.s1chBtn.bind(this);
    this.s1abBtn = this.s1abBtn.bind(this);
    this.s0Tos1 = this.s0Tos1.bind(this);
    this.s1Audio = this.s1Audio.bind(this);
    this.s1Tos2 = this.s1Tos2.bind(this);
    this.s2Tos3Intro = this.s2Tos3Intro.bind(this);
    this.s3IntroTos3 = this.s3IntroTos3.bind(this);
    this.s4IntroTos4 = this.s4IntroTos4.bind(this);
    this.s3Tos4 = this.s3Tos4.bind(this);
    this.s3Tos3in2 = this.s3Tos3in2.bind(this);
    this.s3IntroAudio = this.s3IntroAudio.bind(this);
    this.s4IntroAudio = this.s4IntroAudio.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.showQn = this.showQn.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
    this.sendEnter = this.sendEnter.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.s2Audio1 = this.s2Audio1.bind(this);
    this.audioControl = this.audioControl.bind(this);
    this.s3in2Tos4 = this.s3in2Tos4.bind(this);
    this.s3audio = this.s3audio.bind(this);
    this.s4audio = this.s4audio.bind(this);
    this.sendAudioAnswer = this.sendAudioAnswer.bind(this);
    this.nextAudioQuestion = this.nextAudioQuestion.bind(this);
    this.s3in2re = this.s3in2re.bind(this);
    this.s5IntroAudio = this.s5IntroAudio.bind(this);
    this.sendAudioEnter = this.sendAudioEnter.bind(this);
    this.s3Tos4intro = this.s3Tos4intro.bind(this);
    this.s5IntroTos4 = this.s5IntroTos4.bind(this);
    // 這一行有點難解釋，想深入研究的麻煩自己查資料
    //
    this.state = {
      s0start: true,
      s1start: false,
      s1ch: false,
      s1ab: false,
      s2start: false,
      s2RecordPlay: false,
      s2s: true,
      s2intro: false,
      s3intro: false,
      audioRole: 0,
      s3start: false,
      s3in2qStart: false,
      s3in2start: false,
      s3in2Complete: false,
      s4intro: false,
      s4start: false,
      s4ex: false,
      s4an: false,
      s4qn: false,
      s4correct: false,
      s4showList: false,
      s5intro: false,
      s5start: false,
      s5finish: false,
      audioGoing: true,
      value: '',
      searchText: PostData[0].keyw,
      textToHighlight: PostData[0].ab,
      //audioPath: AudioData[audioNo].path,
      resultPicPath: '',
      question: PostData[quNum].keyw,
      questionAudio: PostData[quNum].keyPath,
      answer: PostData[quNum].ab,
      answerAudio: PostData[quNum].abPath,
      audioQuestion: AudioData[audioQ].path,
      audioQrole: AudioData[audioQ].role,
      audioAnswer: AudioData[audioQ].ab,
      btnCon2: '暫停',
      btnCon: '下一題',
      todos: [
        // {
        //   id: '',
        //   ab: '',
        //   keyw: '',
        //   correct: '',
        //   keyPath: '',
        //   abPath: '',
        //   picPath:'',
        // },
      ],
      s3in2List: [
        {
          n: '',
          path: '',
          role: '',
          correct: null,
          picPath: '',
          ab: '',
        },
      ],
    };
  }

  s1Audio() {
    audio.pause();
    audioPath = IntroData[0].path;
    audio = new Audio(audioPath);
    audio.play();
  }

  s3IntroTos3() {
    audio.pause();
    this.setState({
      s3intro: false,
      s3start: true,
      s1ab: false,
      s1ch: false,
    });
  }

  s4IntroTos4() {
    audio.pause();
    this.setState({
      s4intro: false,
      s3in2start: true,
      s1ab: false,
      s1ch: false,
    });
  }

  s5IntroTos4() {
    audio.pause();
    this.setState({
      s5intro: false,
      s4start: true,
      s1ab: false,
      s1ch: false,
      s4correct: false,
    });
  }

  s3IntroAudio() {
    audio.pause();
    audioPath = IntroData[2].path;
    audio = new Audio(audioPath);
    audio.play();
  }

  s4IntroAudio() {
    audio.pause();
    audioPath = IntroData[3].path;
    audio = new Audio(audioPath);
    audio.play();
  }

  s5IntroAudio() {
    audio.pause();
    audioPath = IntroData[4].path;
    audio = new Audio(audioPath);
    audio.play();
  }

  s3in2re() {
    audioQ = 0;
    wrongTime = 1;
    this.setState({
      s3in2List: [
        {n: '', path: '', role: '', correct: null, picPath: '', ab: ''},
      ],
      s4correct: false,
      s3in2Complete: false,
      s3in2qStart: false,
      audioQuestion: AudioData[audioQ].path,
      audioQrole: AudioData[audioQ].role,
      audioAnswer: AudioData[audioQ].ab,
    });
  }

  s5re = () => {
    cQ = 1;
    wrongTime = 1;
    haveIt = [];
    this.setState({
      s4intro: false,
      s4start: true,
      s4ex: false,
      s4an: true,
      s4qn: true,
      s4correct: false,
      s4showList: false,
      s5intro: false,
      s5start: false,
      s5finish: false,
      todos: [],
      btnCon: '下一題',
      value: '',
    });
  };

  sendAnswer(idx, array) {
    let NewValue = this.state.value.replace("'", '’');
    if (NewValue == this.state.answer && cQ < maxNr) {
      this.rightFunc(array, () => this.rightFunc2(idx));
    } else if (this.state.value != this.state.answer) {
      this.wrongFunc(array, () => this.wrongFunc2(idx));
    }
  }
  sendAudioAnswer(idx, array) {
    let NewValue = this.state.value.replace("'", '’');
    if (NewValue == this.state.audioAnswer) {
      this.rightAFunc(array, () => this.rightAFunc2(idx));
    } else {
      this.wrongAFunc(array, () => this.wrongAFunc2(idx));
    }
    console.log('audioQ: ', audioQ, 'wrongTime: ', wrongTime);
  }

  wrongAFunc(array, callback) {
    if (wrongTime < wrongTotal && audioQ < AudioData.length - 1) {
      wrongTime = wrongTime + 1;
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
        },
        callback
      );
    } else if (wrongTime < wrongTotal && audioQ == AudioData.length - 1) {
      wrongTime = wrongTime + 1;
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
        },
        callback
      );
    } else if (wrongTime == wrongTotal && audioQ < AudioData.length - 1) {
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
          s3in2qStart: true,
          s4correct: true,
          s3in2List: [
            ...this.state.s3in2List,
            {
              n: AudioData[audioQ].n + '.',
              path: AudioData[audioQ].path,
              role: AudioData[audioQ].role,
              ab: AudioData[audioQ].ab,
              correct: true,
              picPath: './images/pic-wrong.png',
            },
          ],
        },
        callback
      );
    } else if (wrongTime == wrongTotal && audioQ == AudioData.length - 1) {
      this.setState(
        {
          s3in2Complete: true,
          audioPath: './sound/wrong.mp3',
          s3in2qStart: true,
          s4correct: true,
          s3in2List: [
            ...this.state.s3in2List,
            {
              n: AudioData[audioQ].n + '.',
              path: AudioData[audioQ].path,
              role: AudioData[audioQ].role,
              ab: AudioData[audioQ].ab,
              correct: true,
              picPath: './images/pic-wrong.png',
            },
          ],
        },
        callback
      );
    }
  }

  wrongAFunc2(idx) {
    audio.pause();
    audioPath = this.state.audioPath;
    audio = new Audio(audioPath);
    audio.play();
  }
  nextAudioQuestion() {
    audioQ = audioQ + 1;
    wrongTime = 1;
    this.setState({
      s4correct: false,
      audioAnswer: AudioData[audioQ].ab,
      audioQrole: AudioData[audioQ].role,
      audioQuestion: AudioData[audioQ].path,
      value: '',
    });
  }

  rightAFunc(array, callback) {
    if (audioQ < AudioData.length - 1) {
      this.setState(
        {
          audioPath: './sound/right.mp3',
          s4correct: true,
          s3in2qStart: true,
          s3in2List: [
            ...this.state.s3in2List,
            {
              n: AudioData[audioQ].n + '.',
              path: AudioData[audioQ].path,
              role: AudioData[audioQ].role,
              ab: AudioData[audioQ].ab,
              correct: true,
              picPath: './images/pic-right.png',
            },
          ],
        },
        callback
      );
    } else {
      this.setState(
        {
          s3in2Complete: true,
          audioPath: './sound/right.mp3',
          s4correct: true,
          s3in2qStart: true,
          s3in2List: [
            ...this.state.s3in2List,
            {
              n: AudioData[audioQ].n + '.',
              path: AudioData[audioQ].path,
              role: AudioData[audioQ].role,
              ab: AudioData[audioQ].ab,
              correct: true,
              picPath: './images/pic-right.png',
            },
          ],
        },
        callback
      );
    }
  }

  rightAFunc2(idx) {
    audio.pause();
    audioPath = this.state.audioPath;
    audio = new Audio(audioPath);
    audio.play();
  }

  rightFunc(array, callback) {
    audio.pause();
    if (cQ == 1) {
      this.setState(
        {
          audioPath: './sound/right.mp3',
          resultPicPath: './images/pic-right.png',
          s4correct: true,
          s4showList: true,
          s5start: true,
          todos: [
            {
              id: cQ,
              ab: PostData[quNum].ab,
              abPath: PostData[quNum].abPath,
              keyw: PostData[quNum].keyw,
              keyPath: PostData[quNum].keyPath,
              result: true,
              picPath: './images/pic-right.png',
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
              abPath: PostData[quNum].abPath,
              keyw: PostData[quNum].keyw,
              keyPath: PostData[quNum].keyPath,
              result: true,
              picPath: './images/pic-right.png',
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
          s5finish: true,
          btnCon: '重新開始',
          todos: [
            ...this.state.todos,
            {
              id: cQ,
              ab: PostData[quNum].ab,
              abPath: PostData[quNum].abPath,
              keyw: PostData[quNum].keyw,
              keyPath: PostData[quNum].keyPath,
              result: true,
              picPath: './images/pic-right.png',
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
    audio.pause();
    if (wrongTime < wrongTotal) {
      wrongTime = wrongTime + 1;
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
          resultPicPath: './images/pic-wrong.png',
        },
        callback
      );
    } else if (wrongTime == wrongTotal && cQ < maxNr - 1) {
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
          resultPicPath: './images/pic-wrong.png',
          s4correct: true,
          s4showList: true,
          s5start: true,

          todos: [
            ...this.state.todos,
            {
              id: cQ,
              ab: PostData[quNum].ab,
              abPath: PostData[quNum].abPath,
              keyw: PostData[quNum].keyw,
              keyPath: PostData[quNum].keyPath,
              result: true,
              picPath: './images/pic-wrong.png',
            },
          ],
        },
        callback
      );
    } else if (wrongTime == wrongTotal && cQ == maxNr - 1) {
      this.setState(
        {
          audioPath: './sound/wrong.mp3',
          resultPicPath: './images/pic-wrong.png',
          s4correct: true,
          s4showList: true,
          btnCon: '重新開始',
          s5finish: true,
          todos: [
            ...this.state.todos,
            {
              id: cQ,
              ab: PostData[quNum].ab,
              abPath: PostData[quNum].abPath,
              keyw: PostData[quNum].keyw,
              keyPath: PostData[quNum].keyPath,
              result: true,
              picPath: './images/pic-wrong.png',
            },
          ],
        },
        callback
      );
    }
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
    wrongTime = 1;
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
        questionAudio: PostData[quNum].keyPath,
        value: '',
      },
      callback
    );
  }

  next2(idx) {
    console.log(this.state.questionAudio);
  }

  sendEnter = (event) => {
    if (event.key === 'Enter') {
      this.sendAnswer();
    }
  };

  sendAudioEnter = (event) => {
    if (event.key === 'Enter') {
      this.sendAudioAnswer();
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

  s0Tos1() {
    audio.pause();
    audioPath = IntroData[0].path;
    audio = new Audio(audioPath);
    audio.play();
    this.setState({
      s0start: false,
      s1start: true,
    });

    //this.s2Audio1(array, () => this.s2Audio2(idx));
  }

  s1Tos2() {
    audio.pause();
    this.setState({
      s1start: false,
      s2start: true,
      s1ab: false,
      s1ch: false,
    });

    this.s2Audio1();

    //this.s2Audio1(array, () => this.s2Audio2(idx));
  }

  s2Intro = () => {
    audio.pause();
    audioPath = IntroData[1].path;
    audio = new Audio(audioPath);
    audio.play();
    this.setState({
      s2intro: true,
      s1ab: false,
      s1ch: false,
    });
  };
  PlayRecordFun() {
    if (myRecordNo < blobBox.length) {
      audio = new Audio(blobBox[myRecordNo]);
      audio.play();
      audio.onended = () => {
        myRecordNo = myRecordNo + 1;
        this.PlayRecordFun();
        console.log(`blobBox: `, blobBox[myRecordNo]);
      };
    } else {
      console.log('錄音播放完畢');
      this.setState({
        s2RecordPlay: false,
      });
    }
  }
  PlayRecordAll = () => {
    audio.pause();
    myRecordNo = 0;
    this.PlayRecordFun();
    this.setState({
      s2RecordPlay: true,
    });
  };

  StopRecordAll = () => {
    audio.pause();
    myRecordNo = 0;
    this.setState({
      s2RecordPlay: false,
    });
  };

  s2Audio1() {
    if (audioNo < AudioData.length && !this.state.s3start) {
      audioPath = AudioData[audioNo].path;
      audio = new Audio(audioPath);
      this.setState({
        s2s: false,
        audioRole: AudioData[audioNo].role,
      });
      audio.play();
      audio.onended = () => {
        audioNo = audioNo + 1;
        this.s2Audio1();
        console.log('audioPath: ', audioPath);
      };
    } else {
      console.log('播放完畢');
    }
  }

  s2AudioRe = () => {
    audio.pause();
    audioNo = 0;
    this.s2Audio1();
  };

  s3audio = (ev) => {
    audio.pause();
    audioPath = ev.currentTarget.value;
    audio = new Audio(audioPath);
    audio.play();
  };

  s4audio = (ev) => {
    if (this.state.audioGoing) {
      audio.pause();
      audioPath = ev.currentTarget.value;
      audio = new Audio(audioPath);
      audio.play();
      this.setState({
        audioGoing: false,
      });
      audio.onended = () => {
        this.setState({
          audioGoing: true,
        });
      };
    } else {
      audio.pause();
      this.setState({
        audioGoing: true,
      });
    }
  };

  audioControl() {
    if (this.state.audioGoing) {
      audio.pause();
      this.setState({
        audioGoing: false,
        btnCon2: '播放',
      });
    } else {
      audio.play();
      this.setState({
        audioGoing: true,
        btnCon2: '暫停',
      });
    }
  }

  s2Tos3Intro() {
    this.setState({
      s2start: false,
      s3intro: true,
    });
    audio.pause();
    audioPath = IntroData[2].path;
    audio = new Audio(audioPath);
    audio.play();
  }
  s3Tos4intro() {
    this.setState({
      s3start: false,
      s4intro: true,
    });
    audio.pause();
    audioPath = IntroData[3].path;
    audio = new Audio(audioPath);
    audio.play();
  }
  s3Tos4() {
    this.setState({
      s3start: false,
      s4start: true,
    });
  }
  s3Tos3in2() {
    this.setState({
      s3start: false,
      s3in2start: true,
      audioGoing: false,
    });
  }

  s3in2Tos4() {
    wrongTime = 1;
    audio.pause();
    this.setState({
      s5intro: true,
      s3in2start: false,
      audioGoing: false,
    });
    audioPath = IntroData[4].path;
    audio = new Audio(audioPath);
    audio.play();
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
    e.preventDefault();
    //alert('不要複製貼上喔');
  }

  reAll = () => {
    window.location.reload();
  };

  //點下提交按鈕會先執行這個

  render() {
    let todos = this.state.todos;

    const test = <button value={''}>7777</button>;

    return (
      <div>
        <div className={'title'}>中高級教學模組</div>
        {/* 第0階段：開始前 */}
        {this.state.s0start && (
          <div className={'s0Box'}>
            <div>
              <button
                onClick={this.s0Tos1}
                className={`${'btnNo2'} ${'btnSame'}`}>
                點我開始
              </button>
            </div>
          </div>
        )}
        {/* 第一階段：說明 */}
        {this.state.s1start && (
          <div className={'s1Box'}>
            <div className={'alignCenter'}>
              <div>
                <img src={'./images/teacher0.png'} className={'h400'} />
              </div>
            </div>

            {!this.state.s2intro && (
              <div className={'s1BtnBox'}>
                <div className={'btnBoxIn'}>
                  <div>
                    <button onClick={this.s1abBtn}>族</button>
                  </div>

                  {this.state.s1ab && (
                    <div className={'s1Text'}>{IntroData[0].ab}</div>
                  )}
                </div>
                <div className={'btnBoxIn'}>
                  <div>
                    <button onClick={this.s1chBtn}>中</button>
                  </div>

                  {this.state.s1ch && (
                    <div className={'s1Text'}>{IntroData[0].ch}</div>
                  )}
                </div>
              </div>
            )}
            {this.state.s2intro && (
              <div className={'s1BtnBox'}>
                <div className={'btnBoxIn'}>
                  <div>
                    <button onClick={this.s1abBtn}>族</button>
                  </div>

                  {this.state.s1ab && (
                    <div className={'s1Text'}>{IntroData[1].ab}</div>
                  )}
                </div>
                <div className={'btnBoxIn'}>
                  <div>
                    <button onClick={this.s1chBtn}>中</button>
                  </div>

                  {this.state.s1ch && (
                    <div className={'s1Text'}>{IntroData[1].ch}</div>
                  )}
                </div>
              </div>
            )}

            <div className={'alignCenter'}>
              {/* <button onClick={this.s1Audio}>再聽一次說明</button> */}
              {(this.state.s2intro && (
                <button
                  onClick={this.s1Tos2}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  開始
                </button>
              )) || (
                <button
                  onClick={this.s2Intro}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  繼續
                </button>
              )}
            </div>
          </div>
        )}
        {/* 第一階段：對話沒有文字 */}
        {this.state.s2start && (
          <div className={'s2Box'}>
            <div className={'s4Title'}>
              請聽對話
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            <div className={'s2ppl'}>
              <div>
                <img
                  src={'./images/buttons/female.png'}
                  className={'s2pplPic'}
                />
              </div>

              <div>
                <img
                  src={'./images/buttons/femaleDialog.png'}
                  className={
                    this.state.audioRole == 1
                      ? 's2DialogPic'
                      : 's2DialogPicHide'
                  }
                />
              </div>

              <div className={'s2BlankSpace'}></div>

              <div>
                <img
                  src={'./images/buttons/maleDialog.png'}
                  className={
                    this.state.audioRole == 2
                      ? 's2DialogPic'
                      : 's2DialogPicHide'
                  }
                />
              </div>

              <div>
                <img src={'./images/buttons/male.png'} className={'s2pplPic'} />
              </div>
            </div>

            <div className={'s2BtnBox'}>
              <button
                onClick={this.s2AudioRe}
                className={`${'btnNo3'} ${'btnSame'}`}>
                重新開始
              </button>
              <button
                onClick={this.audioControl}
                className={`${'btnNo3'} ${'btnSame'}`}>
                {this.state.btnCon2}
              </button>
              <button
                onClick={this.s2Tos3Intro}
                className={`${'btnNo3'} ${'btnSame'}`}>
                下一階段
              </button>
            </div>
          </div>
        )}
        {/* 第二階段說明*/}
        {this.state.s3intro && (
          <div className={'s1Box'}>
            <div className={'alignCenter'}>
              <div className={'s4Title'}>第二階段說明</div>
              <div>
                <img src={'./images/teacher0.png'} className={'h400'} />
              </div>
            </div>

            <div className={'s1BtnBox'}>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1abBtn}>族</button>
                </div>

                {this.state.s1ab && (
                  <div className={'s1Text'}>{IntroData[2].ab}</div>
                )}
              </div>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1chBtn}>中</button>
                </div>

                {this.state.s1ch && (
                  <div className={'s1Text'}>{IntroData[2].ch}</div>
                )}
              </div>
            </div>

            <div className={'alignCenter'}>
              {/* <button onClick={this.s3IntroAudio}>再聽一次說明</button> */}
              <button
                onClick={this.s3IntroTos3}
                className={`${'btnNo3'} ${'btnSame'}`}>
                開始第二階段
              </button>
            </div>
          </div>
        )}
        {/* 第二階段：自己錄音自己聽*/}
        {!this.state.s3start && (
          <div className={'s3Box'}>
            <div className={'s3in2Title'}>
              <div>教學說明：</div>
              <div>
                點擊頭像聆聽剛剛對話裡面的句子，試著模仿並將聲音錄下來，錄完之後可點播放聆聽看看。
              </div>
            </div>
            <ul className={'s3in1Box'}>
              {AudioData.map((s3in1) => (
                <li key={s3in1.n}>
                  <div>
                    <button
                      value={s3in1.path}
                      onClick={this.s3audio}
                      className={'noBorder'}>
                      {s3in1.role == 1 && (
                        <img src={'./images/buttons/female.png'} />
                      )}
                      {s3in1.role == 2 && (
                        <img src={'./images/buttons/male.png'} />
                      )}
                    </button>
                  </div>
                  <RecorderD value={s3in1.n} />
                </li>
              ))}
            </ul>
            <div>
              {!this.state.s2RecordPlay && (
                <button
                  onClick={this.PlayRecordAll}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  全部播放
                </button>
              )}
              {this.state.s2RecordPlay && (
                <button
                  onClick={this.StopRecordAll}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  停止
                </button>
              )}
              <button
                onClick={this.s3Tos4intro}
                className={`${'btnNo3'} ${'btnSame'}`}>
                繼續
              </button>
            </div>
          </div>
        )}
        {/* 第三階段：說明*/}
        {this.state.s4intro && (
          <div className={'s1Box'}>
            <div className={'alignCenter'}>
              <div className={'s4Title'}>第三階段說明</div>
              <div>
                <img src={'./images/teacher0.png'} className={'h400'} />
              </div>
            </div>

            <div className={'s1BtnBox'}>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1abBtn}>族</button>
                </div>

                {this.state.s1ab && (
                  <div className={'s1Text'}>{IntroData[3].ab}</div>
                )}
              </div>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1chBtn}>中</button>
                </div>

                {this.state.s1ch && (
                  <div className={'s1Text'}>{IntroData[3].ch}</div>
                )}
              </div>
            </div>

            <div className={'alignCenter'}>
              {/* <button onClick={this.s4IntroAudio}>再聽一次說明</button> */}
              <button
                onClick={this.s4IntroTos4}
                className={`${'btnNo3'} ${'btnSame'}`}>
                開始第三階段
              </button>
            </div>
          </div>
        )}
        {/* 第三階段：聽打練習*/}
        {this.state.s3in2start && (
          <div className={'s3in2Box'}>
            <div className={'s3in2Title'}>
              <div>教學說明：</div>
              <div>點擊頭像聽老師談話的內容並寫出完整句子</div>
            </div>

            <div>
              {this.state.s3in2qStart && (
                <ul className={'s3in2List'}>
                  {this.state.s3in2List.map((s3in2) => (
                    <li key={s3in2.n}>
                      <div>
                        {s3in2.n}
                        <button value={s3in2.path} onClick={this.s3audio}>
                          {s3in2.role == 1 && (
                            <img src={'./images/buttons/female.png'} />
                          )}
                          {s3in2.role == 2 && (
                            <img src={'./images/buttons/male.png'} />
                          )}
                        </button>
                      </div>
                      <div>{s3in2.ab}</div>
                      <div className={'s3Pic'}>
                        {s3in2.correct && <img src={s3in2.picPath} />}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div>
                {!this.state.s4correct && (
                  <div>
                    <div className={'s3qBox'}>
                      <div>{audioQ + 1}.題目：</div>
                      <div>
                        <button
                          value={this.state.audioQuestion}
                          onClick={this.s3audio}>
                          {this.state.audioQrole == 1 && (
                            <img src={'./images/buttons/female.png'} />
                          )}
                          {this.state.audioQrole == 2 && (
                            <img src={'./images/buttons/male.png'} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className={'s3qInputBox'}>
                      輸入答案：
                      <input
                        type='text'
                        value={this.state.value}
                        onChange={this.handleChange}
                        onPaste={this.handleCopy}
                        onKeyPress={this.sendAudioEnter}
                        className={'input'}
                      />
                      <button
                        onClick={this.sendAudioAnswer}
                        className={`${'btnNo3'} ${'btnSame'}`}>
                        送出答案
                      </button>
                    </div>
                  </div>
                )}
                {this.state.s4correct && !this.state.s3in2Complete && (
                  <div className={'s4NextQu'}>
                    <button
                      onClick={this.nextAudioQuestion}
                      className={`${'btnNo3'} ${'btnSame'}`}>
                      {this.state.btnCon}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {this.state.s3in2Complete && (
              <div>
                <div>
                  <br />
                  <br />
                  恭喜你完成囉! 要再練習一次還是繼續呢?
                  <br />
                  <br />
                </div>
                <div className={'s3in2BtnBox'}>
                  <button
                    onClick={this.s3in2re}
                    className={`${'btnNo3'} ${'btnSame'}`}>
                    再練習一次
                  </button>
                  <button
                    onClick={this.s3in2Tos4}
                    className={`${'btnNo3'} ${'btnSame'}`}>
                    下一階段
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* 第四階段：說明*/}
        {this.state.s5intro && (
          <div className={'s1Box'}>
            <div className={'alignCenter'}>
              <div className={'s4Title'}>第四階段說明</div>
              <div>
                <img src={'./images/teacher0.png'} className={'h400'} />
              </div>
            </div>

            <div className={'s1BtnBox'}>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1abBtn}>族</button>
                </div>

                {this.state.s1ab && (
                  <div className={'s1Text'}>{IntroData[4].ab}</div>
                )}
              </div>
              <div className={'btnBoxIn'}>
                <div>
                  <button onClick={this.s1chBtn}>中</button>
                </div>

                {this.state.s1ch && (
                  <div className={'s1Text'}>{IntroData[4].ch}</div>
                )}
              </div>
            </div>

            <div className={'alignCenter'}>
              {/* <button onClick={this.s5IntroAudio}>再聽一次說明</button> */}
              <button
                onClick={this.s5IntroTos4}
                className={`${'btnNo3'} ${'btnSame'}`}>
                開始第四階段
              </button>
            </div>
          </div>
        )}
        {/* 第四階段：打字練習*/}
        {this.state.s4start && (
          <div className={'s4Box'}>
            <div className={'s4Title'}>第四階段</div>

            {!this.state.s4ex && (
              <div>
                <div className={'s4ex_text'}>
                  <div>
                    範例題目：
                    <S4Audio pathName={PostData[0].keyPath} />
                  </div>
                  <div>{PostData[0].keyw}</div>
                </div>
                {this.state.s4an && (
                  <div>
                    <div className={'s4ex_an'}>
                      範例答案：
                      <S4Audio pathName={PostData[0].abPath} />
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
                    <button
                      onClick={this.showAnswer}
                      className={`${'btnNo4'} ${'btnSame'}`}>
                      顯示範例答案
                    </button>
                  </div>
                )}
                {this.state.s4an && !this.state.s4qn && (
                  <div>
                    <div>
                      <button
                        onClick={this.showQn}
                        className={`${'btnNo4'} ${'btnSame'}`}>
                        開始作答
                      </button>
                    </div>
                  </div>
                )}
                {this.state.s4qn && (
                  <div>
                    {this.state.s5start && (
                      <ul className='s4list'>
                        {todos.map((todo) => {
                          return (
                            <li key={todo.id}>
                              {this.state.s4showList && (
                                <div className={'s4AnBox'}>
                                  <div className={'s4AnBoxIn'}>
                                    <div className={'s4An'}>
                                      <div className={'s4AnNo'}>{todo.id}.</div>
                                      題目:&nbsp;
                                      <S4Audio pathName={todo.keyPath} />
                                      <div className={'color-red'}>
                                        {todo.keyw}
                                      </div>
                                    </div>
                                    <div className={'s4AnText'}>
                                      答案:&nbsp;
                                      <S4Audio pathName={todo.abPath} />
                                      <Highlighter
                                        highlightClassName='color-red'
                                        searchWords={[todo.keyw]}
                                        autoEscape={true}
                                        textToHighlight={todo.ab}
                                      />
                                      <div className={'s4PicBox'}>
                                        {todo.result && (
                                          <img src={todo.picPath} />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <div className={'s4_answerAreaOutBox'}>
                      {!this.state.s4correct && (
                        <div className={'s4_answerArea'}>
                          <div className={'s4_qu'}>
                            {cQ}.題目:
                            <S4Audio pathName={this.state.questionAudio} />
                            {this.state.question}
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
                            className={`${'btnNo5'} ${'btnSame'}`}>
                            送出答案
                          </button>
                        </div>
                      )}
                      {this.state.s4correct && !this.state.s5finish && (
                        <div className={'s4NextQu'}>
                          <button
                            onClick={this.nextQuestion}
                            className={`${'btnNo3'} ${'btnSame'}`}>
                            {this.state.btnCon}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* <div className={'s4pic'}>
                      <img src={this.state.resultPicPath} />
                    </div> */}
                  </div>
                )}
              </div>
            )}
            {this.state.s5finish && (
              <div className={'s3in2BtnBox'}>
                <button
                  onClick={this.s5re}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  再練習一次
                </button>
                <button
                  onClick={this.reAll}
                  className={`${'btnNo3'} ${'btnSame'}`}>
                  重新開始
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Post;
