import api from "./axios";

export const login = (email, password) =>
    api.post("/api/auth/login", { email, password });

export const register = (email, fullName, password) =>
    api.post("/api/auth/register", { email, fullName, password });