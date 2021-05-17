require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const regex = /^https?:\/\/(.*)/
count = 1
let urlLinks = []

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url

  if (url.match(regex)){
    res.send({
      original_url: url,
      short_url: count
    })
  }
  else{
    res.send({
      error: 'invalid url'
    })
  }
  if (url){
    urlLinks.push({
      url,
      count
    })
  }
  count += 1
  console.log("FROM POST : ", urlLinks)
})

app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const redirectTo = urlLinks.find(link => link.count === id)

  if (redirectTo){
    res.status(301).redirect(redirectTo.url)
  }
  else{
    res.json({
      error: "Invalid ID for short url"
    })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});