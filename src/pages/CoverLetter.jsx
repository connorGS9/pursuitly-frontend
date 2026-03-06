import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applications";
import { generateCoverLetter } from "../api/coverLetter";
import { generateCoverLetterManual } from "../api/coverLetter";

const CoverLetter = () => {
    const [mode, setMode] = useState("application"); // "application" | "manual"
    const [selectedAppId, setSelectedAppId] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const { data: applications = [] } = useQuery({
        queryKey: ["applications"],
        queryFn: () => getApplications().then((res) => res.data),
    });

   const handleGenerate = async () => {
    setError("");
    setCoverLetter("");
    setLoading(true);
    try {
        let res;
        if (mode === "application") {
            const app = applications.find(a => a.id === selectedAppId);
            res = await generateCoverLetter(app.job.id);
        } else {
            res = await generateCoverLetterManual(jobDescription);
        }
        setCoverLetter(res.data);
    } catch (err) {
        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        console.log("Full error:", err);
        if (err.response?.status === 429) {
        } else {
            setError("Failed to generate cover letter. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canGenerate = mode === "application"
        ? !!selectedAppId
        : jobDescription.trim().length > 50;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cover Letter</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Generate a tailored cover letter using your profile and experience.</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setMode("application")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        mode === "application"
                            ? "bg-accent text-black"
                            : "border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                >
                    From Application
                </button>
                <button
                    onClick={() => setMode("manual")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        mode === "manual"
                            ? "bg-accent text-black"
                            : "border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                >
                    Paste Job Description
                </button>
            </div>

            {/* Input Area */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
                {mode === "application" ? (
                    <div>
                        <label className="text-gray-500 dark:text-gray-400 text-sm mb-2 block">Select an application</label>
                        <select
                            value={selectedAppId}
                            onChange={(e) => setSelectedAppId(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                        >
                            <option value="">Choose an application...</option>
                            {applications.map((app) => (
                                <option key={app.id} value={app.id}>
                                    {app.job.title} — {app.job.company}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div>
                        <label className="text-gray-500 dark:text-gray-400 text-sm mb-2 block">Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            rows={8}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent resize-none"
                        />
                        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
                            {jobDescription.trim().length} characters
                            {jobDescription.trim().length < 50 && jobDescription.length > 0 && (
                                <span className="text-red-400 ml-2">— please add more detail</span>
                            )}
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || loading}
                    className="bg-accent text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? "Generating..." : "Generate Cover Letter"}
                </button>
            </div>

            {/* Output */}
            {coverLetter && (
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-white font-semibold">Generated Cover Letter</h3>
                        <button
                            onClick={handleCopy}
                            className="border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 px-4 py-1.5 rounded-lg text-sm transition"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {coverLetter}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverLetter;