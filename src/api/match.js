import api from "./axios";
import axios from "./axios";
export const getMatchedJobs = (limit = 200) =>
    axios.get(`/api/match/jobs?limit=${limit}`);

export const getResumeUrl = () =>
    api.get("/api/resume/url");

export const uploadResume = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/resume/upload", formData);
};