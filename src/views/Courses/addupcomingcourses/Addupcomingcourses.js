import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addupcomingcourses = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
  const [image, setImage] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    // Validation
    if (!title || !discruption || !price || !discount || !studentenroll || !image) {
      toast.error("❌ All required fields must be filled");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("studentenroll", studentenroll);
    formData.append("image", image);

    whatYouWillLearn.forEach((item) => {
      if (item.trim()) {
        formData.append("whatYouWillLearn[]", item);
      }
    });

    try {
      const res = await axios.post(
        "https://lms-backend-umup.onrender.com/upcomings/createupcoming",
        formData
      );

      if (res.status === 201) {
        toast.success("✅ Upcoming course added successfully!");
        setTimeout(() => navigate("/courses/Getupcomingcourses"), 1500);
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

      <h3 className="text-center my-4">Add Upcoming Courses</h3>

      <div className="container w-50">
        {/* ================= COURSE TITLE ================= */}
        <input
          className="form-control mb-2"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ================= COURSE DESCRIPTION ================= */}
        <textarea
          className="form-control mb-2"
          placeholder="Course Description"
          rows="4"
          value={discruption}
          onChange={(e) => setDiscruption(e.target.value)}
        />

        {/* ================= PRICE & DISCOUNT ================= */}
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Course Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Course Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        {/* ================= STUDENT ENROLL ================= */}
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Student Enroll Count"
          value={studentenroll}
          onChange={(e) => setStudentenroll(e.target.value)}
        />

        {/* ================= COURSE IMAGE ================= */}
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* ================= WHAT YOU WILL LEARN ================= */}
        <h5 className="mt-4">What you'll learn</h5>
        {whatYouWillLearn.map((item, index) => (
          <input
            key={index}
            className="form-control mb-2"
            placeholder={`Point ${index + 1}`}
            value={item}
            onChange={(e) => {
              const updated = [...whatYouWillLearn];
              updated[index] = e.target.value;
              setWhatYouWillLearn(updated);
            }}
          />
        ))}

        {/* ================= SUBMIT BUTTON ================= */}
        <button
          className="btn btn-primary mt-3 mb-3 w-25 fw-bold"
          onClick={handleSubmit}
        >
          Add Course
        </button>
      </div>
    </>
  );
};

export default Addupcomingcourses;
