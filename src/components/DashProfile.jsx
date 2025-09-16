import {
  Button,
  Modal,
  TextInput,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import {Link} from 'react-router-dom'

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, error ,loading } = useSelector((state) => state.user);
  const [imageFile, setimageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [formData, setformData] = useState({});
  const [showModal, setshowModal] = useState(false);

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    // setformData({...formData,[e.target.id]:e.target.value})
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && Object.keys(formData).length === 0) return;

    try {
      dispatch(updateStart());

      const data = new FormData();
      if (imageFile) data.append("profilePicture", imageFile);
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        data,
        {
          withCredentials:true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        dispatch(updateFailure(response.data.message));
        toast.error(response.data.message);
      } else {
        dispatch(updateSuccess(response.data.rest));
        toast.success(response.data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const uploadImage = async () => {
    localStorage.setItem("imageFileUrl", imageFileUrl);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/logout`,{});
      if (response.data.success) {
        dispatch(signoutSuccess());
      } else {
        dispatch(signoutFailure(response.data.message));
      }
    } catch (err) {
      dispatch(signoutFailure(err.message));
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setshowModal(false);
    try {
      dispatch(deleteStart());
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`
      );
      if (!response.data.success) {
        dispatch(deleteFailure(response.data.message));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (err) {
      dispatch(deleteFailure(err.message));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  
  return (
    <div className="mx-auto p-3 w-full">
      <h1 className="text-2xl text-center font-semibold mb-4">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center"
      >
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          name="image"
        />

        <div
          onClick={() => filePickerRef.current.click()}
          className="w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full relative"
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <Button type="submit" outline className="w-[300px] mt-2"
        
        disabled={loading}>
          {loading? "loading...":"Update"}
        </Button>
        {currentUser && (
          <Link to='/create-post'>
          <Button type="button" color="pink" outline className="w-[300px] mt-2">
            Create a Post
          </Button>
          </Link>
        )}
        <div className="text-red-500 w-[300px] flex justify-between mt-5">
          <span onClick={() => setshowModal(true)} className="cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="cursor-pointer">
            Sign Out
          </span>
        </div>
      </form>
      <Modal
        show={showModal}
        onClose={() => setshowModal(false)}
        popup
        size="md"
      >
        <ModalHeader>
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sre you want to delete your account?
              </h3>
              <div className="flex justify-center gap-5">
                <Button color="red" onClick={handleDeleteUser}>
                  Yes, I am Sure
                </Button>
                <Button color="light" onClick={() => setshowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalHeader>
      </Modal>
    </div>
  );
};

export default DashProfile;
