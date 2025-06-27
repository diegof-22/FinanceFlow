
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-200 mb-4">
            Pagina non trovata
          </h2>
          <p className="text-gray-300 mb-8">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Torna alla Dasboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-white-300 hover:text-white-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna Indietro</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
