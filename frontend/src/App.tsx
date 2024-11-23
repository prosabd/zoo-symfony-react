import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Animals from "@/pages/Animals";
import AnimalDetail from "@/pages/AnimalDetail";
import Login from "@/pages/Admin/Login";
import AdminDashboard from "@/pages/Admin/Dashboard";
import NotFound from "@/pages/NotFound";

function App() {

  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals">
            <Route index element={<Animals />} /> {/* Shows all animals */}
            <Route path=":family" element={<Animals />} /> {/* Shows animals by type */}
            <Route path="detail/:id" element={<AnimalDetail />} /> {/* Shows animal details */}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin">
            <Route index element={<AdminDashboard />} /> {/* redirect to admin dashboard */}
            <Route path="dashboard" element={<AdminDashboard />} /> {/* Shows admin dashboard */}
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch all unmatched routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
