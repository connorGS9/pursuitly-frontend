import { use, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";

const Login = () => {
    const[email, setEmail] = useState(""); // React state varaiables set blank until user enters something then re-render with what was set
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const[loading, setLoading] = useState(false);
    const {login: authLogin} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => { // Functiontells page what to do when form is submitted
        e.preventDefault(); // Dont refresh page 
        setLoading(true); // Set loading as true 
        setError(""); // Blank error message
        try {
            const res = await login(email, password); // Call api/login in spring boot and await response
            authLogin(res.data); // Save JWT to localStorage and auth context
            navigate("/dashboard"); // Navigate user to dashboard on successful login
        } catch (err) {
            setError("Invalid email or password"); // Set the error message for fail api call
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <div className="w-full max-w-md p-8 border border-gray-200 dark:border-gray-800 rounded-xl">
                <h1 className="text-gray-900 dark:text-white mb-8">Welcome back</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to your Pursuitly account</p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-accent hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;