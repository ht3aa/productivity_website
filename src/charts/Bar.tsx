import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import {
  convertProductivityMapToArrayOfObjects,
  formatProductivitySeconds,
  getMaxNumbers,
  getProductivityDependOn,
  serializeCSVsToObjects,
} from "../lib/lib";
import { CSVToObjectKeysType, ProductivityArrType } from "../lib/types";

const BarChart = ({ compareBy, max, filter, filterValue }: { compareBy: CSVToObjectKeysType; max?: number, filter?: CSVToObjectKeysType, filterValue?: string }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef(null);
  const [data, setData] = useState<ProductivityArrType>([{ path: "", productivity: 0 }]);
  const margin = { top: 50, right: 80, bottom: 20, left: 80 };
  const width = screen.width;
  const height = 600;
  const barSpacing = 15;

  const getData = async () => {
    const res = await fetch("http://localhost:3000/getData");
    const { data } = await res.json();
    const dataAsObj = serializeCSVsToObjects(data);
    const productivity = getProductivityDependOn(compareBy, dataAsObj, filter, filterValue);
    const productivityArr = convertProductivityMapToArrayOfObjects(productivity);
    if (max) {
      setData(getMaxNumbers(productivityArr, 10));
    } else {
      setData(productivityArr);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(data);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.productivity) || 0])
      .range([height - margin.bottom, margin.top]);
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.path || ""))
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d.split("/").slice(-1)[0]);
    const yAxis = d3.axisLeft(yScale);
    const svg = d3.select(svgRef.current);
    svg.style("margin", `${margin.top}px 0px`);

    svg
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.path) || 0)
      .attr("y", (d) => yScale(d.productivity) || 0)
      .attr("width", xScale.bandwidth() - barSpacing)
      .attr("height", (d) => yScale(0) - yScale(d.productivity))
      .attr("fill", "white")
      .style("position", "relative")
      .on("mousemove", function (e, d) {
        d3.select(this).attr("fill", "rgb(6 95 70)").style("cursor", "pointer");

        const productivity = formatProductivitySeconds(d.productivity);

        d3.select(tooltipRef.current)
          .text(
            `${d.path}: ${productivity.years} years, ${productivity.months} months, ${productivity.weeks} weeks, ${productivity.days} days, ${productivity.hours} hours, ${productivity.minutes} minutes, ${productivity.seconds} seconds`,
          )
          .attr("class", "tooltip")
          .style("left", `${screen.width - e.pageX - 250 > 0 ? e.pageX + 10 : e.pageX - 250}px`)
          .style("top", `${e.pageY + 10}px`)
          .style("display", "block");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", "white")
          .attr("width", xScale.bandwidth() - barSpacing);

        d3.select(tooltipRef.current).style("display", "none");
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
      <span ref={tooltipRef}></span>
    </div>
  );
};

export default BarChart;
