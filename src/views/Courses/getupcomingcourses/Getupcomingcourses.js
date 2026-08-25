import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Getupcomingcourses = () => {
  const [upcomingcourses, setUpcomingcourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  // form states
  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  // const [price, setPrice] = useState("");
  // const [discount, setDiscount] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // new fields
  const [recordingDate, setRecordingDate] = useState("");
  const [duration, setDuration] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://pink-leopard-364778.hostingersite.com/upcomings/getUpcoming");
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
        `https://pink-leopard-364778.hostingersite.com/upcomings/deleteupcomingcourse/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Course deleted successfully");
        fetchCourses();
      } else toast.error("❌ Delete failed");
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong");
    }
  };

  // ================= OPEN MODAL =================
 const openModal = (course) => {
  console.log("UPDATE CLICKED:", course);

  setCurrentId(course._id);

  setTitle(course.title || "");
  setDiscruption(course.discruption || "");
  setStudentenroll(course.studentenroll ?? "");

  setWhatYouWillLearn(
    course.whatYouWillLearn?.length
      ? course.whatYouWillLearn
      : ["", "", "", "", "", ""]
  );

  setRemoveImage(false);

  setRecordingDate(
    course.recordingDate
      ? course.recordingDate.split("T")[0]
      : ""
  );

  setDuration(course.duration ?? "");
  setDay(course.day || "");
  setTime(course.time || "");

  setVideoUrl(course.videoUrl || "");

  setShowModal(true);
};
  // ================= UPDATE =================
const updateCourse = async () => {
  if (
    !title ||
    !discruption ||
    !studentenroll ||
    !recordingDate ||
    !duration ||
    !day ||
    !time
  ) {
    toast.error("❌ All fields are required");
    return;
  }

  const payload = {
    title,

    discruption,

    studentenroll: Number(studentenroll),

    videoUrl: videoUrl.trim(),

    recordingDate,

    duration: Number(duration),

    day,

    time,

    whatYouWillLearn:
      whatYouWillLearn.filter(
        (item) => item.trim() !== ""
      ),
  };

  console.log(
    "SENDING UPDATE DATA:",
    payload
  );

  try {
    const res = await fetch(
      `https://pink-leopard-364778.hostingersite.com/upcomings/updateupcomingcourese/${currentId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    console.log(
      "UPDATE RESPONSE:",
      data
    );

    if (data.success) {
      toast.success(
        "✅ Course updated successfully"
      );

      fetchCourses();

      setShowModal(false);
    } else {
      toast.error(
        data.message ||
          "❌ Update failed"
      );
    }
  } catch (error) {
    console.error(
      "UPDATE ERROR:",
      error
    );

    toast.error(
      "❌ Something went wrong"
    );
  }
};

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container w-100">
        <h3 className="text-center my-4 fw-bold">Upcoming Courses List</h3>

        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Video</th>
              <th>Title</th>
              <th>Description</th>
              {/* <th>Rec Course Price</th>
              <th>Live Course Price</th> */}
              <th>Student-Enroll</th>
              <th>Recording Date</th>
              <th>Duration (days)</th>
              <th>Day</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingcourses.length ? (
              upcomingcourses.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td>
                    <td>
                      {c.videoUrl ? (
                        <video
                          width="200"
                          height="120"
                          controls
                        >
                          <source src={c.videoUrl} type="video/mp4" />
                          Your browser does not support video tag
                        </video>
                      ) : (
                        <span>No Video</span>
                      )}
                    </td>
                  </td>
                  <td>{c.title}</td>
                  <td>{c.discruption}</td>
                  {/* <td>{c.price}</td>
                  <td>{c.discount}</td> */}
                  <td>{c.studentenroll}</td>
                  <td>{c.recordingDate ? c.recordingDate.split("T")[0] : "-"}</td>
                  <td>{c.duration || "-"}</td>
                  <td>{c.day || "-"}</td>
                  <td>{c.time || "-"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mx-1 mt-2 fw-bold text-white"
                      onClick={() => openModal(c)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger mt-3 btn-sm fw-bold text-white"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No upcoming courses found</td>
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
              <input className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />

              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control mb-2" value={discruption} onChange={(e) => setDiscruption(e.target.value)} />

              {/* <label className="form-label fw-bold"> Rec Course Price</label>
              <input className="form-control mb-2" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

              <label className="form-label fw-bold">Live Course Price</label>
              <input className="form-control mb-2" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} /> */}

              <label className="form-label fw-bold">Student Enroll</label>
              <input className="form-control mb-2" type="number" value={studentenroll} onChange={(e) => setStudentenroll(e.target.value)} />
              <label className="form-label fw-bold">YouTube Video Link</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Paste YouTube Link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="removeImage" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
                <label className="form-check-label" htmlFor="removeImage">Remove existing image</label>
              </div>

              <label className="form-label fw-bold">Recording Date</label>
              <input type="date" className="form-control mb-2" value={recordingDate} onChange={(e) => setRecordingDate(e.target.value)} />

              <label className="form-label fw-bold">Course Duration (in days)</label>
              <input type="number" className="form-control mb-2" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} />

              <label className="form-label fw-bold">Day</label>
              <select className="form-control mb-2" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>

              <label className="form-label fw-bold">Time</label>
              <input type="time" className="form-control mb-3" value={time} onChange={(e) => setTime(e.target.value)} />

              <label className="form-label fw-bold">What you'll learn</label>
              {whatYouWillLearn.map((item, i) => (
                <input key={i} className="form-control mb-2" value={item} placeholder={`Learn ${i + 1}`} onChange={(e) => {
                  const updated = [...whatYouWillLearn];
                  updated[i] = e.target.value;
                  setWhatYouWillLearn(updated);
                }} />
              ))}

              <div className="text-end">
                <button className="btn btn-secondary fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success mx-2 fw-bold text-white" onClick={updateCourse}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Getupcomingcourses;
