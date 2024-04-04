


import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ProductivityArrType } from "../lib/types";
import { formatProductivitySeconds } from "../lib/lib";

export default function DonutChart({ data }: { data: ProductivityArrType }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const colors = new Map([
    ["c#", "#1f77b4"],
    ["c++", "#ff7f0e"],
    ["java", "#2ca02c"],
    ["python", "#9467bd"],
    ["js", "#d62728"],
    ["go", "#8c564b"],
    ["php", "#e377c2"],
    ["ruby", "#7f7f7f"],
    ["swift", "#bcbd22"],
    ["kotlin", "#17becf"],
    ["scala", "#1f77b4"],
    ["ts", "#005eff"],
    ["html", "#ff2600"],
    ["css", "#9467bd"],
    ["shell", "#8c564b"],
    ["bash", "#e377c2"],
    ["sql", "#7f7f7f"],
    ["tsx", "#05009c"],
    ["jsx", "#17becf"],
    ["rust", "#ff7f0e"],
  ]);
  const donutTooltipRef = useRef(null);
  const width = screen.width;
  const height = 2000;



  useEffect(() => {
    const pie = d3.pie();
    let arcs = pie(data.map((d) => d.value));
    // arcs = arcs.map((d, i) => ({ ...d, type: data[i].key }));

    const arc = d3.arc<any, any>().innerRadius(80).outerRadius(200);
    const svg = d3.select(svgRef.current);
    svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll()
      .data(arcs)
      .join("path")
      .on("mousemove", function (e: MouseEvent, d) {
        const productivity = formatProductivitySeconds(d.value);
        const index = arcs.indexOf(d)
        d3.select(donutTooltipRef.current)
          .text(
            `language: ${data[index].key},productivity: ${data[index].key}: ${productivity.years} years, ${productivity.months} months, ${productivity.weeks} weeks, ${productivity.days} days, ${productivity.hours} hours, ${productivity.minutes} minutes, ${productivity.seconds} seconds`,
          )
          .attr("class", "tooltip")
          .style("left", `${screen.width - e.x - 250 > 0 ? e.x + 30 : e.x - 250}px`)
          .style("top", `${e.pageY - 100}px`)
          .style("display", "block");
      })

      .attr("d", arc)
      .attr("fill", (_, i) => colors.get(data[i].key) || "#ccc")
      .on("mouseout", function () {
        d3.select(donutTooltipRef.current).style("display", "none");
      });
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>

      <span ref={donutTooltipRef}></span>
    </div>
  );
}
