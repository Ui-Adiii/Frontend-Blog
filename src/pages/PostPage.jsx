import React, {  useEffect, useState } from 'react'
import {  Link, useParams } from 'react-router'
import { toast } from 'react-toastify'
import axios from 'axios';
import { Spinner, Button } from 'flowbite-react'
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';


const PostPage = () => {
  const { postslug } = useParams();
  const [loading, setloading] = useState(true)
  const [post, setpost] = useState(null);
  const [recentPosts, setrecentPosts] = useState([])


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setloading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/getposts?slug=${postslug}`);
        if (response.data.success) {
          setloading(false);
          setpost(response.data.posts[0]);
        }
        else{
          setloading(false);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchPost();
  }, [postslug])
  
  useEffect(() => {
    const fetchRecentPosts = async ()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/getposts?limit=3`);        
        if (response.data.success) {
          setrecentPosts(response.data.posts);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchRecentPosts();
  }, [])
  

  if (loading) return (
    <div className=' flex justify-center min-h-screen items-center'>
      <Spinner size='xl' />
    </div>
  )
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
      {post && post.title}
    </h1>
    <Link
      to={`/search?category=${post && post.category}`}
      className='self-center mt-5'
    >
      <Button color='gray' pill size='xs'>
        {post && post.category}
      </Button>
    </Link>
    <img
      src={post && post.image}
      alt={post && post.title}
      className='mt-10 p-3 max-h-[600px] w-full object-cover'
    />
    <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
      <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      <span className='italic'>
        {post && (post.content.length / 1000).toFixed(0)} mins read
      </span>
    </div>
    <div
      className='p-3 max-w-2xl mx-auto w-full post-content'
      dangerouslySetInnerHTML={{ __html: post && post.content }}
    ></div>
      
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction/>
      </div>
    <CommentSection postId={post._id} />
    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-xl mt-5'>Recent articles</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
       {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  </main>
  )
}

export default PostPage