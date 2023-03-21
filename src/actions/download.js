import { Iconv } from "iconv";
import fetch from "node-fetch";
import { writeToFile, readFile } from "../helpers";

var myHeaders = new fetch.Headers();
myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
myHeaders.append("Accept-Language", "en-US,en;q=0.9,pt;q=0.8");
myHeaders.append("Cache-Control", "no-cache");
myHeaders.append("Connection", "keep-alive");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Cookie", "ASP.NET_SessionId=f4ztzdieziaclw5bqlnfm5ru");
myHeaders.append("Origin", "http://informacoesbmp.aneel.gov.br");
myHeaders.append("Pragma", "no-cache");
myHeaders.append("Referer", "http://informacoesbmp.aneel.gov.br/ConsultarBMPAberto.aspx");
myHeaders.append("Upgrade-Insecure-Requests", "1");
myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

export const getDownload = async ({ context, company }) => {
  var urlencoded = new URLSearchParams();
  urlencoded.append(`${company.download}.x`, "0");
  urlencoded.append(`${company.download}.y`, "0");
  urlencoded.append("__EVENTTARGET", "");
  urlencoded.append("__EVENTARGUMENT", "");
  urlencoded.append("__VIEWSTATE", context.viewState);
  urlencoded.append("__EVENTVALIDATION", context.eventValidation);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  const filename = `${company.agent}_${company.date}`
  const path = `dataset/${filename}.html`;
  const file = readFile(path);

  if (file) {
    console.log("DEBUG: ARQUIVO LIDO DO CACHE", path)
    return Promise.resolve();
  }

  const request = await fetch("http://informacoesbmp.aneel.gov.br/ConsultarBMPAberto.aspx", requestOptions)
  .then(response => response.buffer())
  .catch(error => {
    throw Error("erro ao baixar arquivo", error)
  });

  const iconv = new Iconv('ISO-8859-1', 'UTF-8');
  const buffer = iconv.convert(request);

  writeToFile(path, buffer.toString('UTF-8'));
}

