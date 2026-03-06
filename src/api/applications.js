import api from "./axios";

export const getApplications = () =>
    api.get("/api/applications");

export const applyToJob = (jobId) =>
    api.post("/api/applications", null, { params: { jobId } });

export const updateApplicationStatus = (id, status) =>
    api.patch(`/api/applications/${id}/status`, null, { params: { status } });

export const deleteApplication = (id) =>
    api.delete(`/api/applications/${id}`);