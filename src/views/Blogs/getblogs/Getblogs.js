import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import truncate from "html-truncate";

const Getblogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states for update
  const [title, setTitle] = useState("");
  const [descruption, setDescruption] = useState("");
  const [createdby, setCreatedby] = useState("");
  const [timeread, setTimeread] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
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
    fetchBlogs();
  }, []);

  // ================= DELETE BLOG =================
  const deleteBlog = async (id) => {

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

  // ================= OPEN UPDATE MODAL =================
  const openModal = (blog) => {
    setCurrentId(blog._id);
    setTitle(blog.title);
    setDescruption(blog.descruption); // HTML string from backend
    setCreatedby(blog.createdby);
    setTimeread(blog.timeread);
    setCategory(blog.categary);
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE BLOG =================
  const updateBlog = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("descruption", descruption);
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
      <div className="container w-100">
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
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt="blog"
                        width="70"
                        height="70"
                        style={{ borderRadius: 10, objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{c.title}</td>
                  {/* Short preview without HTML tags */}

                  <td>
                    <div
                      dangerouslySetInnerHTML={{ __html: truncate(c.descruption, 70) }}
                    />
                  </td>
                  <td>{c.createdby}</td>
                  <td>{c.timeread}</td>
                  <td>{c.categary}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 mt-2 fw-bold text-white"
                      onClick={() => openModal(c)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm mt-3 fw-bold text-white"
                      onClick={() => deleteBlog(c._id)}
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
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
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
              <ReactQuill
                theme="snow"
                value={descruption}
                onChange={setDescruption}
                placeholder="Write your blog here..."
              />

              <label className="form-label fw-bold mt-2">Created By</label>
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
                <option value="Business, Physical Health"> Business, Physical Health</option>
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
                <option value="6 Health Club">6 Health Club</option>
                <option value="Team Management and Business Coaching">Team Management and Business Coaching</option>
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
                  onClick={updateBlog}
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
