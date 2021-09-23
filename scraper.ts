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

// questions
const BASE_URL = {
  js: "https://github.com/sudheerj/javascript-interview-questions",
  css: "https://github.com/Devinterview-io/css-interview-questions",
};

// helpers functions
const rando = (arr: QuestionsT[]): number =>
  Math.floor(Math.random() * arr.length);

const log = (log: string): void =>
  console.log(italic(bold(gray(bgBrightMagenta(log)))));

// fetch questions from github page
async function getData(type: string, targetContainer: string, target: string) {
  let hasLoaded = false;
  const data: QuestionsT[] = [];

  try {
    // get page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(type, { waitUntil: "networkidle2" });
    // scrape data
    const html = await page.content();
    const $ = cheerio.load(html);
    const questions = $(targetContainer).find(target);

    // find questions
    for (let i = 0; i < questions.length; i++) {
      let question = questions.eq(i).text();
      data.push({ question });
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
      message: "JS/CSS?",
    },
  ]);
  return types.lang.toLowerCase();
}

// pluck a random question from the list and log it
async function getRandomQuestion(
  type: string,
  targetContainer: string,
  target: string
): Promise<void> {
  try {
    const questions = await getData(type, targetContainer, target);

    if (questions?.hasLoaded) {
      // loop through questions and select one at random
      const qs = questions.data;
      const { question } = qs[rando(qs)];

      // log question
      log(question);
    } else {
      console.log("Dang! How did you get this far?!");
    }
  } catch (err) {
    console.log(err);
  }
}

// bring them all together and begin!
(async function (): Promise<void> {
  try {
    const types = await getLanguageType();

    if (types === "js") {
      getRandomQuestion(BASE_URL["js"], "tr", "a");
    } else if (types === "css") {
      getRandomQuestion(BASE_URL["css"], "article", "h2");
    } else {
      console.log("Whoops, haven't set that up yet!");
    }
  } catch (err) {
    console.log(err);
  }
})();
