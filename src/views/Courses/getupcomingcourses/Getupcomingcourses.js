import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getupcomingcourses = () => {
  const [upcomingcourses, setUpcomingcourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
  const [image, setImage] = useState(null);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://lms-backend-umup.onrender.com/upcomings/getUpcoming");
      const data = await res.json();
      setUpcomingcourses(data.upcoming || []);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch upcoming courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this upcoming course?")) return;

    try {
      const res = await fetch(
        `https://lms-backend-umup.onrender.com/upcomings/deleteupcomingcourse/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        toast.success("✅ Course deleted successfully");
        fetchCourses();
      } else {
        toast.error("❌ Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong");
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (course) => {
    setCurrentId(course._id);
    setTitle(course.title);
    setDiscruption(course.discruption);
    setPrice(course.price);
    setDiscount(course.discount);
    setStudentenroll(course.studentenroll);
    setWhatYouWillLearn(course.whatYouWillLearn || []);
    setImage(null);
    setRemoveImage(false);
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateCourse = async () => {
    if (!title || !discruption || !price || !discount || !studentenroll) {
      toast.error("❌ All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("studentenroll", studentenroll);
    formData.append("removeImage", removeImage); // send flag to backend

    whatYouWillLearn.forEach((item) => {
      if (item.trim()) formData.append("whatYouWillLearn[]", item);
    });

    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `https://lms-backend-umup.onrender.com/upcomings/updateupcomingcourese/${currentId}`,
        { method: "PUT", body: formData }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Course updated successfully");
        fetchCourses();
        setShowModal(false);
      } else {
        toast.error("❌ Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container w-75">
        <h3 className="text-center my-4 fw-bold">Upcoming Courses List</h3>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Student-Enroll</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingcourses.length ? (
              upcomingcourses.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      width="70"
                      height="70"
                      style={{ borderRadius: 10, objectFit: "cover" }}
                    />
                  </td>
                  <td>{c.title}</td>
                  <td>{c.discruption}</td>
                  <td>{c.price}</td>
                  <td>{c.discount}</td>
                  <td>{c.studentenroll}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 fw-bold text-white"
                      onClick={() => openModal(c)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger mt-2 btn-sm fw-bold text-white"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No upcoming courses found</td>
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
              <h5>Update Course</h5>

              <label className="form-label fw-bold">Title</label>
              <input
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control mb-2"
                value={discruption}
                onChange={(e) => setDiscruption(e.target.value)}
              />

              <label className="form-label fw-bold">Price</label>
              <input
                className="form-control mb-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label className="form-label fw-bold">Discount</label>
              <input
                className="form-control mb-2"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />

              <label className="form-label fw-bold">Student Enroll</label>
              <input
                className="form-control mb-2"
                value={studentenroll}
                onChange={(e) => setStudentenroll(e.target.value)}
              />

              <label className="form-label fw-bold">Image</label>
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="removeImage"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="removeImage">
                  Remove existing image
                </label>
              </div>

              <label className="form-label fw-bold">What you'll learn</label>
              {whatYouWillLearn.map((item, i) => (
                <input
                  key={i}
                  className="form-control mb-2"
                  value={item}
                  placeholder={`Learn ${i + 1}`}
                  onChange={(e) => {
                    const updated = [...whatYouWillLearn];
                    updated[i] = e.target.value;
                    setWhatYouWillLearn(updated);
                  }}
                />
              ))}

              <div className="text-end">
                <button
                  className="btn btn-secondary fw-bold"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success mx-2 fw-bold text-white"
                  onClick={updateCourse}
                >
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

export default Getupcomingcourses;
