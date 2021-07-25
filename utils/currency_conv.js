async function getExchangeRate() {
    try {
      const rateUsd = await axios.get(`https://api.coinbase.com/v2/prices/spot?currency=USD`)
      const rateNgn = await axios.get(`https://api.coinbase.com/v2/prices/spot?currency=NGN`)
     // console.log(rateNgn)
      // let mull = rateNgn.data.rates.NGN
      // console.log(Number(mull))
    let mul = rateUsd.data.data.amount
    let mulng = rateNgn.data.data.amount
    return Number(mulng)/Number(mul)
      //return rateNgn
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }

module.exports = getExchangeRate;