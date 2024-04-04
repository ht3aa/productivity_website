import { IProductivityDataObject } from "../lib/interfaces";
import { getHoursFromSeconds, getProductyDataMapDependOn, getWantedFields } from "../lib/lib";

export default function TotalsHeaders({ data }: { data: Array<IProductivityDataObject> }) {
  const wantedFields = getWantedFields(data, [
    "totalTimeInVim",
    "totalProductivityInSeconds",
    "totalTimeSpentThinkingOrSearching",
  ]);
  const totalProductivityMap = getProductyDataMapDependOn(
    "total",
    "totalProductivityInSeconds",
    wantedFields,
  );
  const totalTimeInVimMap = getProductyDataMapDependOn("total", "totalTimeInVim", wantedFields);
  const totalTimeSpentSearchingOrThinkingMap = getProductyDataMapDependOn(
    "total",
    "totalTimeSpentThinkingOrSearching",
    wantedFields,
  );

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Totals</h1>
      <h2 className="text-2xl font-bold">
        total productivity: {getHoursFromSeconds(totalProductivityMap.get("total") ?? 0).toFixed(2)}{" "}
        hours
      </h2>
      <h2 className="text-2xl font-bold">
        total time in vim: {getHoursFromSeconds(totalTimeInVimMap.get("total") ?? 0).toFixed(2)}{" "}
        hours
      </h2>
      <h2 className="text-2xl font-bold">
        total time spent thinking or searching:{" "}
        {getHoursFromSeconds(totalTimeSpentSearchingOrThinkingMap.get("total") ?? 0).toFixed(2)}{" "}
        hours
      </h2>
      <h2 className="text-2xl font-bold">
        total Wasted time in vim:{" "}
        {getHoursFromSeconds(
          (totalTimeInVimMap.get("total") ?? 0) -
            (totalProductivityMap.get("total") ?? 0) -
            (totalTimeSpentSearchingOrThinkingMap.get("total") ?? 0),
        ).toFixed(2)}{" "}
        hours
      </h2>
    </div>
  );
}
