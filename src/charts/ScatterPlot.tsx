import * as d3 from "d3";
import { IProductivityDataObject } from "../lib/interfaces";
import {
  convertProductivitiesMapToArrayOfObjects,
  getProductyDataMapDependOn,
  getWantedFields,
} from "../lib/lib";
import { useEffect, useRef } from "react";

export default function ScatterPlot({ data }: { data: Array<IProductivityDataObject> }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  const width = screen.width;
  const height = 600;
  const wantedFields = getWantedFields(data, ["totalProductivityInSeconds", "hour"]);
  const productivityMap = getProductyDataMapDependOn(
    "hour",
    "totalProductivityInSeconds",
    wantedFields,
  );

  const productivityArr = convertProductivitiesMapToArrayOfObjects(productivityMap).sort(
    (a, b) => +a.key - +b.key,
  );


  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(productivityArr, (d) => d.value) || 0])
    .range([height - margin.bottom, margin.top]);
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(productivityArr, (d) => +d.key) || 0])
    .range([margin.left, width - margin.right]);

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale);
  const line = d3
    .line<{ key: string; value: number }>()
    .x((d) => xScale(+d.key) ?? 0)
    .y((d) => yScale(d.value));

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

    svg
      .append("g")
      .selectAll("dot")
      .data(productivityArr)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(+d.key) ?? 0;
      })
      .attr("cy", function (d) {
        return yScale(d.value);
      })
      .attr("r", 10)
      .style("fill", "#69b3a2");

    svg
      .append("path")
      .attr("d", line(productivityArr))
      .attr("stroke", "#69b3a2")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  });

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
