const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 80;

app.use(express.static("public"));

app.get("/banner", async (req, res) => {
  var date = new Date();
  var minutes = date.getMinutes();

  let imageBuffer;

  switch (minutes % 10) {
    case 0:
      imageBuffer = await htmlToImage("newsflash.html");
      break;
    case 1:
      imageBuffer = await htmlToImage("news.html?news=0");
      break;
    case 2:
      imageBuffer = await htmlToImage("news.html?news=1");
      break;
    case 3:
      imageBuffer = await htmlToImage("news.html?news=2");
      break;
    default:
      imageBuffer = await htmlToImage("index.html");
      break;
  }

  res.set("Content-Type", "image/png");
  res.send(imageBuffer);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const htmlToImage = async (link) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 620, height: 220 });
  await page.goto("http://localhost:80/pages/" + link, {waitUntil: 'networkidle2'});

  const content = await page.$("body");
  const imageBuffer = await content.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();

  return imageBuffer;
};
