import {
  Sidebar,
  SidebarItems,
  SidebarItem,
  SidebarItemGroup
} from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import {toast} from 'react-toastify'
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';


const  DashSidebar = ()=> {
  const location = useLocation();
  const dispatch = useDispatch();
 const {error}= useSelector(state=>state.user)
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/logout`,{});
      if (response.data.success) {
        dispatch(signoutSuccess());
      }
      else {
        dispatch(signoutFailure(response.data.message))
      }
    } catch (err) {
      dispatch(signoutFailure(err.message))
      toast.error(error.message);
    }
  };
  
  return (
    <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col gap-1'>
          
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <SidebarItem
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}

          <Link to='/dashboard?tab=profile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </SidebarItem>
          </Link>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <SidebarItem
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </SidebarItem>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to='/dashboard?tab=users'>
                <SidebarItem
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Users
                </SidebarItem>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <SidebarItem
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  as='div'
                >
                  Comments
                </SidebarItem>
              </Link>
            </>
          )}

          <SidebarItem
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default DashSidebar