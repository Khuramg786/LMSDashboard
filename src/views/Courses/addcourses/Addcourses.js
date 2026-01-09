import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourses = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [lang, setLang] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    // Validation
    if (!title || !discruption || !price || !level || !lang || !category || !image) {
      toast.error("❌ All required fields must be filled");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("level", level);
    formData.append("lang", lang);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("category", category);
    formData.append("image", image);

    whatYouWillLearn.forEach((item) => {
      if (item.trim()) {
        formData.append("whatYouWillLearn[]", item);
      }
    });

    try {
      const res = await axios.post(
        "https://lms-backend-umup.onrender.com/course/upload",
        formData
      );

      if (res.status === 201) {
        toast.success("✅ Course added successfully!");
        setTimeout(() => navigate("/Courses/Getcourses"), 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="text-center my-4">Add Courses</h3>

      <div className="container w-50">
        {/* ================= CATEGORY SELECT ================= */}
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

        {/* ================= PRICE AND DISCOUNT ================= */}
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

export default AddCourses;
