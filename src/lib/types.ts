
export type CSVToObjectType = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  productivitySeconds: string;
  path: string;
  commitMsg: string;
};


export type CSVToObjectKeysType = "year" | "month" | "day" | "hour" | "minute" | "second" | "productivitySeconds" | "path" | "commitMsg"
export type ProductivityMapType = Map<string, number>;
export type ProductivityArrType = Array<{ path: string, productivity: number}>
