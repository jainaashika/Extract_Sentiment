//setting up modules
const express = require('express');
const sentiment = require('sentiment');
const puppet = require('puppeteer');
const alert = require('alert');
const path = require('path');
const ejs = require('ejs');
const app = express();
global.extracted_t = global;
//setting up path
const static_path = path.join(__dirname, './public');
app.use(express.static(static_path));
//middleware
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
function senti(t) {
    const s = new sentiment();
    let result = s.analyze(t);
    let { score } = result;
    return score;
}
async function extract(url){
    const getdata = await puppet.launch()
    const page = await getdata.newPage()
    await page.goto(url, {
        waitUntil: 'load',//since we will be using valid urls only
        timeout: 0
    })
    const t = await page.$eval('*', (el) => el.innerText)
    extracted_t=senti(t);
    console.log(extracted_t);
    await getdata.close();
}

app.post('/url', (req, res) => {
    const { url } = req.body;
    if (!url) {
        alert('Enter Text first');
    }
    extract(url);
})

app.post('/text', (req, res) => {
    const { text } = req.body;
    if (!text) {
        alert('Enter Text first');
    }
    let score = senti(text);
    res.render('sentiment.ejs', { score: score });
})

//setup server
app.listen(3000, () => {
    console.log('start');
})
