import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

const Register = () => {
    const [fullName, setFullName] = useState(""); // React state, re-renders the fullName blank to user entered otherwise empty string ("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop refreshing of browser on form submit
        setLoading(true); // Shows "signing in" loading remark on button 
        setError(""); // Blank error message to initialize
        try {
            await register(email, fullName, password); // Calls the /api/register endpoint on spring boot and "awaits" the response
            navigate("/login"); // Navigate user to login after registering successfully
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false); //Set loading back to false regardless of success or failure
        }
    };
    
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-full max-w-md p-8 border border-accent rounded-xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create account</h1>
            <p style={{
                background: "linear-gradient(90deg, #111111, #111111, #BFFF00, #111111, #111111)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 5s ease infinite"
            }} className="mb-8 dark:![background:linear-gradient(90deg,#ffffff,#ffffff,#BFFF00,#ffffff,#ffffff)_300%_300%]">
                Start your job search with Pursuitly
            </p>

            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-gray-900 dark:text-white text-sm mb-1 block">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                        placeholder="Connor Smith"
                        required
                    />
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white text-sm mb-1 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                        placeholder="you@email.com"
                        required
                    />
                </div>
                <div>
                    <label className="text-gray-900 dark:text-white text-sm mb-1 block">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    </div>
);
};


export default Register;