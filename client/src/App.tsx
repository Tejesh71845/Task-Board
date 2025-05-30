import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {BoardPage} from "./pages/BoardPage";
import { HomePage } from "./pages/Homepage";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/board/:boardId/analytics" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
