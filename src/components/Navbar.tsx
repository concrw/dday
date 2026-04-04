import { Link, useLocation } from "react-router-dom";
import { TEXT } from "@/constants/text";

export default function Navbar() {
  const location = useLocation();
  const isCreate = location.pathname === "/create";

  return (
    <nav className="w-full bg-[#1a1a2e] text-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-white hover:text-blue-300 transition-colors duration-200"
        >
          {TEXT.APP_NAME}
        </Link>

        <div className="flex items-center gap-3">
          {!isCreate && (
            <Link
              to="/create"
              className="bg-[#2A6FBB] hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            >
              + {TEXT.NAV_CREATE}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
