import React from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";

const Signup = () => {
  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setformData] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const navigate =useNavigate()
  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart())
    try {
      setloading(true);
      seterror(null);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      if(!response.data.success){
        seterror(response.data.message);
        dispatch(signInFailure(response.data.message))
      }
      else {
        setloading(false);
        dispatch(signInSuccess(response.data.rest))
        navigate('/')
      }
      setloading(false);
    } catch (error) {
      seterror(error.message);
      setloading(false)
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <div className="min-h-[400px] mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Aditya's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput
                required
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                required
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                required
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              className="bg-gradient-to-l from-yellow-400 via-red-400 to-yellow-400"
              type="submit"
              disabled={loading}
            >{
                loading ? (
                  <><Spinner size="sm" />
                  <span className="pl-3">Loading...</span></>
                ):'Sign In'
            }
              
            </Button>
           < OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
