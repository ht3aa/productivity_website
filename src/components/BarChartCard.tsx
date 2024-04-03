import { useEffect, useRef, useState } from "react";
import BarChart from "../charts/Bar";
import {
  ProductivityArrType,
} from "../lib/types";
import {
  convertProductivitiesMapToArrayOfObjects,
  flatArrObjsToArr,
  flatArrObjsToArrWithFilter,
  getProductyDataMapDependOn,
  getTop,
  getWantedFields,
  removeDuplicates,
} from "../lib/lib";
import {  IProductivityDataObject, IProductivityMapFilters, ITotalsProductivityDataObjectType } from "../lib/interfaces";

export default function BarChartCard({ data }: { data: Array<IProductivityDataObject> }) {
  const selectYearRef = useRef<HTMLSelectElement>(null);
  const selectMonthRef = useRef<HTMLSelectElement>(null);
  const [xAxisType, setXAxisType]: ["projectPath" | "date", any] = useState("projectPath");
  const [yAxisType, setYAxisType]: [keyof ITotalsProductivityDataObjectType, any] = useState("totalProductivityInSeconds");
  const [years, setYears]: [Array<string>, any] = useState([]);
  const [months, setMonths]: [Array<string>, any] = useState([]);
  const [selectedYear, setSelectedYear]: [string, any] = useState("2024");
  const [selectedMonth, setSelectedMonth]: [string, any] = useState("all");
  const [barChartData, setBarChartDataData] = useState<ProductivityArrType>([]);
  const [top, setTop] = useState(0);


  const getBarChartData = (
    key: keyof IProductivityDataObject,
    filters: IProductivityMapFilters,
  ) => {
    let productivityDataArr: ProductivityArrType = [];

    const productivityDataMap = getProductyDataMapDependOn(key, yAxisType, data, filters);
    productivityDataArr = convertProductivitiesMapToArrayOfObjects(productivityDataMap);

    if (top > 0) {
      productivityDataArr = getTop(top, productivityDataArr);
    }

    return productivityDataArr;
  };

  const updateBarChartData = () => {
    const yearsFilter: IProductivityMapFilters = { types: ["year"], values: [selectedYear] };
    const yearsAndMonthsFilter: IProductivityMapFilters = {
      types: ["year", "month"],
      values: [selectedYear, selectedMonth],
    };

    // @ts-ignore
    if (xAxisType === "date") {
      if (selectedMonth === "all") {
        setBarChartDataData(getBarChartData("month", yearsFilter));
      } else {
        setBarChartDataData(getBarChartData("day", yearsAndMonthsFilter));
      }
    } else {
      if (selectedMonth === "all") {
        setBarChartDataData(getBarChartData("projectPath", yearsFilter));
      } else {
        setBarChartDataData(getBarChartData("projectPath", yearsAndMonthsFilter));
      }
    }
  };

  const updateMonthOptions = () => {
    const yearsFilter: IProductivityMapFilters = { types: ["year"], values: [+selectedYear] };
    const wantedFields = getWantedFields(data, ["year", "month"]);
    const avaiableMonths = flatArrObjsToArrWithFilter(wantedFields, "month", yearsFilter);

    setMonths(removeDuplicates(avaiableMonths));
  };

  const updateYearOptions = () => {
    const wantedFields = getWantedFields(data, ["year", "month"]);
    const valuesArr = flatArrObjsToArr(wantedFields, "year");
    const years = removeDuplicates(valuesArr);
    setYears(years);
  };

  useEffect(() => {
    updateMonthOptions();
  }, [selectedYear]);

  useEffect(() => {
    updateBarChartData();
  }, [selectedYear, selectedMonth, yAxisType, xAxisType, top]);


  useEffect(() => {
    updateBarChartData();
    updateMonthOptions();
    updateYearOptions();
  }, [data]);

  return (
    <div className="w-full relative">
      <BarChart data={barChartData} xAxisText={`${xAxisType} : ${selectedYear}/${selectedMonth}`} yAxisText={yAxisType}/>
      <div className="absolute top-0 right-[50px]">
        <input
          type="text"
          className="w-40 py-2 px-1 bg-gray-900 "
          onChange={(e) => {
            setTop(Number(e.target.value));
            updateBarChartData();
          }}
        />
        <select
          onChange={(e) => {
            setYAxisType(e.target.value);
            updateBarChartData();
          }}
          className="w-40 py-2 px-1 bg-gray-900 "
        >
          <option value="totalProductivityInSeconds">Productivity</option>
          <option value="totalTimeInVim">Time Spent in lvim</option>
          <option value="totalTimeSpentThinkingOrSearching">Time Spent Searching or Thinking</option>
        </select>
        <select
          onChange={(e) => {
            setXAxisType(e.target.value);
            updateBarChartData();
          }}
          className="w-40 py-2 px-1 bg-gray-900 "
        >
          <option value="projectPath">by Project</option>
          <option value="date">by Date</option>
        </select>
        <select
          ref={selectYearRef}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            updateBarChartData();
          }}
          defaultValue="path"
          className="w-40 py-2 px-1 bg-gray-900 "
        >
          {years[0] && years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          ref={selectMonthRef}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            updateBarChartData();
          }}
          className="w-40 py-2 px-1 bg-gray-900"
        >
          <option value="all">All</option>
          {months.sort().map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
