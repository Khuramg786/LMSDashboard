import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://springgreen-marten-185632.hostingersite.com";

const Addupcomingcourses = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATES
  // =====================================================

  const [title, setTitle] = useState("");
  const [discruption, setDiscruption] = useState("");
  const [studentenroll, setStudentenroll] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [duration, setDuration] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");

  const [whatYouWillLearn, setWhatYouWillLearn] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // ---------------------------------------------------
    // ALLOWED IMAGE TYPES
    // ---------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "❌ Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";
      setImage(null);
      setImagePreview("");

      return;
    }

    // ---------------------------------------------------
    // MAX 5 MB
    // ---------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      toast.error("❌ Image size must be less than 5 MB");

      e.target.value = "";
      setImage(null);
      setImagePreview("");

      return;
    }

    // ---------------------------------------------------
    // OLD PREVIEW CLEANUP
    // ---------------------------------------------------

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // ---------------------------------------------------
    // SET IMAGE
    // ---------------------------------------------------

    setImage(file);

    // ---------------------------------------------------
    // CREATE PREVIEW
    // ---------------------------------------------------

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =====================================================
  // WHAT YOU WILL LEARN CHANGE
  // =====================================================

  const handleLearnChange = (index, value) => {
    const updated = [...whatYouWillLearn];

    updated[index] = value;

    setWhatYouWillLearn(updated);
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async () => {
    // ===================================================
    // VALIDATION
    // ===================================================

    if (!title.trim()) {
      toast.error("❌ Course title is required");
      return;
    }

    if (!discruption.trim()) {
      toast.error("❌ Course description is required");
      return;
    }

    if (!studentenroll) {
      toast.error("❌ Student enroll count is required");
      return;
    }

    if (Number(studentenroll) < 0) {
      toast.error("❌ Student enroll count cannot be negative");
      return;
    }

    if (!image) {
      toast.error("❌ Course image is required");
      return;
    }

    if (!recordingDate) {
      toast.error("❌ Recording date is required");
      return;
    }

    if (!duration) {
      toast.error("❌ Course duration is required");
      return;
    }

    if (Number(duration) < 1) {
      toast.error("❌ Course duration must be at least 1 day");
      return;
    }

    if (!day) {
      toast.error("❌ Please select a day");
      return;
    }

    if (!time) {
      toast.error("❌ Please select a time");
      return;
    }

    // ===================================================
    // CREATE FORM DATA
    // ===================================================

    const formData = new FormData();

    // ---------------------------------------------------
    // BASIC INFORMATION
    // ---------------------------------------------------

    formData.append("title", title.trim());

    formData.append(
      "discruption",
      discruption.trim()
    );

    formData.append(
      "studentenroll",
      String(Number(studentenroll))
    );

    formData.append(
      "recordingDate",
      recordingDate
    );

    formData.append(
      "duration",
      String(Number(duration))
    );

    formData.append("day", day);

    formData.append("time", time);

    formData.append(
      "category",
      category.trim()
    );

    // ---------------------------------------------------
    // IMAGE
    // ---------------------------------------------------

    formData.append("image", image);

    // ---------------------------------------------------
    // WHAT YOU WILL LEARN
    // ---------------------------------------------------

    whatYouWillLearn
      .filter(
        (item) =>
          item &&
          item.trim() !== ""
      )
      .forEach((item) => {
        formData.append(
          "whatYouWillLearn",
          item.trim()
        );
      });

    // ===================================================
    // DEBUG FORM DATA
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "SENDING UPCOMING COURSE"
    );

    console.log(
      "===================================="
    );

    for (const [key, value] of formData.entries()) {
      if (key === "image") {
        console.log(
          "image:",
          value.name,
          value.type,
          value.size
        );
      } else {
        console.log(
          `${key}:`,
          value
        );
      }
    }

    // ===================================================
    // API REQUEST
    // ===================================================

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/upcomings/createupcoming`,
        formData,
        {
          timeout: 60000,
        }
      );

      console.log(
        "===================================="
      );

      console.log(
        "UPCOMING COURSE RESPONSE:"
      );

      console.log(
        response.data
      );

      console.log(
        "===================================="
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data?.success) {
        toast.success(
          "✅ Upcoming course added successfully!"
        );

        // Clear form
        setTitle("");
        setDiscruption("");
        setStudentenroll("");
        setRecordingDate("");
        setDuration("");
        setDay("");
        setTime("");
        setCategory("");

        setWhatYouWillLearn([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setImage(null);

        if (imagePreview) {
          URL.revokeObjectURL(
            imagePreview
          );
        }

        setImagePreview("");

        // Navigate after success
        setTimeout(() => {
          navigate(
            "/courses/Getupcomingcourses"
          );
        }, 1500);
      } else {
        toast.error(
          response.data?.message ||
            "❌ Failed to create upcoming course"
        );
      }
    } catch (error) {
      console.error(
        "===================================="
      );

      console.error(
        "UPCOMING COURSE ERROR:"
      );

      console.error(error);

      console.error(
        "SERVER RESPONSE:"
      );

      console.error(
        error.response?.data
      );

      console.error(
        "STATUS:"
      );

      console.error(
        error.response?.status
      );

      console.error(
        "===================================="
      );

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      toast.error(
        serverMessage ||
          "❌ Something went wrong while creating the course"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <h3 className="text-center my-4 fw-bold">
        Add Upcoming Course
      </h3>

      <div className="container w-50">

        {/* =================================================
            COURSE TITLE
        ================================================= */}

        <label className="form-label fw-bold">
          Course Title
        </label>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Course Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <label className="form-label fw-bold">
          Course Description
        </label>

        <textarea
          className="form-control mb-3"
          placeholder="Course Description"
          rows="4"
          value={discruption}
          onChange={(e) =>
            setDiscruption(
              e.target.value
            )
          }
        />

        {/* =================================================
            STUDENT ENROLL
        ================================================= */}

        <label className="form-label fw-bold">
          Student Enroll Count
        </label>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Student Enroll Count"
          min="0"
          value={studentenroll}
          onChange={(e) =>
            setStudentenroll(
              e.target.value
            )
          }
        />

        {/* =================================================
            CATEGORY
        ================================================= */}

        <label className="form-label fw-bold">
          Course Category
        </label>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Course Category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        />

        {/* =================================================
            COURSE IMAGE
        ================================================= */}

        <label className="form-label fw-bold">
          Course Image
        </label>

        <input
          type="file"
          className="form-control mb-2"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageChange}
        />

        <small className="text-muted d-block mb-3">
          Allowed: JPG, JPEG, PNG, WEBP — Maximum 5 MB
        </small>

        {/* =================================================
            IMAGE PREVIEW
        ================================================= */}

        {imagePreview && (
          <div className="mb-4">

            <p className="fw-bold mb-2">
              Image Preview
            </p>

            <img
              src={imagePreview}
              alt="Course Preview"
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f5f5f5",
              }}
            />

          </div>
        )}

        {/* =================================================
            RECORDING DATE
        ================================================= */}

        <label className="form-label fw-bold">
          Recording Date
        </label>

        <input
          type="date"
          className="form-control mb-3"
          value={recordingDate}
          onChange={(e) =>
            setRecordingDate(
              e.target.value
            )
          }
        />

        {/* =================================================
            DURATION
        ================================================= */}

        <label className="form-label fw-bold">
          Course Duration (in days)
        </label>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Course Duration"
          min="1"
          value={duration}
          onChange={(e) =>
            setDuration(
              e.target.value
            )
          }
        />

        {/* =================================================
            DAY
        ================================================= */}

        <label className="form-label fw-bold">
          Day
        </label>

        <select
          className="form-control mb-3"
          value={day}
          onChange={(e) =>
            setDay(e.target.value)
          }
        >
          <option value="">
            Select Day
          </option>

          <option value="Monday">
            Monday
          </option>

          <option value="Tuesday">
            Tuesday
          </option>

          <option value="Wednesday">
            Wednesday
          </option>

          <option value="Thursday">
            Thursday
          </option>

          <option value="Friday">
            Friday
          </option>

          <option value="Saturday">
            Saturday
          </option>

          <option value="Sunday">
            Sunday
          </option>
        </select>

        {/* =================================================
            TIME
        ================================================= */}

        <label className="form-label fw-bold">
          Time
        </label>

        <input
          type="time"
          className="form-control mb-3"
          value={time}
          onChange={(e) =>
            setTime(e.target.value)
          }
        />

        {/* =================================================
            WHAT YOU WILL LEARN
        ================================================= */}

        <h5 className="mt-4 mb-3">
          What You'll Learn
        </h5>

        {whatYouWillLearn.map(
          (item, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              placeholder={`Point ${index + 1}`}
              value={item}
              onChange={(e) =>
                handleLearnChange(
                  index,
                  e.target.value
                )
              }
            />
          )
        )}

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="button"
          className="btn btn-primary mt-3 mb-5 fw-bold"
          style={{
            minWidth: "150px",
          }}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading
            ? "Uploading..."
            : "Add Course"}
        </button>

      </div>
    </>
  );
};

export default Addupcomingcourses;