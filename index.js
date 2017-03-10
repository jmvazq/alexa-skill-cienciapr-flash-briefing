const rp = require('request-promise');
const xml2js = require('xml2js');
const express = require('express');
const app = express();

const PORT = 3000;
const RSS_URL = 'http://www.animenewsnetwork.com/all/rss.xml';

app.get('/', (appReq, appRes) => {
  rp(RSS_URL)
    .then(rssRes => xml2js.parseString(rssRes, (err, rssJSON) => {
      let alexaNewsItems = [];

      rssJSON.rss.channel[0].item.forEach(item => {
        alexaNewsItems.push({
          uid: item.guid[0]._,
          updateDate: item.pubDate,
          titleText: item.title,
          mainText: item.description,
          redirectionURL: item.link[0]
        });
      });

      appRes.json(alexaNewsItems);
    }))
    .catch(err => {
      console.error(err);

      appRes.json({
        err
      });
    });
});

console.log(`Listening on port ${PORT}`);
app.listen(PORT);