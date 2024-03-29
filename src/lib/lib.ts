import {
  CSVToObjectType,
  ProductivityMapType,
  ProductivityArrType,
  CSVToObjectKeysType,
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

  const obj: CSVToObjectType = {
    year: splittedLine[0],
    month: splittedLine[1],
    day: splittedLine[2],
    hour: splittedLine[3],
    minute: splittedLine[4],
    second: splittedLine[5],
    productivitySeconds: splittedLine[6],
    path: splittedLine[7],
    commitMsg: splittedLine[8],
  };

  return obj;
}

export function serializeCSVsToObjects(lines: Array<string>): Array<CSVToObjectType> {
  const arr: Array<CSVToObjectType> = [];

  for (let i = 0; i < lines.length - 1; i++) {
    arr.push(serializeCSVToObject(lines[i]));
  }

  return arr;
}

export function serializeObjectToCSV(line: CSVToObjectType) {
  return `${line.year},${line.month},${line.day},${line.hour},${line.minute},${line.second},${line.productivitySeconds},${line.path},${line.commitMsg}`;
}

export function serializeObjectsToCSV(arr: Array<CSVToObjectType>) {
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

export function getProductivityDependOn(
  dependOn: CSVToObjectKeysType,
  lines: Array<CSVToObjectType>,
  filter?: CSVToObjectKeysType,
  filterValue?: string

) {
  const productivity: ProductivityMapType = new Map();
  const copyLines = lines;

  for (let i = 0; i < copyLines.length; i++) {
    if (dependOn === "path") {
      copyLines[i][dependOn] = copyLines[i][dependOn].split("/").slice(-2).join("/");
    } else if(filter) {
      if(copyLines[i][filter] !== filterValue) {
        continue;
      }
    }
    productivity.set(
      copyLines[i][dependOn],
      (productivity.get(copyLines[i][dependOn]) ?? 0) + parseInt(copyLines[i].productivitySeconds),
    );
  }

  return productivity;
}

export function convertProductivityMapToArrayOfObjects(productivity: Map<string, number>) {
  const arr: ProductivityArrType = [];

  productivity.forEach((value, key) => {
    arr.push({
      path: key,
      productivity: value,
    });
  });
  return arr;
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

export function getMaxNumbers(arr: ProductivityArrType, maxs: number) {
  // Handle empty or single-element arrays
  if (arr.length <= 1) {
    return arr;
  }

  // Sort the array in descending order (largest to smallest)
  arr.sort((a, b) => b.productivity - a.productivity);

  // Return the first 10 elements (maximum elements)
  return arr.slice(0, maxs);
}
