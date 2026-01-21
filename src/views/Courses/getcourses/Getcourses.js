import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getcourses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [lang, setLang] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://lms-backend-umup.onrender.com/course/getcourse");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      toast.error("❌ Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE =================
  const deleteCourse = async (id) => {

    try {
      const res = await fetch(`https://lms-backend-umup.onrender.com/course/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        toast.success("✅ Course deleted successfully!");
      } else {
        toast.error("❌ Delete failed");
      }
    } catch (err) {
      toast.error("❌ Network error");
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (course) => {
    setCurrentId(course._id);
    setTitle(course.title);
    setLevel(course.level);
    setLang(course.lang);
    setDiscruption(course.discruption);
    setPrice(course.price);
    setDiscount(course.discount);
    setCategory(course.category);
    setWhatYouWillLearn(course.whatYouWillLearn || ["", "", "", "", "", ""]);
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateCourse = async () => {
    if (!title || !discruption || !price || !category) {
      toast.error("❌ All required fields must be filled");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("level", level);
    formData.append("lang", lang);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("category", category);

    whatYouWillLearn.forEach((item) => {
      if (item.trim()) formData.append("whatYouWillLearn[]", item);
    });

    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `https://lms-backend-umup.onrender.com/course/update/${currentId}`,
        { method: "PUT", body: formData }
      );

      const data = await res.json();

      if (data.success) {
        setCourses((prev) => prev.map((c) => (c._id === currentId ? data.course : c)));
        setShowModal(false);
        toast.success("✅ Course updated successfully!");
      } else {
        toast.error("❌ Update failed");
      }
    } catch (err) {
      toast.error("❌ Network error");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container w-100">
        <h3 className="text-center my-4 fw-bold text-white">Courses List</h3>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Discruption</th>
              <th>Rec Course Price</th>
              <th>Live Course Price</th>
              <th>Level</th>
              <th>Language</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {courses.length ? (
              courses.map((c, i) => (
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
                  <td>{c.discruption.slice(0, 70)}</td>
                  <td>{c.price}</td>
                  <td>{c.discount}</td>
                  <td>{c.level}</td>
                  <td>{c.lang}</td>
                  <td>{c.category}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 mt-2 text-white fw-bold"
                      onClick={() => openModal(c)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm text-white mt-3 fw-bold"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No courses found</td>
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
              <h5 className="fw-bold mb-3">Update Course</h5>

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
                {/* <option value="Mental Wellness">Mental Wellness</option> */}
                <option value="Financial Management">Financial Management</option>
                <option value="Relation Building">Relation Building</option>
                <option value="Physical Health">Physical Health</option>
                <option value="Social Awareness">Social Awareness</option>
                <option value="Spiritual Awakening">Spiritual Awakening</option>
                <option value="Leadership Skills for Principals">Leadership Skills for Principals</option>
                <option value="6 Health Club">6 Health Club</option>
                <option value="Team Management and Business Coaching">Team Management and Business Coaching</option>
              </select>

              <label className="form-label fw-bold">Title</label>
              <input
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="form-label fw-bold">Discruption</label>
              <textarea
                className="form-control mb-2"
                value={discruption}
                onChange={(e) => setDiscruption(e.target.value)}
              />

              <label className="form-label fw-bold">Rec Course Price</label>
              <input
                className="form-control mb-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label className="form-label fw-bold">Live Course Price</label>
              <input
                className="form-control mb-2"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />

              <select
                className="form-control mb-2"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="All Level">All Level</option>
                <option value="Advanced">Advanced</option>

              </select>

              <select
                className="form-control mb-2"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="">Select Language</option>
               <option value="Urdu">Urdu</option>
          <option value="English">English</option>

              </select>

              <label className="form-label fw-bold">Image</label>
              <input
                type="file"
                className="form-control mb-3"
                onChange={(e) => setImage(e.target.files[0])}
              />

              <label className="form-label fw-bold">What you'll learn</label>
              {whatYouWillLearn.map((item, i) => (
                <input
                  key={i}
                  className="form-control mb-2"
                  placeholder={`Learn ${i + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...whatYouWillLearn];
                    updated[i] = e.target.value;
                    setWhatYouWillLearn(updated);
                  }}
                />
              ))}

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
    </>
  );
};

export default Getcourses;
