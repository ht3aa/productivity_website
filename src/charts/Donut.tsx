import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { ProductivityArrType } from "../lib/types";

export default function DonutChart({ data }: { data: ProductivityArrType }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const donutTooltipRef = useRef(null);
  const width = screen.width;
  const height = Math.min(width, 500);

  useEffect(() => {
    const pie = d3.pie();
    const arcs = pie(data.map((d) => d.productivity));
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3.arc<any, any>().innerRadius(50).outerRadius(100);
    const svg = d3.select(svgRef.current);
    svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll()
      .data(arcs)
      .join("path")
      .on("mousemove", function (e: MouseEvent, d) {
        d3.select(donutTooltipRef.current)
          .text(`language: ${data[d.index].key},productivity: ${data[d.index].productivity}`)
          .attr("class", "tooltip")
          .style("left", `${screen.width - e.x - 250 > 0 ? e.x + 30 : e.x - 250}px`)
          .style("top", `${e.pageY - 100}px`)
          .style("display", "block");
      })

      .attr("d", arc)
      .attr("fill", (_, i) => color(i + ""))
      .on("mouseout", function () {
        // d3.select(this)
        //   .attr("fill", "white")
        //   .attr("width", xScale.bandwidth() - barSpacing);
        // d3.select(tooltipRef.current).style("display", "none");
      });
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>

      <span ref={donutTooltipRef}></span>
    </div>
  );
}
