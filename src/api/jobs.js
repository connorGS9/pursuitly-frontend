import api from "./axios";

export const getJobs = (params) =>
    api.get("/api/jobs", { params });

export const triggerAggregate = () =>
    api.post("/api/jobs/aggregate");