import { useEffect, useState } from "react";
import { ILanguage, IProductivityDataObject } from "../lib/interfaces";
import {
  convertProductivitiesMapToArrayOfObjects,
  flatArrObjsToArr,
  getProductyDataMapDependOn,
  getWantedFields,
} from "../lib/lib";
import DonutChart from "../charts/Donut";
import { ProductivityArrType } from "../lib/types";

export default function DonutChartCard({ data }: { data: Array<IProductivityDataObject> }) {
  const [donutChartData, setDonutChartData] = useState<ProductivityArrType>([]);

  useEffect(() => {
    const wantedField: Array<ILanguage> = getWantedFields(data, ["languages"]);
    const productivityMap = getProductyDataMapDependOn(
      "language",
      "productivityInSeconds",
      flatArrObjsToArr(wantedField, "languages").flat(),
    );


    const productivityArr = convertProductivitiesMapToArrayOfObjects(productivityMap);

    setDonutChartData(productivityArr);
  }, [data]);

  return (
    <div>
      <DonutChart data={donutChartData} />
    </div>
  );
}
