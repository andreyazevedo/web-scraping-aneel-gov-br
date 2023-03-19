import fs from 'fs';
import { JSDOM } from "jsdom"

const months = {
  "janeiro": "01",
  "fevereiro": "02",
  "março": "03",
  "abril": "04",
  "maio": "05",
  "junho": "06",
  "julho": "07",
  "agosto": "08",
  "setembro": "09",
  "outubro": "10",
  "novembro": "11",
  "dezembro": "12"
};

export const readFile = path => {
  try {
    const file = fs.readFileSync(path, 'utf8');

    return JSON.parse(file);
  } catch (error) {
    return;
  }
};

export const writeToFile = (name, data) => fs.writeFileSync(name, data, { encoding: "utf-8" });

export const parsePage = html => {
  const dom = new JSDOM(html);
  const nav = dom.window.document.querySelector(".GridPager")
  
  nav.remove()
  
  const domResult = dom.window.document.querySelectorAll(".tabelaDados tbody > tr:not(.tabelaCabecalho)")
  const items = [...domResult].map(n => {
    const month = n.querySelector("td:nth-child(4) span").textContent;
    const year = n.querySelector("td:nth-child(5) span").textContent;

    return {
      name: n.querySelector(".tdNomeEmpresa > span").textContent,
      last_update: n.querySelector("td:nth-child(3) span").textContent,
      date: `${months[month.toLocaleLowerCase()]}_${year}`,
      agent: n.querySelector("td input:nth-child(3)").value,
      download: n.querySelector("td:last-child input").name
    }
  });

  return items
};
