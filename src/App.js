import React, { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./ChatPage";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";

export const APP_CONTEXT = createContext({});
function App() {
  const [user, setUser] = useState();

  return (
    <APP_CONTEXT.Provider
      value={{
        user,
        setUser,
      }}
    >
      <Router>
        <Routes>
          <Route path="" element={<ChatPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </APP_CONTEXT.Provider>
  );
}

export default App;
