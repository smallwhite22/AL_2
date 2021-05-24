import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
//import offs from  'mp3-duration';

let postPath = 1;
const PostData = require('../JSON/1/a' + postPath + '.json');

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>目前數字：{count}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}>
        點我加一
      </button>
    </div>
  );
};

const Menu = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const [nnn, setnnn] = useState(0);

  return (
    <div>
      <div>目前群組：{items}</div>
      <button
        onClick={() => {
          setItems([...items, PostData[nnn].ch]);
          setnnn(nnn + 1);
          console.log(items);
        }}>
        增加群組
      </button>
    </div>
  );
};
const AddName = () => {
  const [names, setName] = useState(PostData);
  const [numbers, setNumber] = useState(true);
  console.log(numbers);
  return (
    <div>
      <ul>
        {names.map((name) => (
          <li key={name.sn}>{name.ab}</li>
        ))}
      </ul>
      <div>{names[0].ch}</div>
      <div>{numbers}</div>
    </div>
  );
};

const AddNumber = () => {
  const [ACount, setACount] = useState(0);

  function onClickA() {
    setACount(ACount + 1);
    setACount(ACount + 1);
    setACount(ACount + 1);
    console.log(ACount);
  }
  function onClickB() {
    setACount((newACount, newProps) => newACount + 1);
    setACount((newACount, newProps) => newACount + 1);
    setACount((newACount, newProps) => newACount + 1);
    console.log(ACount);
  }
  function clickConsole() {
    console.log(ACount);
  }
  return (
    <div>
      <div>目前數字：{ACount}</div>
      <button
        onClick={() => {
          onClickB();
          clickConsole();
        }}>
        點我加三
      </button>
    </div>
  );
};
const SomeComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 1) {
      document.title = 'Threshold of over 1 reached.';
      console.log(count);
    } else {
      document.title = 'No threshold reached.';
    }
  }, [count]);

  return (
    <div>
      <p>{count}</p>

      <button type='button' onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
};
const CounterB = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Counter第一次和因為state改變而重新渲染後');
    console.log(`Count的新值為${count}`);

    return () => {
      console.log(`Count的舊值為${count}`);
    };
  }, [count]);

  return (
    <div>
      <div>目前數字：{count}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}>
        點我
      </button>
    </div>
  );
};
const Home = () => {
  return (
    <div>
      <Counter />
      <br></br>
      <Menu />
      <br></br>
      <AddName />
      <br></br>
      <AddNumber />
      <br></br>
      <SomeComponent />
      <br></br>
      <CounterB />
    </div>
  );
};

ReactDOM.render(<Home />, document.getElementById('root'));
