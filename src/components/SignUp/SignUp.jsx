import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getRequest, createRequest } from "../../ServerRequests";
import { UserContext } from "../../App";
import { triggerError } from "../DisplayError/DisplayError";
import "./SignUp.css";

export default function SignUp() {
    const { setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm();

    // פונקציה לבדיקה בשלב הראשון
    const verifyUser = async (data) => {
        try {
            const user = await getRequest("users", "username", data.username);
            if (user[0]) {
                triggerError("You already have an account");
                return;
            } else if (data.password !== data.verifyPassword) {
                setError("verifyPassword", { message: "Passwords do not match." });
                return;
            }
            setStep(2);
        } catch (error) {
            console.log(error);
        }
    };

    // שליחת השלב הראשון
    const onFirstStepSubmit = (data) => {
        verifyUser(data);
    };

    // שליחת השלב השני
    const onSecondStepSubmit = async (data) => {
        try {
            const updatedFormData = {
                ...data,
                address: {
                    street: data.street,
                    suite: data.suite,
                    city: data.city,
                    zipcode: data.zipcode,
                    geo: {
                        lat: data.lat,
                        lng: data.lng,
                    },
                },
                company: {
                    name: data.companyName,
                    catchPhrase: data.catchPhrase,
                    bs: data.bs,
                },
            };

            const userData = await createRequest("users", updatedFormData);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            setCurrentUser(userData);
            navigate(`/users/${userData.id}/home`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="main-login">
            <div className="right-login">
                <div className="card-login">
                    <h1>Sign Up</h1>
                    {step === 1 && (
                        <form onSubmit={handleSubmit(onFirstStepSubmit)}>
                            <div className="textfield">
                                <label htmlFor="username">User</label>
                                <input
                                    type="text"
                                    {...register("username", { required: "Username is required." })}
                                    placeholder="User"
                                />
                                {errors.username && <span className="error">{errors.username.message}</span>}
                            </div>
                            <div className="textfield">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    {...register("password", { required: "Password is required." })}
                                    placeholder="Password"
                                />
                                {errors.password && <span className="error">{errors.password.message}</span>}
                            </div>
                            <div className="textfield">
                                <label htmlFor="verifyPassword">Verify Password</label>
                                <input
                                    type="password"
                                    {...register("verifyPassword", { required: "Please verify your password." })}
                                    placeholder="Verify Password"
                                />
                                {errors.verifyPassword && <span className="error">{errors.verifyPassword.message}</span>}
                            </div>
                            <button className="btn-login" type="submit">
                                Next
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleSubmit(onSecondStepSubmit)}>
                            <div className="textfield">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required." })}
                                    placeholder="Name"
                                />
                                {errors.name && <span className="error">{errors.name.message}</span>}
                            </div>
                            <div className="textfield">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email format.",
                                        },
                                    })}
                                    placeholder="Email"
                                />
                                {errors.email && <span className="error">{errors.email.message}</span>}
                            </div>
                            <div className="textfield">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    {...register("phone", {
                                        required: "Phone is required.",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "Only numbers are allowed.",
                                        },
                                    })}
                                    placeholder="Phone"
                                />
                                {errors.phone && <span className="error">{errors.phone.message}</span>}
                            </div>
                            {/* כתובת */}
                            <div className="textfield">
                                <label htmlFor="street">Street</label>
                                <input type="text" {...register("street")} placeholder="Street" />
                            </div>
                            <div className="textfield">
                                <label htmlFor="suite">Suite</label>
                                <input type="text" {...register("suite")} placeholder="Suite" />
                            </div>
                            <div className="textfield">
                                <label htmlFor="city">City</label>
                                <input type="text" {...register("city")} placeholder="City" />
                            </div>
                            <div className="textfield">
                                <label htmlFor="zipcode">Zipcode</label>
                                <input
                                    type="text"
                                    {...register("zipcode", {
                                        required: "zipcode is required.",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "Only numbers are allowed.",
                                        },
                                    })}
                                    placeholder="zip code"
                                />
                                {errors.zipcode && <span className="error">{errors.zipcode.message}</span>}

                            </div>
                            <div className="textfield">
                                <label htmlFor="lat">Latitude</label>
                                <input
                                    type="text"
                                    {...register("lat", {
                                        required: "lat is required.",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "Only numbers are allowed.",
                                        },
                                    })}
                                    placeholder="lat"
                                />
                                {errors.lat && <span className="error">{errors.lat.message}</span>}
                            </div>
                            <div className="textfield">
                                <label htmlFor="lng">Longitude</label>
                                <input
                                    type="text"
                                    {...register("lng", {
                                        required: "lng is required.",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "Only numbers are allowed.",
                                        },
                                    })}
                                    placeholder="lng"
                                />
                                {errors.lng && <span className="error">{errors.lng.message}</span>}
                            </div>
                            {/* חברה */}
                            <div className="textfield">
                                <label htmlFor="companyName">Company Name</label>
                                <input type="text" {...register("companyName")} placeholder="Company Name" />
                            </div>
                            <div className="textfield">
                                <label htmlFor="catchPhrase">Catch Phrase</label>
                                <input type="text" {...register("catchPhrase")} placeholder="Catch Phrase" />
                            </div>
                            <div className="textfield">
                                <label htmlFor="bs">BS</label>
                                <input type="text" {...register("bs")} placeholder="BS" />
                            </div>
                            <button className="btn-login" type="submit">
                                Submit
                            </button>
                        </form>
                    )}
                    <Link to="/login" className='login'>Allready Have An Account Yet?</Link>

                </div>
            </div>
        </main>
    );
}
