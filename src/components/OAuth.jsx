import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import {app} from '../../firebase'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const OAuth = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const auth=getAuth(app)
  const handleGoogleClick = async () => {
    const provider= new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      
      const resultFromGoogle = await signInWithPopup(auth, provider);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      })
      
      if (response.data.success) {
        dispath(signInSuccess(response.data.rest));
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <Button
      onClick={handleGoogleClick}
      type="button" className='text-black hidden bg-gradient-to-l from-pink-400 to-orange-400'  ><AiFillGoogleCircle className='w-6 h-6 mr-2' /> Continue with Google</Button>
  )
}

export default OAuth
