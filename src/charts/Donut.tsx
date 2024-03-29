import * as d3 from "d3";
import { useEffect, useRef } from "react";

const DonutChart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 1000;
  const height = Math.min(width, 500);

  // const data = [
  //   { value: 10, color: "red" },
  //   { value: 20, color: "green" },
  //   { value: 30, color: "blue" },
  //   { value: 40, color: "yellow" },
  // ];
  const data = [1, 1, 2, 3, 5, 8, 13, 21];
  const colors = ["red", "green", "blue", "yellow", "purple", "orange", "cyan", "magenta"];
  const pie = d3.pie();
  const arcs = pie(data);

  const arc = d3.arc<any, any>().innerRadius(50).outerRadius(100);

  console.log(arc.centroid(arcs[0])[0]);
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => {
        console.log(i);
        return colors[i];
      })
      .on("mouseover", (_, d) => {
        const center = arc.centroid(arcs[d.index]);
        console.log(d);

        svg
          .append("text")
          // @ts-ignore
          .style("transform", `translate(${center[0] + width / 2}px, ${center[1]}px)`)
          .text("helloooooooo")
          .style("font-size", "20px")
          .style("font-weight", "bold")
          .style("fill", colors[d.index]);
      });
  }, []);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default DonutChart;
