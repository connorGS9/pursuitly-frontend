import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, updateApplicationStatus, deleteApplication } from "../api/applications";

const statusColors = {
    APPLIED: "#BFFF00",
    RECRUITER_CALL: "#a78bfa",
    PHONE_SCREEN: "#60a5fa",
    OA_GIVEN: "#f59e0b",
    INTERVIEWING: "#3b82f6",
    OFFERED: "#22c55e",
    REJECTED: "#ef4444",
    WITHDRAWN: "#6b7280",
};

const statusOptions = [
    "APPLIED",
    "RECRUITER_CALL",
    "PHONE_SCREEN",
    "OA_GIVEN",
    "INTERVIEWING",
    "OFFERED",
    "REJECTED",
    "WITHDRAWN",
];

const Applications = () => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState(null);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: () => getApplications().then((res) => res.data),
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries(["applications"]),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["applications"]);
            setDeletingId(null);
        },
    });

    if (isLoading) return (
        <div className="text-gray-400 text-sm">Loading applications...</div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applications</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                    <p className="text-gray-500">No applications yet.</p>
                    <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Browse jobs and click Apply to start tracking.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition"
                        >
                            <div className="flex items-center justify-between gap-4">

                                {/* Job info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 dark:text-white font-semibold truncate">{app.job.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{app.job.company}</p>
                                    <div className="flex gap-4 mt-2">
                                        {app.job.location && (
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">📍 {app.job.location}</span>
                                        )}
                                        {app.appliedAt && (
                                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                🗓 {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Status dropdown */}
                                <select
                                    value={app.status}
                                    onChange={(e) => statusMutation.mutate({ id: app.id, status: e.target.value })}
                                    className="bg-gray-100 dark:bg-gray-900 border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none cursor-pointer"
                                    style={{
                                        borderColor: statusColors[app.status],
                                        color: statusColors[app.status],
                                    }}
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s} className="text-white bg-gray-900">
                                            {s.replace(/_/g, " ")}
                                        </option>
                                    ))}
                                </select>

                                {/* Delete button */}
                                {deletingId === app.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteMutation.mutate(app.id)}
                                            className="text-xs text-red-400 border border-red-800 rounded-lg px-3 py-2 hover:bg-red-900/20 transition"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(null)}
                                            className="text-xs text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeletingId(app.id)}
                                        className="text-gray-400 dark:text-gray-600 hover:text-red-400 transition text-lg"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;