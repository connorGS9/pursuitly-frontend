import Navbar from "./Navbar";

const Layout = ({children}) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;