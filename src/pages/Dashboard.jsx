import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { ReactFlow, Background, Controls } from "@xyflow/react";
//import "@xyflow/react/dist/style.css";
import ApplicationSankey from "../components/ApplicationSankey";
import { getApplications } from "../api/applications";
import { getMatchedJobs } from "../api/match";

const statusColors = {
    APPLIED: "#BFFF00",
    RECRUITER_CALL: "#a78bfa",
    PHONE_SCREEN: "#c45cbe",
    OA_GIVEN: "#f59e0b",
    INTERVIEWING: "#3b82f6",
    OFFERED: "#22c55e",
    REJECTED: "#ef4444",
};

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appsRes = await getApplications();
                console.log(appsRes.data);
                    setApplications(appsRes.data);
            } catch (err) {
                console.error("Failed to load applications", err);
            }

             try {
                const matchRes = await getMatchedJobs(5);
                setMatchedJobs(matchRes.data);
            } catch (err) {
            console.error("Failed to load matches", err);
            }
             setLoading(false);
        };
        fetchData();
    }, []);

    const countByStatus = (status) =>
        applications.filter((a) => a.status === status).length;

    const total = applications.length;

    const nodes = [
    {
        id: "applied", sourcePosition: "right", targetPosition: "left",
        position: { x: 0, y: 200 },
        data: { label: `Applied\n${countByStatus("APPLIED")}` },
        style: { background: "#111", border: `2px solid ${statusColors.APPLIED}`, color: statusColors.APPLIED, borderRadius: 12, padding: "12px 20px", fontWeight: "bold", fontSize: 14, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "recruiter", sourcePosition: "right", targetPosition: "left",
        position: { x: 260, y: 50 },
        data: { label: `Recruiter Call\n${countByStatus("RECRUITER_CALL")}` },
        style: { background: "#111", border: `2px solid ${statusColors.RECRUITER_CALL}`, color: statusColors.RECRUITER_CALL, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "phone", sourcePosition: "right", targetPosition: "left",
        position: { x: 260, y: 200 },
        data: { label: `Phone Screen\n${countByStatus("PHONE_SCREEN")}` },
        style: { background: "#111", border: `2px solid ${statusColors.PHONE_SCREEN}`, color: statusColors.PHONE_SCREEN, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "oa", sourcePosition: "right", targetPosition: "left",
        position: { x: 260, y: 350 },
        data: { label: `OA Given\n${countByStatus("OA_GIVEN")}` },
        style: { background: "#111", border: `2px solid ${statusColors.OA_GIVEN}`, color: statusColors.OA_GIVEN, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "interviewing", sourcePosition: "right", targetPosition: "left",
        position: { x: 520, y: 200 },
        data: { label: `Interviewing\n${countByStatus("INTERVIEWING")}` },
        style: { background: "#111", border: `2px solid ${statusColors.INTERVIEWING}`, color: statusColors.INTERVIEWING, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "offered", sourcePosition: "right", targetPosition: "left",
        position: { x: 780, y: 100 },
        data: { label: `Offered\n${countByStatus("OFFERED")}` },
        style: { background: "#111", border: `2px solid ${statusColors.OFFERED}`, color: statusColors.OFFERED, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
        id: "rejected", sourcePosition: "right", targetPosition: "left",
        position: { x: 780, y: 350 },
        data: { label: `Rejected\n${countByStatus("REJECTED")}` },
        style: { background: "#111", border: `2px solid ${statusColors.REJECTED}`, color: statusColors.REJECTED, borderRadius: 12, padding: "10px 16px", fontWeight: "bold", fontSize: 13, textAlign: "center", whiteSpace: "pre-line" }
    },
    {
    id: "rejection-junction",
    position: { x: 520, y: 430 },
    data: { label: "" },
    style: {
        background: "transparent",
        border: "none",
        width: 1,
        height: 1,
        minWidth: 1,
        minHeight: 1,
        padding: 0,
    },
    sourcePosition: "right",
    targetPosition: "left",
    selectable: false,
},
];

const edges = [
    // Applied outgoing - all neon
    { id: "e1", source: "applied", target: "recruiter", animated: true, style: { stroke: statusColors.APPLIED } },
    { id: "e2", source: "applied", target: "phone", animated: true, style: { stroke: statusColors.APPLIED } },
    { id: "e3", source: "applied", target: "oa", animated: true, style: { stroke: statusColors.APPLIED } },

    // Each node's color to interviewing
    { id: "e4", source: "recruiter", target: "interviewing", animated: true, style: { stroke: statusColors.RECRUITER_CALL } },
    { id: "e5", source: "phone", target: "interviewing", animated: true, style: { stroke: statusColors.PHONE_SCREEN } },
    { id: "e6", source: "oa", target: "interviewing", animated: true, style: { stroke: statusColors.OA_GIVEN } },

    // Interviewing outgoing
    { id: "e7", source: "interviewing", target: "offered", animated: true, style: { stroke: statusColors.OFFERED } },
    { id: "e8", source: "interviewing", target: "rejected", animated: true, style: { stroke: statusColors.REJECTED } },

    // Subtle rejection paths from every stage
    { id: "r1", source: "applied", target: "rejection-junction", style: { stroke: "#ef444455", strokeDasharray: "4 4", strokeWidth: 1 } },
    { id: "r2", source: "recruiter", target: "rejection-junction", style: { stroke: "#ef444455", strokeDasharray: "4 4", strokeWidth: 1 } },
    { id: "r3", source: "phone", target: "rejection-junction", style: { stroke: "#ef444455", strokeDasharray: "4 4", strokeWidth: 1 } },
    { id: "r4", source: "oa", target: "rejection-junction", style: { stroke: "#ef444455", strokeDasharray: "4 4", strokeWidth: 1 } },

    // One clean line from junction to rejected
    { id: "r5", source: "rejection-junction", target: "rejected", style: { stroke: "#ef444455", strokeDasharray: "4 4", strokeWidth: 1 } },
];

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            Loading dashboard...
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Your job search at a glance</p>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <h2 className="text-gray-900 dark:text-white font-semibold mb-4">Application Pipeline</h2>
                {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No applications yet — start applying to see your pipeline.</p>
                ) : (
                    <ApplicationSankey applications={applications} />
                )}
            </div>

            {/* Bottom two panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Recent Applications */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 dark:text-white font-semibold">Recent Applications</h2>
                        <Link to="/applications" className="text-accent text-sm hover:underline">
                            View all
                        </Link>
                    </div>
                    {applications.length === 0 ? (
                        <p className="text-gray-500 text-sm">No applications yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {applications.slice(0, 5).map((app) => (
                                <div key={app.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-900 dark:text-white text-sm font-medium">{app.job.title}</p>
                                        <p className="text-gray-500 text-xs">{app.job.company}</p>
                                    </div>
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                        style={{
                                            color: statusColors[app.status],
                                            border: `1px solid ${statusColors[app.status]}`,
                                            background: `${statusColors[app.status]}15`
                                        }}
                                    >
                                        {app.status.replace("_", " ")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Matched Jobs */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 dark:text-white font-semibold">Top Matches</h2>
                        <Link to="/jobs" className="text-accent text-sm hover:underline">
                            View all
                        </Link>
                    </div>
                    {matchedJobs.length === 0 ? (
                        <p className="text-gray-500 text-sm">Update your profile to see matches.</p>
                    ) : (
                        <div className="space-y-3">
                            {matchedJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-900 dark:text-white text-sm font-medium">{job.title}</p>
                                        <p className="text-gray-500 text-xs">{job.company}</p>
                                    </div>
                                    <span className="text-accent text-xs font-bold">
                                        {Math.round(job.matchScore * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;