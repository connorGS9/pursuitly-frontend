import { Link } from "react-router-dom";
import logo from "../assets/pursuitly-logo-removebg-preview.png";

const Landing = () => {
    return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Navbar */}
        <nav className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <img src={logo} alt="Pursuitly" className="h-12 w-12" />
                <span className="text-xl font-bold text-accent">Pursuitly</span>
            </div>
            <div className="flex items-center gap-6">
                <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition">
                    Sign in
                </Link>
                <Link to="/register" className="bg-accent text-black text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition">
                    Get started
                </Link>
            </div>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
            <div className="inline-block bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-6">
                AI-Powered Job Search
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                Land your next role
                <br />
                <span style={{
                    background: "linear-gradient(90deg, #111111, #111111, #BFFF00, #111111, #111111)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    animation: "gradientShift 4s ease infinite"
                }}>
                    faster than ever
                </span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Pursuitly aggregates thousands of jobs, matches them to your skills using AI,
                and helps you apply with personalized cover letters — all in one place.
            </p>

            <div className="flex items-center justify-center gap-4">
                <Link to="/register" className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition text-lg">
                    Start for free
                </Link>
                <Link to="/login" className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition text-lg">
                    Sign in
                </Link>
            </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-accent/50 transition">
                    <div className="text-accent text-2xl mb-4">⚡</div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Aggregated Jobs</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Jobs pulled from multiple sources twice daily so you never miss a fresh posting.
                    </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-accent/50 transition">
                    <div className="text-accent text-2xl mb-4">🎯</div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">AI Match Scoring</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Your profile is embedded and matched against every job using vector similarity.
                    </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-accent/50 transition">
                    <div className="text-accent text-2xl mb-4">✍️</div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Cover Letters</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Generate tailored cover letters for any job in seconds using GPT-4o-mini.
                    </p>
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to start your search?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Join Pursuitly and take control of your job search today.</p>
                <Link to="/register" className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition text-lg">
                    Create free account
                </Link>
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 px-6 py-6 text-center text-gray-400 dark:text-gray-600 text-sm">
            © 2026 Pursuitly. All rights reserved.
        </footer>
    </div>
    );
};

export default Landing;