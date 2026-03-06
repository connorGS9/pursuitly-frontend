import api from "./axios";

export const getProfile = () =>
    api.get("/api/profile");

export const updateProfile = (data) =>
    api.post("/api/profile", data);

export const getSkills = () =>
    api.get("/api/profile/skills");

export const bulkUpdateSkills = (skills) =>
    api.post("/api/profile/skills/bulk", skills);

export const getExperience = () =>
    api.get("/api/profile/experience");

export const bulkUpdateExperience = (experiences) =>
    api.post("/api/profile/experience/bulk", experiences);

export const deleteSkill = (skillId) =>
    api.delete(`/api/profile/skills/${skillId}`);

export const deleteExperience = (experienceId) =>
    api.delete(`/api/profile/experience/${experienceId}`);