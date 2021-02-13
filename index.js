const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
 
const cookieJar = new tough.CookieJar();

let cookieStoreTime; 



var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    console.log(req.query)
    let {symbol, section} = req.query;
    let url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
    if (section) {
      url += `&section=${section}`
    }
    nseAPI({resource: url})
    .then((data) => {
        console.log('about to send', symbol)
        res.status(200).send(data.data);
    })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
        err
    });
  });
})

// // respond with "hello world" when a GET request is made to the homepage
// app.get('/nse/price', function (req, res) {
//     console.log(req.query)
//     const {symbol} = req.query;
//     nseAPI({resource: `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`})
//     .then((data) => {
//         res.status(200).send(data.data);
//     })
//   .catch((err) => {
//     console.log(err);
//     res.status(500).send({
//         err
//     });
//   });
// })
 


const nseAPI = async function ({resource})  {
    let currentTime = new Date();
    if (!cookieStoreTime) {
        await setCookieJar();
        cookieStoreTime = currentTime;
    }
    if (currentTime - cookieStoreTime > 180000) {
        await setCookieJar();
        cookieStoreTime = currentTime;
    }
    // await new Promise((r) => setTimeout(r, 100));
    // await setCookieJar();
    return await axios.get(resource, {
        jar: cookieJar, // tough.CookieJar or boolean
        withCredentials: true, // If true, send cookie stored in jar
        });
}

const setCookieJar =  function () {
       cookieJar = new tough.CookieJar();
       return axios
        .get('https://www.nseindia.com', {
          jar: cookieJar, // tough.CookieJar or boolean
          withCredentials: true, // If true, send cookie stored in jar
        })
}


app.listen(3000);
console.log('App started');

 
