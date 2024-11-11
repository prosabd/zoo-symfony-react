import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Animals from "@/pages/Animals";

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
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
