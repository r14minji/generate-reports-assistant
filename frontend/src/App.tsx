import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";

const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
