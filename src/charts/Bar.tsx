import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  formatProductivitySeconds,
} from "../lib/lib";
import { ProductivityArrType, ProductivityDataObjectType } from "../lib/types";

export default function BarChart({
  data,
  compareBy,
}: {
  data: ProductivityArrType;
  compareBy: keyof ProductivityDataObjectType;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef(null);
  const margin = { top: 50, right: 80, bottom: 20, left: 80 };
  const width = screen.width;
  const height = 600;
  const barSpacing = 15;

  useEffect(() => {

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.productivity) || 0])
      .range([height - margin.bottom, margin.top]);
    // .range([margin.top, height - margin.bottom]);
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.key || ""))
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d.split("/").slice(-1)[0]);
    const yAxis = d3.axisLeft(yScale);
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg.style("margin", `${margin.top}px 0px`);

    svg
      .selectAll()
      .data(data)
      .join("rect")
      .on("mousemove", function (e, d) {
        d3.select(this).attr("fill", "rgb(6 95 70)").style("cursor", "pointer");

        const productivity = formatProductivitySeconds(d.productivity);

        d3.select(tooltipRef.current)
          .text(
            `${d.key}: ${productivity.years} years, ${productivity.months} months, ${productivity.weeks} weeks, ${productivity.days} days, ${productivity.hours} hours, ${productivity.minutes} minutes, ${productivity.seconds} seconds`,
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
      })
      .attr("width", xScale.bandwidth() - barSpacing)
      .attr("fill", "white")
      .attr("x", (d) => xScale(d.key) || 0)
      .attr("y", height - margin.bottom)
      .transition()
      .duration(2000)
      .attr("y", (d) => yScale(d.productivity) || 0)
      .attr("height", (d) => yScale(0) - yScale(d.productivity));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);
  }, [data, compareBy]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
      <span ref={tooltipRef}></span>
    </div>
  );
}
