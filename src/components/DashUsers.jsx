import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  Table,
  Modal,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setuserIdToDelete] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getusers`);
        
        if (response.data.success) {
          setUsers(response.data.users);
          if (response.data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleDeleteUser = async () => {
    try {
      
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/delete/${userIdToDelete}`);
      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userIdToDelete))
        setShowModal(false);
        toast.success(response.data.message);
      }      
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getusers?startIndex=${startIndex}`
      );
      if (response.data.success) {
        setUsers((prev) => [...prev, ...response.data.users]);
        if (response.data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 && (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>username</TableHeadCell>
              <TableHeadCell>email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
           
            </TableHead>
            <TableBody  className="divide-y">
            {users.map((user) => (
                <TableRow key={user._id} className="text-gray-300  dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                  <img
                    className="w-12 h-12 object-cover object-center rounded-full"
                      src={user.profilePicture}
                      alt={"profile picture"}
                     
                    />
                  </TableCell>
                  <TableCell>
                   
                      {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin?(<FaCheck className="text-green-500" />):(<FaTimes className="text-red-500" />)}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setuserIdToDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                
                </TableRow>
            ))}
            </TableBody>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashUsers;
