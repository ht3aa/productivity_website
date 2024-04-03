import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { formatProductivitySeconds } from "../lib/lib";
import { ProductivityArrType } from "../lib/types";

export default function BarChart({
  data,
  xAxisText,
  yAxisText,
}: {
  data: ProductivityArrType;
  xAxisText: string;
  yAxisText: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef(null);
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  const width = screen.width;
  const height = 600;
  const barSpacing = 15;

  useEffect(() => {
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
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
      .on("mousemove", function (e: MouseEvent, d) {
        d3.select(this).attr("fill", "rgb(6 95 70)").style("cursor", "pointer");

        const productivity = formatProductivitySeconds(d.value);

        d3.select(tooltipRef.current)
          .text(
            `${d.key}: ${productivity.years} years, ${productivity.months} months, ${productivity.weeks} weeks, ${productivity.days} days, ${productivity.hours} hours, ${productivity.minutes} minutes, ${productivity.seconds} seconds`,
          )
          .attr("class", "tooltip")
          .style("left", `${screen.width - e.x - 250 > 0 ? e.x + 30 : e.x - 250}px`)
          .style("top", `${e.y - 100}px`)
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
      .attr("y", (d) => yScale(d.value) || 0)
      .attr("height", (d) => yScale(0) - yScale(d.value));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

    const xLabel = svg.append("text").text(xAxisText);
    const xLabelWidth = xLabel.node()?.getBoundingClientRect().width;

    const yLabel = svg.append("text").text(yAxisText);
    const yLabelWidth = yLabel.node()?.getBoundingClientRect().width;

    if (xLabelWidth) {
      xLabel
        .style(
          "transform",
          `translate(${width / 2 - xLabelWidth / 2}px,${height - margin.bottom / 2}px)`,
        )
        .style("fill", "rgb(16 255 70)")
        .style("font-size", "20px")
        .style("font-weight", "bold");
    }

    if (yLabelWidth) {
      yLabel
        .style(
          "transform",
          `translate(${margin.left / 2}px,${height / 2 + yLabelWidth / 2}px) rotate(-90deg)`,
        )
        .style("fill", "rgb(16 255 70)")
        .style("font-size", "20px")
        .style("font-weight", "bold");
    }
  }, [data]);

  return (
    <div >
      <svg ref={svgRef} width={width} height={height}></svg>
      <span ref={tooltipRef}></span>
    </div>
  );
}
