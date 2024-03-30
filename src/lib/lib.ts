import {
  ProductivityMapType,
  ProductivityArrType,
  ProductivityDataObjectType,
  ProductivityMapFiltersType,
} from "./types.js";

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

export function serializeCSVToObject(line: string) {
  const splittedLine = line.split(",");

  const obj: ProductivityDataObjectType = {
    year: splittedLine[0],
    month: splittedLine[1],
    day: splittedLine[2],
    hour: splittedLine[3],
    minute: splittedLine[4],
    second: splittedLine[5],
    productivitySeconds: splittedLine[6],
    timeSpentInLvim: splittedLine[7],
    projectPath: splittedLine[8],
    commitMsg: splittedLine[9],
    feature: splittedLine[10],
  };

  return obj;
}

export function serializeCSVsToObjects(lines: Array<string>): Array<ProductivityDataObjectType> {
  const arr: Array<ProductivityDataObjectType> = [];

  for (let i = 0; i < lines.length; i++) {
    arr.push(serializeCSVToObject(lines[i]));
  }

  return arr;
}

export function serializeObjectToCSV(line: ProductivityDataObjectType) {
  return `${line.year},${line.month},${line.day},${line.hour},${line.minute},${line.second},${line.productivitySeconds},${line.projectPath},${line.commitMsg}`;
}

export function serializeObjectsToCSV(arr: Array<ProductivityDataObjectType>) {
  let csv: Array<string> = [];
  arr.forEach((line) => {
    csv.push(serializeObjectToCSV(line));
  });
  return csv;
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
  key: keyof ProductivityDataObjectType,
  value: keyof ProductivityDataObjectType,
  lines: Array<ProductivityDataObjectType>,
  filters?: ProductivityMapFiltersType,
): ProductivityMapType {
  const productivityMap: ProductivityMapType = new Map();

  for (let i = 0; i < lines.length; i++) {
    if (filters && !filters.types.every((type) => filters.values.includes(lines[i][type])))
      continue;
    productivityMap.set(
      lines[i][key],
      (productivityMap.get(lines[i][key]) ?? 0) + parseInt(lines[i][value]),
    );
  }

  return productivityMap;
}

export function convertProductivitiesMapToArrayOfObjects(
  productivitiesMap: Map<string, number>,
): ProductivityArrType {
  return Array.from(productivitiesMap).map(([key, value]) => ({ key: key, productivity: value }));
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

  arr.sort((a, b) => b.productivity - a.productivity);

  return arr.slice(0, top);
}

export async function getProductivityData(): Promise<Array<ProductivityDataObjectType>> {
  const res = await fetch("http://localhost:3000/getData");
  const { data } = await res.json();
  return serializeCSVsToObjects(data);
}

export function getWantedFields(
  data: Array<ProductivityDataObjectType>,
  fields: Array<keyof ProductivityDataObjectType>,
) {
  return data.map((line) => {
    return fields.reduce((acc: any, field: keyof ProductivityDataObjectType) => {
      acc[field] = line[field];
      return acc;
    }, {});
  });
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
  key: keyof ProductivityDataObjectType,
): Array<string> {
  return arrOfobj.map((obj: any) =>  obj[key]);
}

export function flatArrObjsToArrWithFilter(
  arrOfobj: any,
  key: keyof ProductivityDataObjectType,
  filters: ProductivityMapFiltersType,
): Array<string> {
  return arrOfobj.filter((obj: any) =>  filters.types.every((type) => filters.values.includes(obj[type]))).map((obj: any) =>  obj[key]);
}
