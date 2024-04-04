import {
  ILanguage,
  IProductivityDataObject,
  IProductivityMapFilters,
  ITotalsProductivityDataObjectType,
} from "./interfaces.js";
import { ProductivityMapType, ProductivityArrType } from "./types.js";

export function addToSum(sums: Array<number>, paths: Array<string>, row: Array<string>) {
  const index = paths.indexOf(row[7]);
  if (sums[index] === undefined) {
    sums[index] = 0;
  }
  sums[index] += Number(row[6]);
}

export function getMinsHsDsWsMsYs(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);
  return [minutes, hours, days, weeks, months, years];
}

// export function serializeCSVToObject(line: string) {
//   const splittedLine = line.split(",");

//   const obj: ProductivityDataObjectType = {
//     year: splittedLine[0],
//     month: splittedLine[1],
//     day: splittedLine[2],
//     hour: splittedLine[3],
//     minute: splittedLine[4],
//     second: splittedLine[5],
//     productivitySeconds: splittedLine[6],
//     timeSpentInLvim: splittedLine[7],
//     projectPath: splittedLine[8],
//     commitMsg: splittedLine[9],
//     feature: splittedLine[10],
//   };

//   return obj;
// }

// export function serializeCSVsToObjects(lines: Array<string>): Array<ProductivityDataObjectType> {
//   const arr: Array<ProductivityDataObjectType> = [];

//   for (let i = 0; i < lines.length; i++) {
//     arr.push(serializeCSVToObject(lines[i]));
//   }

//   return arr;
// }

// export function serializeObjectToCSV(line: IProductivityDataObject) {
//   return `${line.year},${line.month},${line.day},${line.hour},${line.minute},${line.second},${line.productivitySeconds},${line.projectPath},${line.commitMsg}`;
// }

// export function serializeObjectsToCSV(arr: Array<IProductivityDataObject>) {
//   let csv: Array<string> = [];
//   arr.forEach((line) => {
//     csv.push(serializeObjectToCSV(line));
//   });
//   return csv;
// }
//
export function getHoursFromSeconds(seconds: number) {
  const hours = seconds / (60 * 60);

  return hours;
}

export function mergeArrOfObjsToArrOfObjsThatHaveSameKey(
  originalArr: ProductivityArrType,
  newArr: Array<any>,
) {
  if (originalArr.length !== newArr.length) {
    throw new Error(
      " addNewItemToEveryItemInArrOfObjs: first argument and second argument must be of the same length",
    );
  }

  const temp = [];
  for (let i = 0; i < originalArr.length; i++) {
    for (let j = 0; j < newArr.length; j++) {
      if (originalArr[i].key === newArr[j].key) {
        temp.push({ ...originalArr[i], ...newArr[j] });
      }
    }
  }

  return temp;
}

export function formatProductivitySeconds(seconds: number) {
  const years = Math.floor(seconds / (60 * 60 * 24 * 7 * 4 * 12));
  seconds = seconds % (60 * 60 * 24 * 7 * 4 * 12);
  const months = Math.floor(seconds / (60 * 60 * 24 * 7 * 4));
  seconds = seconds % (60 * 60 * 24 * 7 * 4);
  const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
  seconds = seconds % (60 * 60 * 24 * 7);
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds = seconds % (60 * 60 * 24);
  const hours = Math.floor(seconds / (60 * 60));
  seconds = seconds % (60 * 60);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function getProductyDataMapDependOn(
  key: keyof IProductivityDataObject | keyof ILanguage,
  value: keyof ITotalsProductivityDataObjectType | keyof ILanguage,
  lines: Array<IProductivityDataObject | ILanguage>,
  filters?: IProductivityMapFilters,
): ProductivityMapType {
  const productivityMap: ProductivityMapType = new Map();
  const languagesKey = key as keyof ILanguage;
  const languagesValue = value as keyof ILanguage;
  const productivityKey = key as keyof IProductivityDataObject;
  const productivityValue = value as keyof IProductivityDataObject;
  const languagesLines = lines as Array<ILanguage>;
  const productivityLines = lines as Array<IProductivityDataObject>;

  if (languagesLines[0] && languagesLines[0].language) {
    for (let i = 0; i < languagesLines.length; i++) {
      productivityMap.set(
        languagesLines[i][languagesKey] + "",
        (productivityMap.get(languagesLines[i][languagesKey] + "") ?? 0) +
          +languagesLines[i][languagesValue],
      );
    }
  } else {
    for (let i = 0; i < productivityLines.length; i++) {
      if (
        filters &&
        !filters.types.every((type) => filters.values.includes(productivityLines[i][type] + ""))
      )
        continue;

      productivityMap.set(
        productivityLines[i][productivityKey] + "",
        (productivityMap.get(productivityLines[i][productivityKey] + "") ?? 0) +
          +productivityLines[i][productivityValue],
      );

    }
  }

  return productivityMap;
}

export function convertProductivitiesMapToArrayOfObjects(
  productivitiesMap: Map<string, number>,
): ProductivityArrType {
  return Array.from(productivitiesMap).map(([key, value]) => ({ key: key, value: value }));
}

export function printProductivityMap(productivity: Map<string, number>) {
  productivity.forEach((value, key) => {
    console.log(key, " => ", formatProductivitySeconds(value));
  });
}

export function printTotalProductivityMap(productivityMapArr: Array<Map<string, number>>) {
  const totalProductivity = new Map();
  totalProductivity.set("total", 0);

  productivityMapArr.forEach((productivity) => {
    productivity.forEach((value) => {
      totalProductivity.set("total", (totalProductivity.get("total") ?? 0) + value);
    });
  });

  printProductivityMap(totalProductivity);
}

export function filterLinesFn(lines: Array<string>, index: any, filter: string | Array<string>) {
  if (index === "none") {
    return lines;
  } else if (index === "regex") {
    return lines.filter((line) => {
      if (line.match(filter as string)) {
        return true;
      }
    });
  }

  return lines.filter((line) => line.split(",")[index] === filter);
}

export function sortDataAsc(lines: Array<string>) {
  lines.sort((a, b) => {
    const aArr = a.split(",");
    const bArr = b.split(",");
    const aArrInt = aArr.map((str) => parseInt(str));
    const bArrInt = bArr.map((str) => parseInt(str));

    if (aArrInt[0] < bArrInt[0]) {
      return -1;
    }
    if (aArrInt[0] > bArrInt[0]) {
      return 1;
    }

    if (aArrInt[1] < bArrInt[1]) {
      return -1;
    }
    if (aArrInt[1] > bArrInt[1]) {
      return 1;
    }

    if (aArrInt[2] < bArrInt[2]) {
      return -1;
    }
    if (aArrInt[2] > bArrInt[2]) {
      return 1;
    }

    if (aArrInt[3] < bArrInt[3]) {
      return -1;
    }
    if (aArrInt[3] > bArrInt[3]) {
      return 1;
    }

    if (aArrInt[4] < bArrInt[4]) {
      return -1;
    }
    if (aArrInt[4] > bArrInt[4]) {
      return 1;
    }

    return 0;
  });
}

export async function printLines(lines: Array<string>) {
  lines.forEach((line: string, index: number) => {
    console.log(`Line ${index}: ${line}`);
  });
}

export function getTop(top: number, arr: ProductivityArrType) {
  if (arr.length <= 1) {
    return arr;
  }

  arr.sort((a, b) => b.value - a.value);

  return arr.slice(0, top);
}

export async function getProductivityData(): Promise<Array<IProductivityDataObject>> {
  const res = await fetch("http://localhost:3000/getData");
  const { data } = await res.json();
  return data;
}

export function getWantedFields(
  data: Array<IProductivityDataObject | ILanguage>,
  fields: Array<keyof IProductivityDataObject | keyof ILanguage>,
): any {
  const languagesData = data as Array<ILanguage>;
  const productivityData = data as Array<IProductivityDataObject>;
  const languageFields = fields as Array<keyof ILanguage>;
  const productivityFields = fields as Array<keyof IProductivityDataObject>;

  if (languagesData.length && languagesData[0].language) {
    return languagesData
      .map((line) => {
        const obj: any = {};
        for (let i = 0; i < languageFields.length; i++) {
          obj[languageFields[i]] = line[languageFields[i]];
        }
        return obj;
      })
      .flat();
  } else {
    return productivityData.map((line) => {
      const obj: any = {};
      for (let i = 0; i < productivityFields.length; i++) {
        obj[productivityFields[i]] = line[productivityFields[i]];
      }
      return obj;
    });
  }
}

export function removeDuplicates(arr: Array<string>) {
  const set = new Set(arr);
  return Array.from(set);
}

export function createOptionsForSelect(selectEl: HTMLSelectElement, arr: Array<string>) {
  arr.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.text = item;
    selectEl.appendChild(option);
  });
}

export function removeOptionsFromSelect(selectEl: HTMLSelectElement) {
  Array.from(selectEl.children).forEach((child) => selectEl.removeChild(child));
}

export function flatArrObjsToArr(
  arrOfobj: any,
  key: keyof IProductivityDataObject | keyof ILanguage | keyof ProductivityArrType,
) {
  return arrOfobj.map((obj: any) => obj[key]);
}

export function flatArrObjsToArrWithFilter(
  arrOfobj: any,
  key: keyof IProductivityDataObject | keyof ILanguage | keyof ProductivityArrType,
  filters: IProductivityMapFilters,
): Array<string> {
  return arrOfobj
    .filter((obj: any) => filters.types.every((type) => filters.values.includes(obj[type])))
    .map((obj: any) => obj[key]);
}
