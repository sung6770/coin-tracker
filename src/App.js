import { useEffect, useState } from "react";
import "./Loading";
import Loading from "./Loading";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./App.css";

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

// 큰 수 포맷
function formatNumber(number = 0) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + "T";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + "K";
  } else {
    return number.toString();
  }
}

const TotalPrice = (price) => {
  return (
    <>
      <text>{formatNumber(price.value)}</text>
    </>
  );
};

function App() {
  const [colDefs, setColDefs] = useState([
    { field: "rank", headerName: "#", flex: 1 },
    { field: "id", headerName: "종목명", flex: 4, cellRenderer: CoinInfo },
    {
      field: "quotes.USD.price",
      headerName: "가격",
      flex: 2,
      valueFormatter: (p) => "$" + p.value.toLocaleString(),
    },
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
  ]);

  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [market, setMarket] = useState({});
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/global")
      .then((response) => response.json())
      .then((json) => setMarket(json));
    fetch("https://api.coinpaprika.com/v1/tickers?limit=20")
      .then((response) => response.json())
      .then((json) => setCoins(json));
    setLoading(false);
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: 800 }}>
      {loading ? <Loading loading={true} /> : null}
      <h1>
        시가 총액: {formatNumber(market.market_cap_usd)} | 거래량:
        {formatNumber(market.volume_24h_usd)}
      </h1>

      <AgGridReact rowData={coins} columnDefs={colDefs} />
    </div>
  );
}

export default App;
