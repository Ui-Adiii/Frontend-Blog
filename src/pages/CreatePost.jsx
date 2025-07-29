import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // fixed import

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [textEditor, setTextEditor] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !textEditor || !file) {
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('content', textEditor);
    formData.append('category', category);

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);

      // Make sure to access the actual data
      if (response.data.success) {
        toast.success("Post created successfully!");
        navigate('/');
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }

    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to create post.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

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

        {/* File Upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
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
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
