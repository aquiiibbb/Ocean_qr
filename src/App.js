import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Page from "./page";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FeedbackSurvey" element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
