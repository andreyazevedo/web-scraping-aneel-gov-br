import { getPage } from './actions/page';
import { getSearch } from './actions/search';

const main = async () => {
  let control = true;
  let page = 2

  const period = { start: "01/2014", end: "12/2014" }

  console.log("DEBUG: INICIANDO download da página 1")
  const search = await getSearch(period);
  console.log("DEBUG: FINALIZADO download da página 1")

  while(control) {
    console.log(`DEBUG: INICIANDO download da página ${page}`)
    const next = await getPage({ period, page, context: search })
    console.log(`DEBUG: FINALIZADO download da página ${page}`)

    if(next.isLastPage) {
      control = false
    }
    page = page + 1
  }
};

main();
