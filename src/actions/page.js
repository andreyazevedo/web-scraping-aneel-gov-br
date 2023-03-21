import fetch from "node-fetch"
import { JSDOM } from "jsdom"
import PQueue from 'p-queue'
import { parsePage } from "../helpers"
import { getDownload } from "../actions/download"

export const DownloadQueue = new PQueue({ concurrency: 1 });

var myHeaders = new fetch.Headers();
myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
myHeaders.append("Accept-Language", "en-US,en;q=0.9,pt;q=0.8");
myHeaders.append("Cache-Control", "no-cache");
myHeaders.append("Connection", "keep-alive");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Cookie", "ASP.NET_SessionId=xmicfr4gv43isxtdtp4qmxx5");
myHeaders.append("Origin", "http://informacoesbmp.aneel.gov.br");
myHeaders.append("Pragma", "no-cache");
myHeaders.append("Referer", "http://informacoesbmp.aneel.gov.br/ConsultarBMPAberto.aspx");
myHeaders.append("Upgrade-Insecure-Requests", "1");
myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36");

export const getPage = async ({ period, context, page }) => {
  var urlencoded = new URLSearchParams();
  urlencoded.append("ctl00$Conteudo$ckbTodasEmpresas", "on");
  urlencoded.append("ctl00$Conteudo$ramo", "rbRamoTransmissao");
  urlencoded.append("ctl00$Conteudo$txtDataInicioPesquisa", period.start);
  urlencoded.append("ctl00$Conteudo$txtDataFimPesquisa", period.end);
  urlencoded.append("__EVENTTARGET", "ctl00$Conteudo$gvEmpresaAberta");
  urlencoded.append("__EVENTARGUMENT", `Page$${page}`);
  urlencoded.append("__VIEWSTATE", context.viewState);
  urlencoded.append("__EVENTVALIDATION", context.eventValidation);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  const request = await fetch("http://informacoesbmp.aneel.gov.br/ConsultarBMPAberto.aspx", requestOptions)
  .then(response => response.text())
  .catch(error => {
    throw Error("erro no request da página", error)
  });

  const dom = new JSDOM(request);
  const viewState =  dom.window.document.querySelector(".aspNetHidden #__VIEWSTATE").value
  const eventValidation = dom.window.document.querySelector(".aspNetHidden #__EVENTVALIDATION").value

  const lastNav = dom.window.document.querySelector(".GridPager tr td:last-child")
  const hasMorePages = lastNav.innerText === "..."
  const isLastPage = lastNav.innerText === String(page)

  const companyList = parsePage(request)

  await DownloadQueue.addAll(companyList.map(company => () => {
    return getDownload({ context: { viewState, eventValidation }, company })
  }));

  return { viewState, eventValidation, isLastPage };
}
