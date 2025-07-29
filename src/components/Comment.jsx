import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import { Textarea, Button } from "flowbite-react";

const Comment = ({ comment, onLike,onEdit,onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setuser] = useState(null);
  const [isEditing, setisEditing] = useState(false);
  const [editedContent, seteditedContent] = useState(comment.content);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${comment.userId}`);
        if (response.data.success) {
          setuser(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () => {
    setisEditing(true);
    seteditedContent(comment.content);
  };

  const handleSave = async()=>{
    try {
      const response =await axios.put(`${import.meta.env.VITE_API_URL}/api/comment/editcomment/${comment._id}`,{content:editedContent});
      if(response.data.success){
        setisEditing(false);
        onEdit(comment._id,editedContent);
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => seteditedContent(e.target.value)}
              className="mb-2"
            />
            <div className="flex justify-end gap-2 text-sx ">
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                Save
              </Button>
              <Button
                onClick={() => setisEditing(false)}
                type="button"
                size="sm"
                className="bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 text-gray-900 hover:bg-gradient-to-bl focus:ring-red-100 dark:focus:ring-red-400"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  
                   <button
                    onClick={()=>onDelete(comment._id)}
                    type="button"
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
