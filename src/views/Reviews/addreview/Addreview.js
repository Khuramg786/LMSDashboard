import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addviews = () => {
  const [review, setReview] = useState('');
  const [user, setUser] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const registerProduct = async (e) => {
    e.preventDefault(); // VERY IMPORTANT

    if (!review || !user || !category) {
      toast.error('❌ Please fill all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('review', review);
      formData.append('user', user);
      formData.append('category', category);
      if (image) formData.append('image', image);

      const res = await axios.post(
        'https://lms-backend-umup.onrender.com/reviews/postreviews',
        formData
      );

      if (res.status === 201) {
        toast.success('✅ Review added successfully!');
        setTimeout(() => navigate('/Blogs/Getblogs'), 1500); // redirect after toast
      } else {
        toast.error('❌ Failed to add review');
      }
    } catch (error) {
      console.error(error);
      toast.error('❌ Something went wrong');
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-center my-4 fw-bold fs-4">Add Review</h1>

      <div className="container w-50">
        <form onSubmit={registerProduct}>
          <div className="mb-3">
            <label className="form-label fw-bold">Review</label>
            <input
              type="text"
              className="form-control"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">User</label>
            <input
              type="text"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-control mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Course Category</option>
              <option value="Business Growth Club">Business Growth Club</option>
              <option value="Team Management Skills Club">Team Management Skills Club</option>
              <option value="Sales Booster Training">Sales Booster Training</option>
              <option value="Mental Wellness">Mental Wellness</option>
              <option value="Financial Management">Financial Management</option>
              <option value="Relation Building">Relation Building</option>
              <option value="Physical Health">Physical Health</option>
              <option value="Social Awareness">Social Awareness</option>
              <option value="Spiritual Awakening">Spiritual Awakening</option>
              <option value="Leadership Skills for Principals">Leadership Skills for Principals</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3 mb-3 w-25 fw-bold">
            ADD Review
          </button>
        </form>
      </div>
    </>
  );
};

export default Addviews;
