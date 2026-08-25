import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Getcourses = () => {
  const [courses, setCourses] = useState([]);
  const [hasMoved, setHasMoved] = useState(false); // Tracks sequence changes
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  
  // Form states
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [lang, setLang] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(["", "", "", "", "", ""]);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://pink-leopard-364778.hostingersite.com/course/getcourse");
      const data = await res.json();
      setCourses(data.courses || []);
      setHasMoved(false); // Reset sequence button state on reload
    } catch (err) {
      toast.error("❌ Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DRAG AND DROP HANDLE =================
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside the list

    const reorderedCourses = Array.from(courses);
    const [reorderedItem] = reorderedCourses.splice(result.source.index, 1);
    reorderedCourses.splice(result.destination.index, 0, reorderedItem);

    setCourses(reorderedCourses);
    setHasMoved(true); // Shows the Action Update Sequence button
  };

  // ================= SAVE SEQUENTIAL ORDER =================
// ================================== SAVE SEQUENTIAL ORDER ===================
const saveCourseSequence = async () => {
  setIsSaving(true);
  try {
    // Hum har course ko uske naye array index (position order) ke sath clean payload me bhejenge
    for (let index = 0; index < courses.length; index++) {
      const courseItem = courses[index];
      
      // Clean explicit payload bana rahe hain taaki controller me direct $set update ho sake
      const payload = {
        title: courseItem.title,
        discruption: courseItem.discruption,
        price: courseItem.price !== "" ? Number(courseItem.price) : 0,
        discount: courseItem.discount !== "" ? Number(courseItem.discount) : 0,
        level: courseItem.level,
        lang: courseItem.lang,
        category: courseItem.category,
        mediaUrl: (courseItem.mediaUrl || courseItem.videoUrl || "").trim(),
        videoUrl: (courseItem.mediaUrl || courseItem.videoUrl || "").trim(),
        whatYouWillLearn: courseItem.whatYouWillLearn,
        order: index // 🚀 Yeh index database me 0, 1, 2 permanently overwrite karega
      };

      // Ensure karein ki URL right environment endpoint standard me ho
      // Agar aap locally run kar rahe hain to localhost use karein, production ke liye new.lifechangersclub.pk
      const targetUrl = window.location.hostname === "localhost" 
        ? `https://pink-leopard-364778.hostingersite.com/course/update/${courseItem._id}`
        : `https://pink-leopard-364778.hostingersite.com/course/update/${courseItem._id}`;

      await fetch(targetUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });
    }

    toast.success("🚀 Sequence Order Permanently Saved in Database!");
    setHasMoved(false); // Alert warning bar hide karein
    
    // Sabse important step: Backend se sorted data dobara fresh load karein
    await fetchCourses(); 
    
  } catch (error) {
    console.error("Sequence save error:", error);
    toast.error("❌ Failed to lock sequence layout order");
  } finally {
    setIsSaving(false);
  }
};
  // ================= HELPER FUNCTION TO DETECT AND RENDER MEDIA =================
  const renderMedia = (url, width = "180", height = "100") => {
    if (!url) return "No Media";

    const cleanUrl = url.trim().toLowerCase();

    // 1. YOUTUBE DETECTION
    const isYouTube = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be");

    if (isYouTube) {
      let videoId = "";
      if (cleanUrl.includes("shorts/")) {
        videoId = url.split("shorts/")[1]?.split(/[?&]/)[0];
      } else if (cleanUrl.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (cleanUrl.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      } else if (cleanUrl.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split(/[?&]/)[0];
      }

      if (videoId) {
        return (
          <iframe
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px" }}
          ></iframe>
        );
      }
    }

    // 2. DIRECT VIDEO FILES
    if (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg") ||
      cleanUrl.includes(".mp4?") || 
      cleanUrl.includes("video")
    ) {
      return (
        <video
          width={width}
          height={height}
          controls
          style={{ borderRadius: "10px", objectFit: "cover" }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support video.
        </video>
      );
    }

    // 3. DEFAULT FALLBACK: IMAGE
    return (
      <img
        src={url}
        alt="Course Thumbnail"
        width={width}
        height={height}
        style={{ borderRadius: "10px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.parentNode.innerText = "Invalid Link";
        }}
      />
    );
  };

  // ================= DELETE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`https://pink-leopard-364778.hostingersite.com/course/delete/${id}`, {
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
    setTitle(course.title || "");
    setLevel(course.level || "");
    setLang(course.lang || "");
    setDiscruption(course.discruption || "");
    setPrice(course.price || "");
    setDiscount(course.discount || "");
    setCategory(course.category || "");
    setWhatYouWillLearn(course.whatYouWillLearn || ["", "", "", "", "", ""]);
    setMediaUrl(course.mediaUrl || course.videoUrl || "");
    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateCourse = async () => {
    const payload = {
      title,
      level,
      lang,
      discruption,
      price: price !== "" ? Number(price) : 0,
      discount: discount !== "" ? Number(discount) : 0,
      category,
      mediaUrl: mediaUrl.trim(),
      videoUrl: mediaUrl.trim(), 
      whatYouWillLearn
    };

    try {
      const res = await fetch(
        `https://pink-leopard-364778.hostingersite.com/course/update/${currentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Course Updated Successfully!");
        setShowModal(false);
        fetchCourses();
      } else {
        toast.error("❌ Update failed: " + data.message);
      }
    } catch (err) {
      toast.error("❌ Network error during update");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container w-100">
        <h3 className="text-center my-4 fw-bold text-dark">Courses List</h3>
        
        {/* Dynamic Contextual Trigger Action Button - Show when list item changes order */}
        {hasMoved && (
          <div className="alert alert-warning d-flex justify-content-between align-middle align-items-center shadow-sm border-0 my-3">
            <span>⚠️ Course sequence has been modified. Save configuration permanently?</span>
            <button 
              className="btn btn-success fw-bold text-white shadow-sm"
              onClick={saveCourseSequence}
              disabled={isSaving}
            >
              {isSaving ? "Saving Sequence..." : "💾 Save Sequence Order"}
            </button>
          </div>
        )}

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <table className="table table-bordered text-center align-middle bg-white shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Drag</th>
                <th>#</th>
                <th>Preview Media</th>
                <th>Title</th>
                <th>Description</th>
                <th>Rec Course Price</th>
                <th>Live Course Price</th>
                <th>Level</th>
                <th>Language</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>

            <Droppable droppableId="courses-table-body">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {courses.length ? (
                    courses.map((c, i) => (
                      <Draggable key={c._id} draggableId={c._id} index={i}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? "#f8f9fa" : "transparent",
                              boxShadow: snapshot.isDragging ? "0 4px 8px rgba(0,0,0,0.12)" : "none",
                            }}
                          >
                            {/* Drag handle identifier area */}
                            <td {...provided.dragHandleProps} className="text-muted" style={{ cursor: "grab" }}>
                              ⣿
                            </td>
                            <td>{i + 1}</td>
                            <td>{renderMedia(c.mediaUrl || c.videoUrl)}</td>
                            <td className="fw-semibold">{c.title}</td>
                            <td>{c.discruption ? c.discruption.slice(0, 70) + "..." : ""}</td>
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
                                className="btn btn-danger btn-sm text-white mt-2 fw-bold"
                                onClick={() => deleteCourse(c._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">No courses found</td>
                    </tr>
                  )}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ background: "#0009", overflowY: "auto" }}>
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
                <option value="Mental Wellness">Mental Wellness</option>
                <option value="Financial Management">Financial Management</option>
                <option value="Relation Building">Relation Building</option>
                <option value="Physical Health">Physical Health</option>
                <option value="Social Awareness">Social Awareness</option>
                <option value="Spiritual Awakening">Spiritual Awakening</option>
                <option value="Leadership Skills for Principals">Leadership Skills for Principals</option>
                <option value="Team Management and Business Coaching">Business Coaching</option>
              </select>

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

              <label className="form-label fw-bold">Rec Course Price</label>
              <input
                type="number"
                className="form-control mb-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label className="form-label fw-bold">Live Course Price</label>
              <input
                type="number"
                className="form-control mb-2"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />

              <label className="form-label fw-bold">Level</label>
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

              <label className="form-label fw-bold">Language</label>
              <select
                className="form-control mb-2"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="">Select Language</option>
                <option value="Urdu">Urdu</option>
                <option value="English">English</option>
              </select>

              <label className="form-label fw-bold">Media URL (Image or Video Link)</label>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Paste Image or Video Link here"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
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

              <div className="text-end mt-3">
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