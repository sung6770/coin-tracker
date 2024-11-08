# 📌개요

이 프로젝트는 [[노마드코더] 바닐라 JS로 그림 앱 만들기](https://nomadcoders.co/react-for-beginners)강의 중 **#7.2Coin Tracker**에서 진행한 프로젝트를 기반으로 진행됐다.
강의에선 기본 틀만 잡고 마무리했지만 React를 연습할 겸 더욱 발전시켜 멋진 Coin Tracker를 만들고 싶어 진행하게 되었다.

프로젝트의 목적 - React를 직접 사용해보며 익히기 위함.
프로젝트 기간 - 2024.11.08 ~ 2024.11.08
결과물 - [Coin Tracker]()

---

# 📌Coin Tracker

내가 개발한 Coin Tracker는 암호화폐 시세를 알려주는 [Investing.com](https://kr.investing.com/crypto)을 참고하여 만들었다.

## ✨Loading

엄청나게 많은 코인의 정보를 불러오기 때문에 로딩창이 필요하다고 느꼈다.
단순히 로딩중이라는 텍스트를 띄우는 것이 별로라고 생각되어 `react-spinners` 라는 라이브러리를 사용했다.

```javascript
import { SyncLoader } from "react-spinners";

const override = {
  margin: "0 auto",
  marginTop: "300px",
  textAlign: "center",
  size: "20",
};

function Loading(loading) {
  return (
    <div>
      <SyncLoader
        color="#ff9500"
        cssOverride={override}
        loading={loading}
        margin={5}
        size={20}
      />
    </div>
  );
}

export default Loading;
```

다음과 같이 `Loading.js`을 만들고 API에 응답이 돌아올 때 까지 해당 컴포넌트를 나타내고, 그렇지 않으면 아무것도 나타나지 않게 하였다.

## ✨App

코인 정보는 Coinpaprika API를 통해 가져왔다.

```javascript
const [loading, setLoading] = useState(true);
const [coins, setCoins] = useState([]);
const [market, setMarket] = useState({});
useEffect(() => {
  fetch("https://api.coinpaprika.com/v1/global")
    .then((response) => response.json())
    .then((json) => setMarket(json));
  fetch("https://api.coinpaprika.com/v1/tickers")
    .then((response) => response.json())
    .then((json) => setCoins(json));
  setLoading(false);
}, []);
```

API 요청은 화면에 처음 컴포넌트가 렌더링될 때만 필요하므로 `useEffect()`를 사용해 deps에 빈 배열을 넣어주었다.
각 요청에 대한 응답이 도착하면 `loading`값을 `false`로 바꿔 로딩 창 대신 코인들에 대한 정보를 나타내게 했다.
<br />

```javascript
<h1>
  시가 총액: {formatNumber(market.market_cap_usd)} | 거래량:
  {formatNumber(market.volume_24h_usd)}
</h1>
```

첫번째 요청에 대한 응답으로 시가총액, 거래량을 화면 가장 위에 텍스트로 표시한다.
직접 만든 `formatNumber()` 함수를 통해 큰 수를 단위로 끊었다.
<br />

```javascript
<AgGridReact rowData={coins} columnDefs={colDefs} />
```

두번째 요청에 대한 응답으로 코인들의 정보를 테이블 형태로 나타내기 위해 `ag-grid-react`라이브러리를 사용했다.

### 랭킹

```javascript
const [colDefs, setColDefs] = useState([
    { field: "rank", headerName: "#", flex: 1 },
  ...
```

`raking`의 경우 숫자 그대로 나타내도록 했다.

### 종목명

```javascript
const CoinInfo = (coinId) => {
  const [coinInfo, setCoinInfo] = useState({});
  useEffect(() => {
    fetch(`https://api.coinpaprika.com/v1/coins/${coinId.value}`)
      .then((response) => response.json())
      .then((json) => setCoinInfo(json));
  }, []);
  return (
    <>
      <img src={coinInfo.logo} alt={coinId.value} width={"25px"} />
      {coinInfo.name}
    </>
  );
};
```

```javascript
	...
	{ field: "id", headerName: "종목명", flex: 4, cellRenderer: CoinInfo },
	...
```

코인의 이름을 나타내기 위해 `CoinInfo` 컴포넌트를 만들었다.
`coinId`를 인자로 받은 후 API 호출을 통해 로고, 이름 등 해당 코인에 대한 정보를 얻는다.
해당 셀에 컴포넌트를 나타나게 한다.

### 가격

```javascript
	...
	{
      field: "quotes.USD.price",
      headerName: "가격",
      flex: 2,
      valueFormatter: (p) => "$" + p.value.toLocaleString(),
    },
	...
```

USD로 표기하기 때문에 앞에 `$`를 붙히고 천 단위마다 `,`를 찍게 `valueFormatter`를 추가했다.

### 변동

```javascript
	...
	{
      field: "quotes.USD.percent_change_24h",
      headerName: "변동(24H)",
      flex: 2,
      valueFormatter: (p) => p.value + "%",
      cellClassRules: {
        "red-cell": (p) => p.value >= 0,
        "blue-cell": (p) => p.value < 0,
      },
    },
    {
      field: "quotes.USD.percent_change_7d",
      headerName: "변동(7D)",
      flex: 2,
      valueFormatter: (p) => p.value + "%",
      cellClassRules: {
        "red-cell": (p) => p.value >= 0,
        "blue-cell": (p) => p.value < 0,
      },
    },
	...
```

단위가 `%`기 때문에 `valueFormatter`를 추가했다.
해당 값이 양수면 `red-cell` 속성을, 음수면 `blue-cell`속성을 가지게 `cellClassRules`를 추가했다.

### 총 시가, 거래량

```javascript
const TotalPrice = (price) => {
  return (
    <>
      <text>{formatNumber(price.value)}</text>
    </>
  );
};
```

```javascript
	...
    {
      field: "quotes.USD.market_cap",
      headerName: "총 시가",
      flex: 2,
      cellRenderer: TotalPrice,
    },
    {
      field: "quotes.USD.volume_24h",
      headerName: "거래량(24H)",
      flex: 2,
      cellRenderer: TotalPrice,
    },
	...
```

`TotalPrice` 컴포넌트를 만들고 `formatNumber()`함수를 통해 큰 수를 단위로 끊었다.

# 📌고찰

처음에 아무것도 없이 페이지를 확장시키려고 하니 디자인은 어떻게 해야하고, 어떤 정보를 나타내야 하며, 무엇부터 시작해야 할 지 막막했었다.
그러다 시중에 존재하는 코인 시세를 알려주는 사이트들을 방문하다 내가 구상한 페이지와 비슷한 페이지를 발견해 이를 따라해보기로 결정했다.
또한 메모장에 내가 추가로 해야할 것들을 세부적으로 적고, 이를 지워나가는 방식으로 개발을 했다.
간단한 프로젝트기 때문에 해야할 것이 그렇게 많지 않았지만 기능을 하나씩 완성하고 지우다보니 성취감도 들고 내가 그 다음에 무엇을 해야할 지 확실히 알 수 있게 되었다.

그렇게 개발하던 중 생각치도 못한 문제가 발생했다.
![](https://velog.velcdn.com/images/sung6770/post/1c1c797a-8a1a-4054-a7ea-f7b137f00d1d/image.png)
바로 이녀석이다..
API에서 올바르지 않은 응답이 왔을 때 발생하는 오륜데 방금까지 잘 되던 것이 갑자기 안돼 당황했었다.
응답을 살펴보니 추가로 요청을 하기 위해선 요금을 지불해야 하고 그렇지 않으면 1시간을 기다려야 한다고 되어있었다.
이것때문에 1시간동안 기다려야한다는 생각이 들 무렵 API 요청 테스트를 했던 기록이 남아있다는 것을 발견하고 임시 데이터셋을 만들어 개발을 이어갔다.

이를 통해 앞으로 제한이 있는 API를 이용할 때 위 상황과 같이 같은 값을 응답받는 경우엔 데이터셋을 만들어두고 개발을 하고 마무리 단계에 코드를 수정해야겠다고 생각했다.

# 📌결과물

- [Github](https://github.com/sung6770/coin-tracker)
- [Coin Tracker]()
