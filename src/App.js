import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setCoins(json));
    setLoading(false);
  }, []);

  return (
    <div>
      <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
      {loading ? <strong>Loading..</strong> : null}
      <ul>
        {coins.map((coin) => (
          <li>
            {coin.name}({coin.username}): {coin.address.street}
            {/* 코인으로 수정 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
