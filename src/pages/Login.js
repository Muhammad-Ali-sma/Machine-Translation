import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import { toggleLogin } from '../Redux/Slices/AuthSlice';
import { setUser } from '../Redux/Slices/AuthSlice';
import { LoginUser } from '../Services/CommonService';

const Login = () => {

    const styles = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
    };

    // React States
    const [errorMessages, setErrorMessages] = useState({});
    // React Hooks
    const dispatch = useDispatch();


    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var { uname, pass } = document.forms[0];
        LoginUser(uname?.value, pass?.value)
            .then((res) => {
                if (res.data?.status === 'success') {
                    localStorage.setItem("ACCESS_TOKEN", res?.data?.data[0]?.accessToken);
                    dispatch(setUser(res?.data?.data[0]))
                    dispatch(toggleLogin('Login'));
                } else {
                    setErrorMessages({
                        name: "pass",
                        message: "Invalid credentials!",
                    });
                }
            })
            .catch((error) => {
                console.log(error);

                if (error?.response?.status === 400) {
                    setErrorMessages({
                        name: "pass",
                        message: error?.response?.data.validationErrors?.message,
                    });
                } else {
                    if (error?.code === "ERR_NETWORK") {
                        setErrorMessages({
                            name: "pass",
                            message: "Request timed out. Services might be down!",
                        });
                    }
                }
            });
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );
    return (
        <>
            <Header />
            <div className="app" style={styles}>
                <div
                    className="form"
                    style={{
                        border: "1px solid #005697",
                        paddingTop: "20px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        paddingBottom: "20px",
                        fontFamily:
                            'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    }}
                >
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="input-container">
                            <label>Username </label>
                            <input type="text" className="input-login" name="uname" required />
                            {renderErrorMessage("uname")}
                        </div>
                        <div className="input-container">
                            <label>Password </label>
                            <input
                                type="password"
                                className="input-login"
                                name="pass"
                                required
                            />
                            {renderErrorMessage("pass")}
                        </div>
                        <div className="button-container">
                            <input type="submit" className="input-login-submit" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

export default Login