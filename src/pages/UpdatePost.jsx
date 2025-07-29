import {
  Button,
  FileInput,
  Select,
  TextInput
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState ,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate,useParams } from "react-router-dom"; // fixed import
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setimageUrl] = useState(null)
  const [textEditor, setTextEditor] = useState('');
  const [loading, setLoading] = useState(false);
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);


  const navigate = useNavigate();

   useEffect(() => {
    try {
        const fetchPost = async () => {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/getpost/${postId}`);           
          if (response.data.success) {
            let data = response.data.posts;
            data = data.filter((post) => post._id === postId)[0];
            setTitle(data.title);
            setCategory(data.category);
            setTextEditor(data.content);
            setimageUrl(data.image)            
          }
          else {
            toast.error(response.data.message);
          }
      }
      fetchPost();
      } catch (error) {
        toast.error(error.message);
      }
   }, [postId])
   
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const formData={};
      formData['title']= title;
      formData['content']= textEditor;
      formData['category']= category;
      

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/post/updatepost/${postId}/${currentUser._id}`, formData);
      
      if (response.data.success) {
        setLoading(false);
        navigate(`/post/${response.data.post.slug}`);      }
      else {
        toast.error(response.data.message);
        setLoading(false);
      }
     } catch (error) {
      toast.error(error.message)
     }
   }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title & Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex-1"
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        
        <div className="flex justify-center items-center">
          <img className="w-52 h-52 overflow-hidden rounded-sm object-cover" src={imageUrl} alt="" />
        </div>
        {/* Rich Text Editor */}
        <ReactQuill
          value={textEditor}
          onChange={setTextEditor}
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
        />

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
