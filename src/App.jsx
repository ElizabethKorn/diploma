import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import TicketsPage from "./pages/TicketPage/TicketsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;