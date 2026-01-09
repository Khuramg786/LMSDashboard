import React, { useEffect, useState } from "react";

const Getblogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states
  const [title, setTitle] = useState("");
  const [descruption, setDescruption] = useState('')
  const [createdby, setCreatedby] = useState('')
  const [timeread, setTimeread] = useState('')
  const [categary, setCategary] = useState('')
  const [image, setImage] = useState(null);

  // ================= GET COURSES ON LOAD =================
  useEffect(() => {
    fetch("http://localhost:5000/blog/getblogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data.blogs || []))
      .catch((err) => console.log("Error fetching blogs:", err));
  }, []);

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this blogs?")) return;

    // Optimistically remove from UI
    setBlogs((prev) => prev.filter((c) => c._id !== id));

    try {
      const res = await fetch(`http://localhost:5000/blog/deletebloges/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert("Delete failed: " + data.message);
        // Revert UI if delete fails
        fetchCourses();
      }
    } catch (err) {
      console.log("Error deleting Blogs:", err);
      alert("Something went wrong while deleting");
      fetchCourses(); // revert
    }
  };

  // ================= OPEN UPDATE MODAL =================
  const openModal = (blog) => {
    setCurrentId(blog._id);
    setTitle(blog.title);
    setDescruption(blog.descruption);
    setCreatedby(blog.createdby);
    setTimeread(blog.timeread);
    setCategary(blog.categary);
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE COURSE =================
  const updateCourse = async () => {
    const formData = new FormData();
formData.append("title", title);
formData.append("descruption", descruption);
formData.append("createdby", createdby);
formData.append("timeread", timeread);
formData.append("categary", categary);

    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `http://localhost:5000/blog/updateblog/${currentId}`,
        { method: "PUT", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setShowModal(false);

        // Update UI instantly without refetching
        setBlogs((prev) =>
          prev.map((c) => (c._id === currentId ? data.blogs : c))
        );
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      console.log("Error updating blogs:", err);
      alert("Something went wrong while updating");
    }
  };

  return (
    <>
      <div className="container w-75">
        <h3 className="text-center my-4 fw-bold ">
         Blogs List
        </h3>

        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Descruption</th>
              <th>createdby</th>
              <th>Timeread</th>
              <th>categary</th>
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
                      alt="course"
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
                <td colSpan="6">No courses found</td>
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
              <h5 className="fw-bold mb-3">Update Course</h5>
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
                value={descruption}
                onChange={(e) => setDescruption(e.target.value)}
                placeholder="Description"
              />
            <label className="form-label fw-bold">Created-by</label>

              <input
                className="form-control mb-2"
                value={createdby}
                onChange={(e) => setCreatedby(e.target.value)}
                placeholder="Createdby"
              />
            <label className="form-label fw-bold">Timeread</label>

              <input
                className="form-control mb-2"
                value={timeread}
                onChange={(e) => setTimeread(e.target.value)}
                placeholder="Timeread"
              />
            <label className="form-label fw-bold">Categary</label>

              <input
                className="form-control mb-2"
                value={categary}
                onChange={(e) => setCategary(e.target.value)}
                placeholder="Category"
              />
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
                <button className="btn btn-success fw-bold text-white" onClick={updateCourse}>
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

export default Getblogs;
