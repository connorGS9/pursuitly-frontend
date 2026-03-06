import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProfile, updateProfile,
    getSkills, bulkUpdateSkills,
    getExperience, bulkUpdateExperience
} from "../api/profile";
import { useAuth } from "../context/AuthContext";

const categoryColors = {
    FRONTEND: "#60a5fa",
    BACKEND: "#a78bfa",
    ML: "#f59e0b",
    DEVOPS: "#ef4444",
    DATABASE: "#22c55e",
    OTHER: "#6b7280",
};

const experienceLevels = ["JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"];
const remoteOptions = ["REMOTE", "HYBRID", "ONSITE"];
const skillCategories = ["FRONTEND", "BACKEND", "ML", "DEVOPS", "DATABASE", "OTHER"];
const proficiencies = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const Profile = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    // Decode name from JWT for avatar
    const getName = () => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.name || payload.sub?.split("@")[0] || "U";
        } catch { return "U"; }
    };

    const initials = getName().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    const [editMode, setEditMode] = useState(false);

    // Profile state
    const [profileForm, setProfileForm] = useState({
        desiredTitle: "", experienceLevel: "", location: "",
        remotePreference: "", salaryMin: "", summary: ""
    });

    // Skills state
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [skillCategory, setSkillCategory] = useState("OTHER");
    const [skillProficiency, setSkillProficiency] = useState("INTERMEDIATE");
    const [skillYears, setSkillYears] = useState("");

    // Experience state
    const [experiences, setExperiences] = useState([]);

    // Fetch data
    const { data: profileData } = useQuery({
        queryKey: ["profile"],
        queryFn: () => getProfile().then((res) => res.data),
    });

    const { data: skillsData } = useQuery({
        queryKey: ["skills"],
        queryFn: () => getSkills().then((res) => res.data),
    });

    const { data: experienceData } = useQuery({
        queryKey: ["experience"],
        queryFn: () => getExperience().then((res) => res.data),
    });
    console.log(experienceData);
    // Populate form when data loads
    useEffect(() => {
        if (profileData) {
            setProfileForm({
                desiredTitle: profileData.desiredTitle || "",
                experienceLevel: profileData.experienceLevel || "",
                location: profileData.location || "",
                remotePreference: profileData.remotePreference || "",
                salaryMin: profileData.salaryMin || "",
                summary: profileData.summary || "",
            });
        }
    }, [profileData]);

    useEffect(() => {
        if (skillsData) setSkills(skillsData);
    }, [skillsData]);

    useEffect(() => {
        if (experienceData) setExperiences(experienceData);
    }, [experienceData]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            await bulkUpdateSkills(skills.map((s) => ({
                skillName: s.skillName,
                category: s.category,
                proficiency: s.proficiency,
                yearsExperience: s.yearsExperience,
            })));
            await bulkUpdateExperience(experiences.map((e) => ({
                company: e.company,
                title: e.title,
                startDate: e.startDate,
                endDate: e.endDate,
                current: e.current,
                bullets: e.bullets,
            })));
            await updateProfile(profileForm);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
            queryClient.invalidateQueries(["skills"]);
            queryClient.invalidateQueries(["experience"]);
            setEditMode(false);
        },
    });

    // Skill handlers
    const addSkill = () => {
        if (!skillInput.trim()) return;
        setSkills([...skills, {
            skillName: skillInput.trim(),
            category: skillCategory,
            proficiency: skillProficiency,
            yearsExperience: parseFloat(skillYears) || 0,
        }]);
        setSkillInput("");
        setSkillYears("");
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    // Experience handlers
    const addExperience = () => {
        setExperiences([...experiences, {
            company: "", title: "", startDate: "", endDate: "",
            current: false, bullets: [""],
        }]);
    };

    const updateExperience = (index, field, value) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        setExperiences(updated);
    };

    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const addBullet = (expIndex) => {
        const updated = [...experiences];
        updated[expIndex].bullets = [...(updated[expIndex].bullets || []), ""];
        setExperiences(updated);
    };

    const updateBullet = (expIndex, bulletIndex, value) => {
        const updated = [...experiences];
        updated[expIndex].bullets[bulletIndex] = value;
        setExperiences(updated);
    };

    const removeBullet = (expIndex, bulletIndex) => {
        const updated = [...experiences];
        updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
        setExperiences(updated);
    };

    const handleBulletKeyDown = (e, expIndex, bulletIndex) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addBullet(expIndex);
        }
        if (e.key === "Backspace" && experiences[expIndex].bullets[bulletIndex] === "" && experiences[expIndex].bullets.length > 1) {
            removeBullet(expIndex, bulletIndex);
        }
    };

    const cancelEdit = () => {
        if (profileData) setProfileForm({
            desiredTitle: profileData.desiredTitle || "",
            experienceLevel: profileData.experienceLevel || "",
            location: profileData.location || "",
            remotePreference: profileData.remotePreference || "",
            salaryMin: profileData.salaryMin || "",
            summary: profileData.summary || "",
        });
        if (skillsData) setSkills(skillsData);
        if (experienceData) setExperiences(experienceData);
        setEditMode(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className={`border rounded-xl p-6 transition ${editMode ? "border-accent/50" : "border-gray-200 dark:border-gray-800"}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-black font-bold text-xl">
                            {initials}
                        </div>
                        <div>
                            {editMode ? (
                                <input
                                    value={profileForm.desiredTitle}
                                    onChange={(e) => setProfileForm({ ...profileForm, desiredTitle: e.target.value })}
                                    placeholder="Desired Job Title"
                                    className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-lg font-semibold focus:outline-none focus:border-accent w-72"
                                />
                            ) : (
                                <h2 className="text-gray-900 dark:text-white text-xl font-bold">
                                    {profileForm.desiredTitle || "Add your desired title"}
                                </h2>
                            )}
                            {editMode ? (
                                <input
                                    value={profileForm.location}
                                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                    placeholder="Location"
                                    className="mt-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400 text-sm focus:outline-none focus:border-accent w-72"
                                />
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                    📍 {profileForm.location || "Add your location"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {editMode ? (
                            <>
                                <button
                                    onClick={cancelEdit}
                                    className="border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-400 dark:hover:border-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveMutation.mutate()}
                                    disabled={saveMutation.isPending}
                                    className="bg-accent text-black font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {saveMutation.isPending ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm hover:border-accent hover:text-accent transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className={`border rounded-xl p-6 transition ${editMode ? "border-accent/50" : "border-gray-200 dark:border-gray-800"}`}>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-500 dark:text-gray-400 text-xs mb-1 block">Experience Level</label>
                        {editMode ? (
                            <select
                                value={profileForm.experienceLevel}
                                onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                            >
                                <option value="">Select level</option>
                                {experienceLevels.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-gray-900 dark:text-white text-sm">{profileForm.experienceLevel || "—"}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-500 dark:text-gray-400 text-xs mb-1 block">Remote Preference</label>
                        {editMode ? (
                            <select
                                value={profileForm.remotePreference}
                                onChange={(e) => setProfileForm({ ...profileForm, remotePreference: e.target.value })}
                                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                            >
                                <option value="">Select preference</option>
                                {remoteOptions.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-gray-900 dark:text-white text-sm">{profileForm.remotePreference || "—"}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-500 dark:text-gray-400 text-xs mb-1 block">Minimum Salary</label>
                        {editMode ? (
                            <input
                                type="number"
                                value={profileForm.salaryMin}
                                onChange={(e) => setProfileForm({ ...profileForm, salaryMin: e.target.value })}
                                placeholder="e.g. 80000"
                                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white text-sm">
                                {profileForm.salaryMin ? `$${parseInt(profileForm.salaryMin).toLocaleString()}` : "—"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-4">
                    <label className="text-gray-500 dark:text-gray-400 text-xs mb-1 block">Summary</label>
                    {editMode ? (
                        <textarea
                            value={profileForm.summary}
                            onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                            placeholder="Tell employers about yourself..."
                            rows={4}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent resize-none"
                        />
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {profileForm.summary || "Add a summary to tell employers about yourself."}
                        </p>
                    )}
                </div>
            </div>

            {/* Skills */}
            <div className={`border rounded-xl p-6 transition ${editMode ? "border-accent/50" : "border-gray-200 dark:border-gray-800"}`}>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, i) => (
                        <div
                            key={i}
                            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition"
                            style={{
                                borderColor: categoryColors[skill.category] + "88",
                                color: categoryColors[skill.category],
                                background: categoryColors[skill.category] + "15",
                            }}
                        >
                            {skill.skillName}
                            {editMode && (
                                <button
                                    onClick={() => removeSkill(i)}
                                    className="ml-1 opacity-0 group-hover:opacity-100 transition text-xs hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    {skills.length === 0 && (
                        <p className="text-gray-500 text-sm">No skills added yet.</p>
                    )}
                </div>

                {editMode && (
                    <div className="flex gap-2 flex-wrap">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                            placeholder="Skill name"
                            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent w-36"
                        />
                        <select
                            value={skillCategory}
                            onChange={(e) => setSkillCategory(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                        >
                            {skillCategories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={skillProficiency}
                            onChange={(e) => setSkillProficiency(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                        >
                            {proficiencies.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <input
                            value={skillYears}
                            onChange={(e) => setSkillYears(e.target.value)}
                            placeholder="Years"
                            type="number"
                            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent w-20"
                        />
                        <button
                            onClick={addSkill}
                            className="bg-accent text-black font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                        >
                            Add
                        </button>
                    </div>
                )}
            </div>

            {/* Experience */}
            <div className={`border rounded-xl p-6 transition ${editMode ? "border-accent/50" : "border-gray-200 dark:border-gray-800"}`}>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Experience</h3>
                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                        <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                            {editMode ? (
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            value={exp.title}
                                            onChange={(e) => updateExperience(i, "title", e.target.value)}
                                            placeholder="Job Title"
                                            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                                        />
                                        <input
                                            value={exp.company}
                                            onChange={(e) => updateExperience(i, "company", e.target.value)}
                                            placeholder="Company"
                                            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="date"
                                            value={exp.startDate || ""}
                                            onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                                            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                                        />
                                        {!exp.current && (
                                            <input
                                                type="date"
                                                value={exp.endDate || ""}
                                                onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                                                className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                                            />
                                        )}
                                        <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={(e) => updateExperience(i, "current", e.target.checked)}
                                                className="accent-[#BFFF00]"
                                            />
                                            Current
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        {(exp.bullets || []).map((bullet, bi) => (
                                            <div key={bi} className="flex gap-2 items-center">
                                                <span className="text-gray-500 text-sm">•</span>
                                                <input
                                                    value={bullet}
                                                    onChange={(e) => updateBullet(i, bi, e.target.value)}
                                                    onKeyDown={(e) => handleBulletKeyDown(e, i, bi)}
                                                    placeholder="Add a bullet point, press Enter for next"
                                                    className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-accent"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => removeExperience(i)}
                                        className="text-red-400 text-xs hover:text-red-300 transition"
                                    >
                                        Remove experience
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-gray-900 dark:text-white font-semibold">{exp.title}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.company}</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                                                {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                            </p>
                                        </div>
                                    </div>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="mt-3 space-y-1">
                                            {exp.bullets.filter(b => b).map((bullet, bi) => (
                                                <li key={bi} className="text-gray-600 dark:text-gray-300 text-sm flex gap-2">
                                                    <span className="text-accent mt-0.5">•</span>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {experiences.length === 0 && (
                        <p className="text-gray-500 text-sm">No experience added yet.</p>
                    )}
                </div>

                {editMode && (
                    <button
                        onClick={addExperience}
                        className="mt-4 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition w-full"
                    >
                        + Add Experience
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;