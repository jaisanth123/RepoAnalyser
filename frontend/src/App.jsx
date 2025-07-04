import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Contributors from "./pages/Contributors";
import Codebase from "./pages/Codebase";
import Security from "./pages/Security";

// Import API test for development
if (import.meta.env.MODE === "development") {
  import("./test-api.js");
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contributors" element={<Contributors />} />
          <Route path="codebase" element={<Codebase />} />
          <Route path="security" element={<Security />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
