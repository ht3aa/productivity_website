import { useEffect, useState } from "react";
import BarChartCard from "./components/BarChartCard";
import { IProductivityDataObject } from "./lib/interfaces";
import { getProductivityData } from "./lib/lib";
import DonutChartCard from "./components/DonutChartCard";
import ScatterPlot from "./charts/ScatterPlot";
import LanguageContainer from "./components/LanguageContainer";
import TotalsHeaders from "./components/TotalsHeaders";

const App = () => {
  const [requestedData, setRequestedData] = useState<Array<IProductivityDataObject>>([]);

  const requestForProductivityData = async () => {
    const data: Array<IProductivityDataObject> = await getProductivityData();
    setRequestedData(data);
  };

  useEffect(() => {
    requestForProductivityData();
  }, []);



  return (
    <div>
      <TotalsHeaders data={requestedData} />
      <BarChartCard data={requestedData} />
      <DonutChartCard data={requestedData} />
      <ScatterPlot data={requestedData} />
      <LanguageContainer data={requestedData} />
    </div>
  );
};

export default App;
