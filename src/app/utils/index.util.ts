
export function groupByPages(pageSize:number, items: any[]) : { pages: any[][], itemsToShow: number, total: number } {
  const itemsGroupedByPages: any[][] = []
  let page: any[] = []
  let currentPage = 1
  const totalItems = items.length;

  for (let i = 0; i < totalItems; i++) {
    const item: any = items[i];
    if (i < (pageSize) * currentPage) {
      page.push(item)
    }

    if (i >= pageSize * currentPage || i === totalItems -1) {
      itemsGroupedByPages.push(page)
      page = [item]

      if (i !== totalItems -1) {
        currentPage++;
      } else if (i >= pageSize * currentPage)  {
        itemsGroupedByPages.push(page)
      }
    }
  }

  return { pages: itemsGroupedByPages, itemsToShow: totalItems, total: 155 }
}
