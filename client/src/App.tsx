import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {BoardPage} from "./pages/BoardPage";
import { HomePage } from "./pages/Homepage";
import { Dashboard } from "./pages/Dashboard";
import { AnalyticsPage } from "./pages/AnalyticsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/board/:boardId/analytics" element={<Dashboard />} />
        <Route path="/board/:boardId/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
