import axios from "./axios";

export const generateCoverLetter = (applicationId) =>
    axios.post(`/api/cover-letter/generate?jobId=${applicationId}`);

export const generateCoverLetterManual = (jobDescription) =>
    axios.post("/api/cover-letter/generate-manual", { jobDescription });