import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getblogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdby, setCreatedby] = useState("");
  const [timeread, setTimeread] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await fetch(
        "https://lms-backend-umup.onrender.com/blog/getblogs"
      );
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      toast.error("❌ Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE =================
  const deleteCourse = async (id) => {
    // if (!window.confirm("Delete this course?")) return;

    try {
      const res = await fetch(
        `https://lms-backend-umup.onrender.com/blog/deletebloges/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        toast.success("✅ Blog deleted successfully!");
        setBlogs((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error("❌ Delete failed");
      }
    } catch (err) {
      toast.error("❌ Network error");
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (blog) => {
    setCurrentId(blog._id);
    setTitle(blog.title);
    setDescription(blog.descruption); // backend field is descruption
    setCreatedby(blog.createdby);
    setTimeread(blog.timeread);
    setCategory(blog.categary); // backend field is categary
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateCourse = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("descruption", description);
    formData.append("createdby", createdby);
    formData.append("timeread", timeread);
    formData.append("categary", category);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `https://lms-backend-umup.onrender.com/blog/updateblog/${currentId}`,
        { method: "PUT", body: formData }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Blog updated successfully!");
        setBlogs((prev) =>
          prev.map((c) => (c._id === currentId ? data.updatedBlog : c))
        );
        setShowModal(false);
      } else {
        toast.error("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Network error");
    }
  };

  return (
    <>
      <div className="container w-75">
        <h3 className="text-center my-4 fw-bold text-white">Blogs List</h3>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Time Read</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length ? (
              blogs.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={c.imageUrl}
                      alt="blog"
                      width="70"
                      height="70"
                      style={{ borderRadius: 10, objectFit: "cover" }}
                    />
                  </td>
                  <td>{c.title}</td>
                  <td>{c.descruption}</td>
                  <td>{c.createdby}</td>
                  <td>{c.timeread}</td>
                  <td>{c.categary}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 fw-bold text-white"
                      onClick={() => openModal(c)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm fw-bold text-white"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No blogs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="fw-bold mb-3">Update Blog</h5>

              <label className="form-label fw-bold">Title</label>
              <input
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />

              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />

              <label className="form-label fw-bold">Created By</label>
              <input
                className="form-control mb-2"
                value={createdby}
                onChange={(e) => setCreatedby(e.target.value)}
                placeholder="Created By"
              />

              <label className="form-label fw-bold">Time Read</label>
              <input
                className="form-control mb-2"
                value={timeread}
                onChange={(e) => setTimeread(e.target.value)}
                placeholder="Time Read"
              />

              <label className="form-label fw-bold">Category</label>
              <select
                className="form-control mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Business">Business</option>
                <option value="Physical Health">Physical Health</option>
                <option value="Business, Physical Health">
                  Business, Physical Health
                </option>
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
                  className="btn btn-secondary mx-1 fw-bold"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success fw-bold text-white"
                  onClick={updateCourse}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Getblogs;
