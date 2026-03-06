import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobs";
import { applyToJob } from "../api/applications";
import ApplyModal from "../components/ApplyModal";
import { getMatchedJobs } from "../api/match";

const Jobs = () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [matchMin, setMatchMin] = useState(0);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [applyingId, setApplyingId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["matchedJobs"],
    queryFn: async () => {
        try {
            const res = await getMatchedJobs(200);
            return res.data;
        } catch {
            const res = await getJobs({});
            return res.data;
        }
    },
});

const jobs = allJobs.filter((job) => {
    const titleMatch = !title || job.title?.toLowerCase().includes(title.toLowerCase());
    const locationMatch = !location || job.location?.toLowerCase().includes(location.toLowerCase());
    const salaryMatch = !salaryMin || (job.salaryRange && parseInt(job.salaryRange) >= parseInt(salaryMin));
    const matchMatch = !matchMin || (job.matchScore && job.matchScore * 100 >= matchMin);
    return titleMatch && locationMatch && salaryMatch && matchMatch;
});

    const handleApply = (job) => {
        setSelectedJob(job);
    }; 

    // Add confirm handlers
    const handleConfirm = async () => {
        if (!selectedJob) return;
        setApplyingId(selectedJob.id);
        try {
            await applyToJob(selectedJob.id);
            setAppliedJobs((prev) => new Set([...prev, selectedJob.id]));
            if (selectedJob.applyUrl) window.open(selectedJob.applyUrl, "_blank");
        } catch (err) {
            console.error(err);
        } finally {
            setApplyingId(null);
            setSelectedJob(null);
        }
    };

    const handleTrackOnly = async () => {
        if (!selectedJob) return;
        setApplyingId(selectedJob.id);
        try {
            await applyToJob(selectedJob.id);
            setAppliedJobs((prev) => new Set([...prev, selectedJob.id]));
        } catch (err) {
            console.error(err);
        } finally {
            setApplyingId(null);
            setSelectedJob(null);
        }
    };

    const formatSalary = (salaryRange) => {
        if (!salaryRange || salaryRange.trim() === "") return "💰 Not displayed";
        return "💰 " + salaryRange.replace(/(\d+)/g, (match) =>
            parseInt(match).toLocaleString()
        );
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)]">

            {/* Left - Filters */}
            <div className="w-72 shrink-0 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-6 h-fit">
                <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Filters</h2>

                <div>
                    <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">Job Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Software Engineer"
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. New York"
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">
                        Minimum Salary
                        {salaryMin && <span className="text-accent ml-2">${parseInt(salaryMin).toLocaleString()}</span>}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={salaryMin || 0}
                        onChange={(e) => setSalaryMin(e.target.value === "0" ? "" : e.target.value)}
                        className="w-full accent-[#BFFF00]"
                    />
                    <div className="flex justify-between text-gray-400 dark:text-gray-600 text-xs mt-1">
                        <span>$0</span>
                        <span>$200k</span>
                    </div>
                </div>

                <div>
                    <label className="text-gray-500 dark:text-gray-400 text-sm mb-1 block">
                        Min Match Score
                        {matchMin > 0 && <span className="text-accent ml-2">{matchMin}%</span>}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={matchMin}
                        onChange={(e) => setMatchMin(parseInt(e.target.value))}
                        className="w-full accent-[#BFFF00]"
                    />
                    <div className="flex justify-between text-gray-400 dark:text-gray-600 text-xs mt-1">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                <button
                    onClick={() => { setTitle(""); setLocation(""); setSalaryMin(""); setMatchMin(0); }}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg py-2 transition"
                >
                    Clear filters
                </button>
            </div>

            {/* Right - Job Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isLoading ? (
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-sm">No jobs found.</div>
                ) : (
                    jobs.map((job) => (
                        <div
                            key={job.id}
                            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 dark:text-white font-semibold text-base truncate">{job.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.company}</p>

                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {job.location && (
                                            <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
                                                📍 {job.location}
                                            </span>
                                        )}
                                        <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
                                            {formatSalary(job.salaryRange)}
                                        </span>
                                        {job.matchScore && (
                                            <span className="text-accent text-xs font-bold flex items-center gap-1">
                                                ⚡ {Math.round(job.matchScore * 100)}% match
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(job)}
                                    disabled={appliedJobs.has(job.id) || applyingId === job.id}
                                    className={`shrink-0 text-sm font-bold px-4 py-2 rounded-lg transition ${
                                        appliedJobs.has(job.id)
                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            : "bg-accent text-black hover:opacity-90"
                                    }`}
                                >
                                    {appliedJobs.has(job.id) ? "Applied" : applyingId === job.id ? "..." : "Apply"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <ApplyModal
                job={selectedJob}
                onConfirm={handleConfirm}
                onTrackOnly={handleTrackOnly}
                onClose={() => setSelectedJob(null)}
            />
        </div>
    );
};

export default Jobs;