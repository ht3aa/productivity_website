import { useEffect, useRef, useState } from "react";
import BarChart from "../charts/Bar";
import {
  ProductivityArrType,
  ProductivityDataObjectType,
  ProductivityMapFiltersType,
} from "../lib/types";
import {
  convertProductivitiesMapToArrayOfObjects,
  flatArrObjsToArr,
  flatArrObjsToArrWithFilter,
  getProductivitiesMapDependOn,
  getProductivityData,
  getTop,
  getWantedFields,
  removeDuplicates,
} from "../lib/lib";

export default function BarChartCard() {
  const selectYearRef = useRef<HTMLSelectElement>(null);
  const selectMonthRef = useRef<HTMLSelectElement>(null);
  const [compareBy, setCompareBy]: ["projectPath" | "date", any] = useState("projectPath");
  const [years, setYears]: [Array<string>, any] = useState([]);
  const [months, setMonths]: [Array<string>, any] = useState([]);
  const [selectedYear, setSelectedYear]: [string, any] = useState("2024");
  const [selectedMonth, setSelectedMonth]: [string, any] = useState("all");
  const [requestedData, setRequestedData] = useState<Array<ProductivityDataObjectType>>([]);
  const [barChartData, setBarChartDataData] = useState<ProductivityArrType>([]);
  const [top, setTop] = useState(0);

  const requestForProductivityData = async () => {
    const data = await getProductivityData();
    setRequestedData(data);
  };

  const getBarChartData = (
    key: keyof ProductivityDataObjectType,
    filters: ProductivityMapFiltersType,
  ) => {
    let productivitiesArr: ProductivityArrType = [];
    const productivityMap = getProductivitiesMapDependOn(key, requestedData, filters);
    productivitiesArr = convertProductivitiesMapToArrayOfObjects(productivityMap);

    if (top > 0) {
      productivitiesArr = getTop(top, productivitiesArr);
    }

    return productivitiesArr;
  };

  const updateBarChartData = () => {
    const yearsFilter: ProductivityMapFiltersType = { types: ["year"], values: [selectedYear] };
    const yearsAndMonthsFilter: ProductivityMapFiltersType = {
      types: ["year", "month"],
      values: [selectedYear, selectedMonth],
    };

    // @ts-ignore
    if (compareBy === "date") {
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
    const yearsFilter: ProductivityMapFiltersType = { types: ["year"], values: [selectedYear] };
    const wantedFields = getWantedFields(requestedData, ["year", "month"]);
    const avaiableMonths = flatArrObjsToArrWithFilter(wantedFields, "month", yearsFilter);

    setMonths(removeDuplicates(avaiableMonths));
  };

  const updateYearOptions = () => {
    const wantedFields = getWantedFields(requestedData, ["year", "month"]);
    const valuesArr = flatArrObjsToArr(wantedFields, "year");
    const years = removeDuplicates(valuesArr);
    setYears(years);
  };

  useEffect(() => {
    updateMonthOptions();
  }, [selectedYear]);

  useEffect(() => {
    updateBarChartData();
  }, [selectedYear, selectedMonth, compareBy, top]);

  useEffect(() => {
    requestForProductivityData();
  }, []);

  useEffect(() => {
    updateBarChartData();
    updateMonthOptions();
    updateYearOptions();
  }, [requestedData]);

  return (
    <div className="w-full relative">
      <BarChart data={barChartData} compareBy={"year"} />
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
            setCompareBy(e.target.value);
            updateBarChartData();
          }}
          className="w-40 py-2 px-1 bg-gray-900 "
        >
          <option value="projectPath">Project Path</option>
          <option value="date">Date</option>
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
          {years.map((year) => (
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
