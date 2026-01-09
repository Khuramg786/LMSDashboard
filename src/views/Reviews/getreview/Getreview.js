import React, { useEffect, useState } from "react";
import axios from "axios";

const GetReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states
  const [review, setReview] = useState("");
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH =================
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/reviews/getreviews"
      );
      setReviews(res.data.review || []);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= DELETE =================
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/reviews/deletereview/${id}`
      );
      fetchReviews();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (r) => {
    setCurrentId(r._id);
    setReview(r.review);
    setUser(r.user);
    setCategory(r.category);
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateReview = async () => {
    try {
      const formData = new FormData();
      formData.append("review", review);
      formData.append("user", user);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axios.put(
        `http://localhost:5000/reviews/updatereview/${currentId}`,
        formData
      );

      if (res.data.success) {
        setShowModal(false);
        fetchReviews();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <>
      <div className="container w-75">
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
            {reviews.length ? (
              reviews.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={r.imageUrl}
                      alt=""
                      width="60"
                      height="60"
                      style={{ borderRadius: 8 }}
                    />
                  </td>
                  <td>{r.review}</td>
                  <td>{r.user}</td>
                  <td>{r.category}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 text-white fw-bold"
                      onClick={() => openModal(r)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm fw-bold text-white"
                      onClick={() => deleteReview(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No reviews found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#0009" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="fw-bold mb-3">Update Review</h5>
              <label className="form-label fw-bold">Review</label>

              <input
                className="form-control mb-2"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Review"
              />
              <label className="form-label fw-bold">User</label>

              <input
                className="form-control mb-2"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="User"
              />
              <label className="form-label fw-bold">Category</label>

              <select
                className="form-control mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="SEO">SEO</option>
              </select>
              <label className="form-label fw-bold">Image</label>

              <input
                type="file"
                className="form-control mb-3"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <div className="text-end">
                <button
                  className="btn btn-secondary mx-1 text-white fw-bold"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success text-white fw-bold" onClick={updateReview}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetReviews;
