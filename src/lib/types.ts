export type ProductivityDataObjectType = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  productivitySeconds: string;
  timeSpentInLvim: string;
  projectPath: string;
  commitMsg: string;
  feature: string;
};

export type SomeOfProductivityDataObjectType = {
  year: string | undefined;
  month: string | undefined;
  day: string | undefined;
  hour: string | undefined;
  minute: string | undefined;
  second: string | undefined;
  productivitySeconds: string | undefined;
  projectPath: string | undefined;
  commitMsg: string | undefined;
  feature: string | undefined;
};

export type ProductivityMapType = Map<string, number>;
export type ProductivityArrType = Array<{ key: string; productivity: number }>;
export type ProductivityMapFiltersType = { types: Array<keyof ProductivityDataObjectType>; values: Array<string> };
