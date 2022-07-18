import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import AnswerForms from './pages/AnswerForms';
import EditForms from './pages/EditForms';
import Forms from './pages/Forms';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Auth from "./utils/auth";

function App() {
  if (window.location.pathname === "/") window.location.href = "/forms"
  return (
    <div className="App">
      {Auth.loggedIn() ? <button onClick={() => Auth.logout()}>Sign out</button> : <></>}
      <BrowserRouter>
        <Routes>
          <Route path="/signIn" element={<SignIn />}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/forms" element={<Forms />}/>
          <Route path="/forms/edit/:id" element={<EditForms />}/>
          <Route path="/forms/:id" element={<AnswerForms />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
