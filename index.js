const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
 
const cookieJar = new tough.CookieJar();

let cookieStoreTime = new Date(); 



var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/nse', function (req, res) {
    console.log(req.query)
    const {symbol} = req.query;
    nseAPI({resource: `https://www.nseindia.com/api/quote-equity?symbol=${symbol}&section=trade_info`})
    .then((data) => {
        res.status(200).send(data.data);
    })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
        err
    });
  });
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/nse/price', function (req, res) {
    console.log(req.query)
    const {symbol} = req.query;
    nseAPI({resource: `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`})
    .then((data) => {
        res.status(200).send(data.data);
    })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
        err
    });
  });
})
 


const nseAPI = async function ({resource})  {
    let currentTime = new Date();
    if (currentTime - cookieStoreTime > 180000) {
        await setCookieJar();
        cookieStoreTime = currentTime;
    }
    return await axios.get(resource, {
        jar: cookieJar, // tough.CookieJar or boolean
        withCredentials: true, // If true, send cookie stored in jar
        });
}

const setCookieJar =  function () {
       return axios
        .get('https://www.nseindia.com', {
          jar: cookieJar, // tough.CookieJar or boolean
          withCredentials: true, // If true, send cookie stored in jar
        })
}


setCookieJar()
.then(() => {
    app.listen(3000);
    console.log('App started');
})
.catch(console.log)

 
