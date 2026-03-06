import {Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/pursuitly-logo-removebg-preview.png";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { dark, setDark } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/jobs", label: "Jobs" },
        { path: "/applications", label: "Applications" },
        { path: "/profile", label: "Profile" },
        { path: "/cover-letter", label: "Cover Letter"},
    ];

    const isActive = (path) => location.pathname == path;

    return (
        <nav className="border-b border-accent bg-black dark:bg-black light:bg-white sticky top-0 z-50 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/*Logo*/}
                <Link to="/dashboard" className="flex items-center gap-2">
                    <img src={logo} alt="Pursuitly" className="h-12 w-12" />
                    <span className="text-xl font-bold text-accent tracking-tight">Pursuitly</span>
                </Link>
                {/* Nav links */}
                <div className="flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm transition ${
                                isActive(link.path)
                                    ? "text-accent font-semibold"
                                    : "text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <button
                    onClick={() => setDark(!dark)}
                    className="text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 transition text-lg"
                >
                    {dark ? "☀️" : "🌙"}
                </button>
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 transition"
                    >
                        Log out
                    </button>
            </div>
        </nav>
    );
};

export default Navbar;