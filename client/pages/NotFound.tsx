import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gaming-dark">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary-blue neon-glow">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to the action!
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Attempted route: <code className="bg-gray-800 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-primary-blue hover:bg-primary-blue/90 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <p>Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <button onClick={() => navigate("/")} className="text-primary-blue hover:underline">Home</button>
            <span>•</span>
            <button onClick={() => navigate("/store")} className="text-primary-blue hover:underline">Store</button>
            <span>•</span>
            <button onClick={() => navigate("/stats")} className="text-primary-blue hover:underline">Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
