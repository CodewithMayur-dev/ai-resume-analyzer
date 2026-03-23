import { Link, useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="w-full py-4 px-4">
      <div className="navbar shadow-sm border border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/pin.svg" alt="Logo" className="w-6 h-6" />
          <span className="font-bold text-lg text-gray-900">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isHome && (
            <Link to="/" className="back-button text-sm text-gray-600">
              <img src="/icons/back.svg" alt="Back" className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <Link to="/upload" className="primary-button text-sm w-auto px-6 py-2">
            + Analyze Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
