import React, { useState } from 'react';
import "./SignIn.css";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from '../utils/auth';

const SignIn = () => {
    if (Auth.loggedIn()) window.location.href = "/forms";
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [hideError, setHideError] = useState(true);
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }
    const handleHidePassword = (e: React.MouseEvent) => {
        e.preventDefault();
        setHidePassword(!hidePassword);
    }
    const handleSignIn = async (e: React.MouseEvent) => {
        e.preventDefault();

        const userData = { email, password };
        let response = await fetch("/api/signIn", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })

        const data = await response.json();
        const { token } = data;

        if (data.code === 200) {
            Auth.login(token);
        } else {
            setHideError(false);
            setErrorMessage(data.message);
            setTimeout(() => {setHideError(true); setErrorMessage("");}, 3000);
        }
    }
    return (
        <div className="SignIn">
            <form>
                <h2>Sign in</h2>
                <div className="container">
                    <label>Email</label>
                    <br />
                    <input value={email} onChange={handleEmailChange}></input>
                </div>
                <div className="container">
                    <label>Password</label>
                    <br />
                    <input type={hidePassword ? "password" : ""} value={password} onChange={handlePasswordChange}></input>
                    <div className="hideContainer">
                        <a href="/signUp">Create account</a>
                        <p className="hide" onClick={handleHidePassword}>Show password</p>
                    </div>
                    <p className={hideError ? "hiddenError" : "error"}>{errorMessage}</p>
                </div>
                <Button className='Submit' onClick={handleSignIn}>Sign in</Button>
            </form>
        </div>
    )
}

export default SignIn