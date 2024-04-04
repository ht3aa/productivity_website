import LanguageCard from "./LanguageCard";
import { IProductivityDataObject } from "../lib/interfaces";
import {
  convertProductivitiesMapToArrayOfObjects,
  flatArrObjsToArr,
  getHoursFromSeconds,
  getProductyDataMapDependOn,
  getWantedFields,
  mergeArrOfObjsToArrOfObjsThatHaveSameKey,
} from "../lib/lib";
import { ProductivityArrType } from "../lib/types";
import { LANGUAGES_LOGOS } from "../lib/constants";

export default function LanguageContainer({ data }: { data: Array<IProductivityDataObject> }) {
  const wantedFields: Array<{ language: string; productivityInSeconds: number }> = getWantedFields(
    flatArrObjsToArr(getWantedFields(data, ["languages"]), "languages").flat(),
    ["language", "productivityInSeconds"],
  );
  const productivityMap = getProductyDataMapDependOn(
    "language",
    "productivityInSeconds",
    wantedFields,
  );
  const productivityArr = convertProductivitiesMapToArrayOfObjects(productivityMap);
  const fromatedProductivityArr: ProductivityArrType = productivityArr.map((item) => {
    return {
      key: item.key,
      value: getHoursFromSeconds(item.value),
    };
  });
  const formatedProductivityArrKeys = fromatedProductivityArr.map((item) => item.key);

  const items: Array<{ src: string; key: string; value: number }> =
    mergeArrOfObjsToArrOfObjsThatHaveSameKey(
      fromatedProductivityArr,
      LANGUAGES_LOGOS.filter((item) => formatedProductivityArrKeys.includes(item.key))
    );

  return (
    <div className="grid grid-cols-4 items-center">
      {items.map((item) => (
        <LanguageCard key={item.key} imgSrc={item.src} languageName={item.key} hours={item.value} />
      ))}
    </div>
  );
}
