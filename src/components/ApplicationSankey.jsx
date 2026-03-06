import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const statusColors = {
    APPLIED: "#BFFF00",
    RECRUITER_CALL: "#a78bfa",
    PHONE_SCREEN: "#60a5fa",
    OA_GIVEN: "#f59e0b",
    INTERVIEWING: "#3b82f6",
    OFFERED: "#22c55e",
    REJECTED: "#ef4444",
};

const ApplicationSankey = ({ applications }) => {
    const ref = useRef();

    useEffect(() => {
        if (!applications || applications.length === 0) return;

        const countByStatus = (status) =>
            applications.filter((a) => a.status === status).length;

        const counts = {
            APPLIED: applications.length,
            RECRUITER_CALL: countByStatus("RECRUITER_CALL"),
            PHONE_SCREEN: countByStatus("PHONE_SCREEN"),
            OA_GIVEN: countByStatus("OA_GIVEN"),
            INTERVIEWING: countByStatus("INTERVIEWING"),
            OFFERED: countByStatus("OFFERED"),
            REJECTED: countByStatus("REJECTED"),
        };

        const nodeList = [
            { name: "APPLIED" },
            { name: "RECRUITER_CALL" },
            { name: "PHONE_SCREEN" },
            { name: "OA_GIVEN" },
            { name: "INTERVIEWING" },
            { name: "OFFERED" },
            { name: "REJECTED" },
        ];

        const idx = (name) => nodeList.findIndex((n) => n.name === name);
    
        const links = [
            { source: idx("APPLIED"), target: idx("RECRUITER_CALL"), value: Math.max(counts.RECRUITER_CALL, 0.5) },
            { source: idx("APPLIED"), target: idx("PHONE_SCREEN"), value: Math.max(counts.PHONE_SCREEN, 0.5) },
            { source: idx("APPLIED"), target: idx("OA_GIVEN"), value: Math.max(counts.OA_GIVEN, 0.5) },
            { source: idx("RECRUITER_CALL"), target: idx("INTERVIEWING"), value: Math.max(counts.RECRUITER_CALL - 0.1, 0.4) },
            { source: idx("PHONE_SCREEN"), target: idx("INTERVIEWING"), value: Math.max(counts.PHONE_SCREEN - 0.1, 0.4) },
            { source: idx("OA_GIVEN"), target: idx("INTERVIEWING"), value: Math.max(counts.OA_GIVEN - 0.1, 0.4) },
            { source: idx("INTERVIEWING"), target: idx("OFFERED"), value: Math.max(counts.OFFERED, 0.5) },
            { source: idx("INTERVIEWING"), target: idx("REJECTED"), value: Math.max(counts.REJECTED, 0.5) },
            { source: idx("APPLIED"), target: idx("REJECTED"), value: Math.max(counts.REJECTED * 0.3, 0.3) },
        ];

        const width = ref.current.clientWidth;
        const height = 400;

        d3.select(ref.current).selectAll("*").remove();

        const svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const sankeyGen = sankey()
            .nodeWidth(20)
            .nodePadding(30)
            .extent([[20, 20], [width - 20, height - 20]]);

        const { nodes, links: sankeyLinks } = sankeyGen({
            nodes: nodeList.map((d) => ({ ...d })),
            links: links.map((d) => ({ ...d })),
        });

        // Draw links
svg.append("g")
    .selectAll("path")
    .data(sankeyLinks)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", (d) => statusColors[d.target.name] + "66")
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .attr("fill", "none")
    .attr("opacity", 0.7)
    .on("mouseover", function () {
        d3.select(this).attr("opacity", 1);
    })
    .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.7);
    });

// Draw nodes
svg.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => Math.max(1, d.y1 - d.y0))
    .attr("fill", (d) => statusColors[d.name])
    .attr("rx", 4);

// Draw labels
svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 10 : d.x0 - 10))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .attr("fill", (d) => statusColors[d.name])
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .text((d) => `${d.name.replace("_", " ")} ${counts[d.name]}`);

    }, [applications]);

    return <div ref={ref} style={{ width: "100%", height: 400 }} />;
};

export default ApplicationSankey;