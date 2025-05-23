import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {BoardPage} from "./pages/BoardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/board/:boardId" element={<BoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
