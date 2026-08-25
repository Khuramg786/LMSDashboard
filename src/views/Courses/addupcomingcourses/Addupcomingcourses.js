import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addupcomingcourses = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  // const [price, setPrice] = useState("");
  // const [discount, setDiscount] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
const [video, setVideo] = useState("");

  const [recordingDate, setRecordingDate] = useState("");
  const [duration, setDuration] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
  // Validation
  if (
    !title ||
    !discruption ||
    !studentenroll ||
    !video ||
    !recordingDate ||
    !duration ||
    !day ||
    !time
  ) {
    toast.error("❌ All required fields must be filled");
    return;
  }

  const payload = {
    title,

    discruption,

    studentenroll: Number(studentenroll),

    videoUrl: video.trim(),

    recordingDate,

    duration: Number(duration),

    day,

    time,

    whatYouWillLearn: whatYouWillLearn.filter(
      (item) => item.trim() !== ""
    ),
  };

  console.log("SENDING UPCOMING COURSE:", payload);

  try {
    const res = await axios.post(
      "https://pink-leopard-364778.hostingersite.com/upcomings/createupcoming",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("UPCOMING RESPONSE:", res.data);

    if (res.status === 201) {
      toast.success(
        "✅ Upcoming course added successfully!"
      );

      setTimeout(() => {
        navigate("/courses/Getupcomingcourses");
      }, 1500);
    }
  } catch (error) {
    console.error(
      "UPCOMING COURSE ERROR:",
      error
    );

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
        "❌ Something went wrong"
    );
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
        {/* <input
          type="number"
          className="form-control mb-2"
          placeholder="Rec Course Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Live Course Price"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        /> */}

        {/* ================= STUDENT ENROLL ================= */}
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Student Enroll Count"
          value={studentenroll}
          onChange={(e) => setStudentenroll(e.target.value)}
        />

        {/* ================= COURSE IMAGE ================= */}
 <label className="form-label fw-bold">
  Upcoming Course Video URL
</label>

<input
  type="text"
  className="form-control mb-3"
  placeholder="Paste ImageKit / YouTube Video URL"
  value={video}
  onChange={(e) => setVideo(e.target.value)}
/>

        {/* ================= RECORDING DATE & START ================= */}
        <input
          type="date"
          className="form-control mb-2"
          placeholder="Recording Date"
          value={recordingDate}
          onChange={(e) => setRecordingDate(e.target.value)}
        />
      {/* ================= COURSE DURATION ================= */}
<input
  type="number"
  className="form-control mb-2"
  placeholder="Course Duration (in days)"
  value={duration}
  onChange={(e) => setDuration(e.target.value)}
  min="1"
/>

       {/* ================= DAY SELECTOR ================= */}
<select
  className="form-control mb-2"
  value={day}
  onChange={(e) => setDay(e.target.value)}
>
  <option value="">Select Day</option>
  <option value="Monday">Monday</option>
  <option value="Tuesday">Tuesday</option>
  <option value="Wednesday">Wednesday</option>
  <option value="Thursday">Thursday</option>
  <option value="Friday">Friday</option>
  <option value="Saturday">Saturday</option>
  <option value="Sunday">Sunday</option>
</select>

        <input
          type="time"
          className="form-control mb-3"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
