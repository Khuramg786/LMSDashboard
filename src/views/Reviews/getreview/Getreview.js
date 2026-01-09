import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [review, setReview] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://lms-backend-umup.onrender.com/reviews/getreviews");
      setReviews(res.data.review || []);
    } catch (error) {
      toast.error("❌ Failed to fetch reviews");
      console.error(error);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  // Delete review
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await axios.delete(`https://lms-backend-umup.onrender.com/reviews/deletereviews/${id}`);
      if (res.data.success) {
        toast.success("✅ Review deleted successfully");
        fetchReviews();
      }
    } catch (error) {
      toast.error("❌ Something went wrong while deleting");
      console.error(error);
    }
  };

  // Open modal
  const openModal = (r) => {
    setCurrentId(r._id);
    setReview(r.review);
    setUser(r.user);
    setCategory(r.category);
    setImage(null);
    setRemoveImage(false);
    setShowModal(true);
  };

  // Update review
  const updateReview = async () => {
    if (!review || !user || !category) {
      toast.error("❌ All fields are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("review", review);
      formData.append("user", user);
      formData.append("category", category);
      if (image) formData.append("image", image);
      if (removeImage) formData.append("removeImage", "true");

      const res = await axios.put(`https://lms-backend-umup.onrender.com/reviews/updatereview/${currentId}`, formData);

      if (res.data.success) {
        toast.success("✅ Review updated successfully");
        setShowModal(false);
        fetchReviews();
      } else {
        toast.error("❌ Update failed");
      }
    } catch (error) {
      toast.error("❌ Something went wrong while updating");
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container w-100">
        <h3 className="text-center my-4 fw-bold">Reviews List</h3>
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Review</th>
              <th>User</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length ? reviews.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>
                  {r.imageUrl && <img src={r.imageUrl} alt={r.user} width="60" height="60" style={{ borderRadius: 8, objectFit: "cover" }} />}
                </td>
                <td>{r.review}</td>
                <td>{r.user}</td>
                <td>{r.category}</td>
                <td>
                  <button className="btn btn-warning btn-sm mx-1 text-white mt-2 fw-bold" onClick={() => openModal(r)}>Update</button>
                  <button className="btn btn-danger btn-sm fw-bold mt-3 text-white" onClick={() => deleteReview(r._id)}>Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6">No reviews found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ background: "#0009" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="fw-bold mb-3">Update Review</h5>

              <label className="form-label fw-bold">Review</label>
              <input className="form-control mb-2" value={review} onChange={e => setReview(e.target.value)} />

              <label className="form-label fw-bold">User</label>
              <input className="form-control mb-2" value={user} onChange={e => setUser(e.target.value)} />

              <label className="form-label fw-bold">Category</label>
              <select className="form-control mb-2" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Business Growth Club">Business Growth Club</option>
                <option value="Team Management Skills Club">Team Management Skills Club</option>
                <option value="Sales Booster Training">Sales Booster Training</option>
                <option value="Mental Wellness">Mental Wellness</option>
                <option value="Financial Management">Financial Management</option>
                <option value="Relation Building">Relation Building</option>
                <option value="Physical Health">Physical Health</option>
                <option value="Social Awareness">Social Awareness</option>
                <option value="Spiritual Awakening">Spiritual Awakening</option>
                <option value="Leadership Skills for Principals">Leadership Skills for Principalsg</option>
              </select>

              {reviews.find(r => r._id === currentId)?.imageUrl && (
                <div className="form-check mb-2">
                  <input type="checkbox" className="form-check-input" id="removeImage" checked={removeImage} onChange={() => setRemoveImage(!removeImage)} />
                  <label className="form-check-label" htmlFor="removeImage">Remove existing image</label>
                </div>
              )}

              <label className="form-label fw-bold">Image</label>
              <input type="file" className="form-control mb-3" accept="image/*" onChange={e => setImage(e.target.files[0])} />

              <div className="text-end">
                <button className="btn btn-secondary mx-1 fw-bold text-white" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success text-white fw-bold" onClick={updateReview}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetReviews;
