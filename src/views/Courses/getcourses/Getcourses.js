import React, { useEffect, useState } from "react";

const Getcourses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // form states
  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([
    "", "", "", "", "", ""
  ]);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5000/course/getcourse");
    const data = await res.json();
    setCourses(data.courses || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    await fetch(`http://localhost:5000/course/delete/${id}`, {
      method: "DELETE",
    });

    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  // ================= OPEN MODAL =================
  const openModal = (course) => {
    setCurrentId(course._id);
    setTitle(course.title);
    setDiscruption(course.discruption);
    setPrice(course.price);
    setDiscount(course.discount);
    setCategory(course.category);
    setWhatYouWillLearn(course.whatYouWillLearn || []);
    setImage(null);
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateCourse = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("category", category);

    whatYouWillLearn.forEach((item) => {
      if (item.trim()) formData.append("whatYouWillLearn[]", item);
    });

    if (image) formData.append("image", image);

    const res = await fetch(
      `http://localhost:5000/course/update/${currentId}`,
      { method: "PUT", body: formData }
    );

    const data = await res.json();

    if (data.success) {
      setCourses((prev) =>
        prev.map((c) => (c._id === currentId ? data.course : c))
      );
      setShowModal(false);
    } else {
      alert("Update failed");
    }
  };

  return (
    <>
      <div className="container w-75">
        <h3 className="text-center my-4 fw-bold text-white">
          Courses List
        </h3>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Discruption</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>
                  <img
                    src={c.imageUrl}
                    alt=""
                    width="70"
                    height="70"
                    style={{ borderRadius: 10 }}
                  />
                </td>
                <td>{c.title}</td>
                <td>{c.discruption}</td>
                <td>{c.price}</td>
                <td>{c.discount}</td>
                <td>{c.category}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mx-1 text-white fw-bold"
                    onClick={() => openModal(c)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm text-white fw-bold"
                    onClick={() => deleteCourse(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#0009" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Update Course</h5>
              <label className="form-label fw-bold">Blog Title</label>
              <select
                className="form-control mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="SEO">SEO</option>
              </select>
              <label className="form-label fw-bold">Title</label>
              <input className="form-control mb-2" value={title}
                onChange={(e) => setTitle(e.target.value)} />
              <label className="form-label fw-bold">Discruption</label>
              <textarea className="form-control mb-2" value={discruption}
                onChange={(e) => setDiscruption(e.target.value)} />
              <label className="form-label fw-bold">Price</label>
              <input className="form-control mb-2" value={price}
                onChange={(e) => setPrice(e.target.value)} />
              <label className="form-label fw-bold">Discount</label>
              <input className="form-control mb-2" value={discount}
                onChange={(e) => setDiscount(e.target.value)} />

              <label className="form-label fw-bold">Image</label>

              <input type="file" className="form-control mb-3"
                onChange={(e) => setImage(e.target.files[0])} />
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
                <button className="btn btn-secondary mx-1 fw-bold"
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success fw-bold text-white"
                  onClick={updateCourse}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Getcourses;
