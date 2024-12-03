import * as fs from "fs";

export class CaseManager {
  private static cachedData: { [index: string]: any } = {};

  public static getCaseData(id: string): null | any {
    if (this.cachedData[id]) return this.cachedData[id];
    if (
      !id.includes(".") &&
      !id.includes("/") &&
      !id.includes("\\") &&
      fs.existsSync(`case/cases/${id}.json`)
    ) {
      const data = JSON.parse(
        fs.readFileSync(`case/cases/${id}.json`).toString()
      );
      this.cachedData[id] = data;
      return data;
    }
    return null;
  }
  public static getCaseDropFromChances(
    caseid: string,
    random: number
  ): null | {
    item: any;
    wearindex: number;
    price: number;
  } {
    for (const item of this.getCaseData(caseid).items) {
      for (let i = 0; i < item.pf.length; i++) {
        const pf = item.pf[i];
        if (random >= pf.intervalFrom && random <= pf.intervalTo) {
          return {
            item: item,
            wearindex: i,
            price: pf.price,
          };
        }
      }
    }

    return null;
  }
}
