import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {BoardPage} from "./pages/BoardPage";
import { HomePage } from "./pages/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
