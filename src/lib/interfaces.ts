export interface ILanguage {
  language: string;
  productivityInSeconds: number;
}

export interface ITotalsProductivityDataObjectType {
  totalProductivityInSeconds: number;
  totalTimeInVim: number;
  totalTimeSpentThinkingOrSearching: number;
}
export interface IProductivityDataObject extends ITotalsProductivityDataObjectType {
  id: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  projectPath: string;
  commitMsg: string;
  languages: Array<ILanguage>;
}

export interface IProductivityMapFilters {
  types: Array<keyof IProductivityDataObject>;
  values: Array<string| number>;
}


