import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import "./SignUp.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from '../utils/auth';

const SignUp = () => {
    if (Auth.loggedIn()) window.location.href = "/forms";
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmValue, setConfirmValue] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirm, setHideConfirm] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [hideError, setHideError] = useState(true);
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value.trim());
    }
    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value.trim());
    }
    const handleConfirmChange = (e: any) => {
        setConfirmValue(e.target.value.trim());
    }
    const handleHidePassword = (e: React.MouseEvent) => {
        e.preventDefault();
        setHidePassword(!hidePassword)
    }
    const handleHideConfirm = (e: React.MouseEvent) => {
        e.preventDefault();
        setHideConfirm(!hideConfirm)
    }
    const handleSignUp = async (e: React.MouseEvent) => {
        e.preventDefault();
        setUsername(username.trim())

        if (!email.match(/^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/)) {
            setHideError(false);
            setErrorMessage("Email is invalid")
            setTimeout(() => {setHideError(true); setErrorMessage("");}, 3000);
            return;
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            setHideError(false);
            setErrorMessage("Username is invalid. Alphanumeric characters only");
            setTimeout(() => {setHideError(true); setErrorMessage("");}, 3000);
            return;
        }
        if (!password.match(/^(?=.*[0-9])(?=.*[:!@#$%^&*])[a-zA-Z0-9:!@#$%^&*]{6,16}$/)) {
            setHideError(false);
            setErrorMessage("Password is invalid. (Must contain letter, number, and symbol)")
            setTimeout(() => {setHideError(true); setErrorMessage("");}, 5000);
            return;
        }
        if (confirmValue !== password) {
            setHideError(false);
            setErrorMessage("Passwords do not match");
            setTimeout(() => {setHideError(true); setErrorMessage("");}, 3000);
            return;
        }
        const userData = { username, email, password };
        let response = await fetch("/api/signUp", {
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
        <div className="SignUp">
            <form>
                <h2>Sign up</h2>
                <div className="container">
                    <label>Email</label>
                    <br />
                    <input value={email} onChange={handleEmailChange}></input>
                </div>
                <div className="container">
                    <label>Username</label>
                    <br />
                    <input value={username} onChange={handleUsernameChange}></input>
                </div>
                <div className="container">
                    <label>Password</label>
                    <br />
                    <input type={hidePassword ? "password" : ""} value={password} onChange={handlePasswordChange}></input>
                    <div className="hideContainer">
                        <p className="hide" onClick={handleHidePassword}>{hidePassword ? "Show" : "Hide"} password</p>
                    </div>
                </div>
                <div className="container lastContainer">
                    <label>Confirm password</label>
                    <br />
                    <input type={hideConfirm ? "password" : ""} value={confirmValue} onChange={handleConfirmChange}></input>
                    <div className="hideContainerLast">
                        <a href="/signIn">Sign in instead</a>
                        <p className="hide" onClick={handleHideConfirm}>{hideConfirm ? "Show" : "Hide"} password</p>
                    </div>
                    <p className={hideError ? "hiddenError" : "error"}>{errorMessage}</p>
                </div>
                <Button className='Submit' onClick={handleSignUp}>Sign up</Button>
            </form>
        </div>
    )
}

export default SignUp