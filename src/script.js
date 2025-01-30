const blockChainInfoAPI = `https://blockchain.info/balance?active=`;
const priceAPI = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;

const fetchCachedPrice = async () => {
  const cacheKey = 'bitcoinPrice';
  const cachedData = localStorage.getItem(cacheKey);
  const fiveMinutes = 5 * 60 * 1000;

  if (cachedData) {
    const { price, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < fiveMinutes) {
      return price;
    }
  }

  const priceResponse = await fetch(priceAPI);
  const priceData = await priceResponse.json();
  const currentPrice = priceData.bitcoin.usd;

  localStorage.setItem(
    cacheKey, 
    JSON.stringify({ 
      price: currentPrice, 
      timestamp: Date.now()
    })
  );

  return currentPrice;
}

const fetchWalletBalance = async (walletAddress) => {
  const balanceResponse = await fetch(`${blockChainInfoAPI}${walletAddress}`);
  const balanceData = await balanceResponse.json();
  const balanceInSAT = balanceData[walletAddress].final_balance;
  const balanceInBTC = balanceInSAT / 100000000;

  const priceResponse = await fetch(priceAPI);
  const priceData = await priceResponse.json();
  const currentPrice = priceData.bitcoin.usd;

  const totalValue = balanceInBTC * currentPrice;

  return {
    balance: balanceInBTC,
    price: currentPrice,
    value: totalValue
  };
}