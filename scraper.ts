import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import {
  gray,
  bgBrightMagenta,
  bold,
  italic,
} from "https://deno.land/std@0.106.0/fmt/colors.ts";
import Ask from "https://deno.land/x/ask@1.0.5/mod.ts";

type QuestionsT = {
  question: string;
};

type DataT = {
  allQuestions: QuestionsT[];
};

// js questions
const baseUrl = "https://github.com/sudheerj/javascript-interview-questions";

// helpers functions
const rando = (arr: QuestionsT[]): number =>
  Math.floor(Math.random() * arr.length);

const formatLog = (log: string): void =>
  console.log(italic(bold(gray(bgBrightMagenta(log)))));

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

    // find questions
    for (let i = 0; i < questions.length; i++) {
      data.allQuestions.push({
        question: questions.eq(i).text(),
      });
    }

    // we're done, exit all processes
    hasLoaded = true;
    await browser.close();
    return { hasLoaded, data };
  } catch (err) {
    console.log(err);
  }
}

// get language type for different questions
async function getLanguageType(): Promise<string> {
  const ask = new Ask();
  const types = await ask.prompt([
    {
      name: "lang",
      type: "input",
      message: "JS/HTML/CSS?",
    },
  ]);
  return types.lang.toLowerCase();
}

// pluck a random question from the list and log it
async function getRandomQuestion() {
  try {
    const questions = await getData();

    if (questions?.hasLoaded) {
      // loop through questions and select one at random
      const { allQuestions } = questions.data;
      const { question } = allQuestions[rando(allQuestions)];

      // log question
      formatLog(question);
    } else {
      console.log("Dang! How did you get this far?!");
    }
  } catch (err) {
    console.log(err);
  }
}

// bring them all together and begin!
async function begin() {
  try {
    const types = await getLanguageType();
    console.log(types);

    if (types === "js" || types === "JS") {
      getRandomQuestion();
    } else {
      console.log("Whoops, haven't set that up yet!");
    }
  } catch (err) {
    console.log(err);
  }
}
begin();
