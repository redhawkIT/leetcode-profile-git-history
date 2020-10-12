const axios = require("axios");
const cheerio = require("cheerio");

const getHtmlText = (cheerio, text) =>
  cheerio(`li:contains("${text}")`).children(".badge").text().trim();

const getLeetCodeProfile = async (username) => {
  try {
    const { data } = await axios.get(`https://leetcode.com/${username}/`);
    const $ = cheerio.load(data);
    return {
      solvedQuestions: getHtmlText($, "Solved Question"),
      acceptedSubmission: getHtmlText($, "Accepted Submission"),
      acceptanceRate: getHtmlText($, "Acceptance Rate"),
      reputation: getHtmlText($, "Reputation"),
      points: getHtmlText($, "Points"),
      problems: getHtmlText($, "Problems"),
      testCases: getHtmlText($, "Test Cases"),
    };
  } catch (error) {
    throw error;
  }
};

getLeetCodeProfile("ethanneff").then((json) =>
  console.log(JSON.stringify(json))
);
