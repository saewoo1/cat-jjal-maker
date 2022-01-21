import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


console.log("야옹");



const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("😾!!한글은 쓰면 안된다냥!!😾");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {
      setErrorMessage("😾!!뭐라도 써라냥!!😾");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) { // 조건부 렌더링
  if (favorites.length === 0) {
    return (<div>사진 위 하트를 눌러 고양이 사진을 저장해용</div>);
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍" 
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const App = () => {
  const CAT1 =
    "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 =
    "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => { // useState에 직접 값을 넣는게 아니라, 함수 식으로 넣어 reload 됐을 떄 딱 한번만 불러옴. 계속 localStorage에 접근하는 불필요한 일을 안함
    return (jsonLocalStorage.getItem('counter'));
  })
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
   return jsonLocalStorage.getItem('favorites') || []
  });
  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat('First Nyang');
    console.log(newCat);
    setMainCat(newCat);
  }
  
  React.useEffect(() => { //원할 때 한번만 함수를 호출하고 싶엉
    setInitialCat();
  }, []) // 두번 째 인수에 원할 때를 넣어잉

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    setCounter((prev) => { //prev == 기존값, previous  //값 대신 함수를 넘기자!!
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites)
  }

  const counterTitle = counter === null ? "" : counter + "번째"

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
      <Favorites favorites={favorites} />
    </div>
  );
};



export default App;
//파일을 가져오고, 내보내고 모듈처럼
//export는 외부에서 이 function을 사용할 수 있도록