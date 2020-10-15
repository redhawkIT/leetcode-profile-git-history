const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const getValue = (cheerio, text) => {
  const output = cheerio(`span:contains("${text}")`)
    .parent()
    .parent()
    .children("span")
    .text();
  if (output === "") throw new Error(`unable to retrieve data for: ${text}`);
  return output;
};

const getProblem = (cheerio, index) =>
  cheerio('span[class^="difficulty-ac-count"]').parent().eq(index).text();

const getProblems = (cheerio) =>
  cheerio('div[class^="total-solved-count"]').text();

const getSolutions = (cheerio) =>
  cheerio(".ant-card-head-title").eq(3).text().split(" ")[0];

const getAcceptance = (cheerio) =>
  cheerio('div[class^="total-solved-count"]')
    .parent()
    .parent()
    .children()
    .eq(1)
    .text()
    .replace("Acceptance", "");

(async () => {
  const username = "ethanneff";  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://leetcode.com/${username}/`);
  await page.waitForSelector(".ant-card");
  const html = await page.content();
  const $ = cheerio.load(html);
  const scrape = {
    solutions: {
      problems: getProblems($),
      submissions: getSolutions($),
      acceptance: getAcceptance($),
      easy: getProblem($, 0),
      medium: getProblem($, 1),
      hard: getProblem($, 2),
    },
    contributions: {
      points: getValue($, "Points"),
      problems: getValue($, "Problems"),
      testCases: getValue($, "Testcases"),
      reputation: getValue($, "Reputation"),
    },
    username,
  };
  const prettyJson = JSON.stringify(scrape, null, 2);
  await browser.close();
  return console.log(prettyJson);
})();
