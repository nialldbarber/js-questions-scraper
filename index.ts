import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

const baseUrl = "https://github.com/sudheerj/javascript-interview-questions";

type QuestionsT = {
  question: string;
};

interface DataT {
  allQuestions: QuestionsT[];
}

// fetch questions from github page
async function getData() {
  let hasLoaded = false;
  const data: DataT = {
    allQuestions: [],
  };

  try {
    // get page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle2" });
    // scrape data
    const html = await page.content();
    const $ = cheerio.load(html);
    const questions = $("tr").find("a");

    for (let i = 0; i < questions.length; i++) {
      data.allQuestions.push({
        question: questions.eq(i).text(),
      });
    }

    hasLoaded = true;

    await browser.close();
    return { hasLoaded, data };
  } catch (err) {
    console.log(err);
  }
}

// pluck a random question from the list and log it
async function getRandomQuestion() {
  try {
    const questions = await getData();

    if (questions?.hasLoaded) {
      // loop through questions and select one at random
      const { allQuestions } = questions.data;
      const randomQuestion =
        allQuestions[Math.floor(Math.random() * allQuestions.length)];

      console.log(`${randomQuestion.question}?`);
    } else {
      console.log("Dang! How did you get this far?!");
    }
  } catch (err) {
    console.log(err);
  }
}
getRandomQuestion();
