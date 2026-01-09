import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Addupcomingcourses = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleSubmit = async () => {
    if (!title || !price || !discruption || !discount || !studentenroll || !category || !image) {
      alert("All required fields must be filled");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("discruption", discruption);
    formData.append("price", price);
    formData.append("discount", discount);
formData.append("studentenroll", studentenroll);
    formData.append("category", category);
   formData.append("image", image);


    whatYouWillLearn.forEach((item) => {
      if (item.trim()) {
        formData.append("whatYouWillLearn[]", item);
      }
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/upcomings/createupcoming",
        formData
      );

      if (res.status === 201) {
        alert("Upcomingcourse added successfully");
        navigate('/courses/Getupcomingcourses') // ✅ FIXED PATH
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <h3 className="text-center my-4">Add Upcoming Courses</h3>

      <div className="container w-50">
        <select
          className="form-control mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Course Category</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="SEO">SEO</option>
        </select>


        <input
          className="form-control mb-2"
          placeholder="Course Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Course Description"
          rows="4"
          onChange={(e) => setDiscruption(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Course Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Course discount"
          onChange={(e) => setDiscount(e.target.value)}
        />
 <input
  type="number"
  className="form-control mb-2"
  placeholder="Student Enroll Count"
  onChange={(e) => setStudentenroll(e.target.value)}
/>

        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

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
