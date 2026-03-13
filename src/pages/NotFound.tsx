import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100" aria-labelledby="not-found-title">
      <section className="text-center">
        <h1 id="not-found-title" className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl text-gray-700 mb-4">Oops! Page not found</h2>
        <Link to="/" className="text-blue-700 hover:text-blue-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm">
          Return to Home
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
