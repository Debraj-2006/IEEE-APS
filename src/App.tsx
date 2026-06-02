import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { InitiativeDetails } from "./pages/InitiativeDetails";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/initiatives/:type" element={<InitiativeDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}
