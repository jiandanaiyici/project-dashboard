import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MetricsCategories from "./pages/MetricsCategories";
import MetricDetail from "./pages/MetricDetail";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/metrics" element={<MetricsCategories />} />
        <Route path="/metrics/:id" element={<MetricDetail />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
