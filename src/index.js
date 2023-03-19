import { getPage } from './actions/page';
import { getSearch } from './actions/search';
import { parseRow } from './helpers';

const main = async () => {
  let control = true;
  let page = 2

  const period = { start: "01/2014", end: "12/2014" }
  const search = await getSearch(period);

  while(control) {
    const next = getPage({ period, page: 2, context: search })

    control = false
  }
};

main();
