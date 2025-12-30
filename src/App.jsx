import { useState } from 'react'
import './App.css'

import Home from './components/HomeScreen';
import Boards from './components/Boards';
import Templates from './components/Templates';
import DetailsCard  from './components/DetailsCard';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/b" element={<DetailsCard />} />
        <Route path="/b/:id" element={<DetailsCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App