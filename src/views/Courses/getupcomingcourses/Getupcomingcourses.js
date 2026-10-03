
import React, {
  useEffect,
  useState,
} from "react";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const API_URL =
  "https://springgreen-marten-185632.hostingersite.com";

const Getupcomingcourses = () => {
  // =====================================================
  // COURSES
  // =====================================================

  const [
    upcomingcourses,
    setUpcomingcourses,
  ] = useState([]);

  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [currentId, setCurrentId] =
    useState(null);

  // =====================================================
  // FORM STATES
  // =====================================================

  const [title, setTitle] =
    useState("");

  const [discruption, setDiscruption] =
    useState("");

  const [
    studentenroll,
    setStudentenroll,
  ] = useState("");

  const [
    recordingDate,
    setRecordingDate,
  ] = useState("");

  const [duration, setDuration] =
    useState("");

  const [day, setDay] =
    useState("");

  const [time, setTime] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    whatYouWillLearn,
    setWhatYouWillLearn,
  ] = useState([
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

  const [currentImage, setCurrentImage] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${API_URL}/upcomings/getUpcoming`
      );

      const data =
        await res.json();

      console.log(
        "GET UPCOMING RESPONSE:",
        data
      );

      if (data.success) {
        setUpcomingcourses(
          data.upcoming || []
        );
      } else {
        toast.error(
          data.message ||
            "❌ Failed to fetch courses"
        );
      }
    } catch (error) {
      console.error(
        "FETCH COURSES ERROR:",
        error
      );

      toast.error(
        "❌ Failed to fetch upcoming courses"
      );
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const deleteCourse = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this upcoming course?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/upcomings/deleteupcomingcourse/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await res.json();

      console.log(
        "DELETE RESPONSE:",
        data
      );

      if (data.success) {
        toast.success(
          "✅ Course deleted successfully"
        );

        fetchCourses();
      } else {
        toast.error(
          data.message ||
            "❌ Delete failed"
        );
      }
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      toast.error(
        "❌ Something went wrong"
      );
    }
  };

  // =====================================================
  // OPEN UPDATE MODAL
  // =====================================================

  const openModal = (
    course
  ) => {
    console.log(
      "UPDATE CLICKED:",
      course
    );

    setCurrentId(
      course._id
    );

    // =========================
    // COURSE DATA
    // =========================

    setTitle(
      course.title || ""
    );

    setDiscruption(
      course.discruption || ""
    );

    setStudentenroll(
      course.studentenroll ??
        ""
    );

    setCategory(
      course.category || ""
    );

    setRecordingDate(
      course.recordingDate
        ? course.recordingDate.split(
            "T"
          )[0]
        : ""
    );

    setDuration(
      course.duration ?? ""
    );

    setDay(
      course.day || ""
    );

    setTime(
      course.time || ""
    );

    // =========================
    // WHAT YOU WILL LEARN
    // =========================

    setWhatYouWillLearn(
      course.whatYouWillLearn
        ?.length
        ? [
            ...course.whatYouWillLearn,
          ]
        : [
            "",
            "",
            "",
            "",
            "",
            "",
          ]
    );

    // =========================
    // CURRENT IMAGE
    // =========================

    setCurrentImage(
      course.imageUrl || ""
    );

    // =========================
    // RESET NEW IMAGE
    // =========================

    setImage(null);

    setImagePreview("");

    setShowModal(true);
  };

  // =====================================================
  // HANDLE NEW IMAGE
  // =====================================================

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "❌ Only JPG, JPEG, PNG and WEBP images are allowed"
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "❌ Image size must be less than 5 MB"
      );

      e.target.value = "";

      return;
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setImagePreview(
      previewUrl
    );
  };

  // =====================================================
  // UPDATE COURSE
  // =====================================================

  const updateCourse =
    async () => {
      // =========================
      // VALIDATION
      // =========================

      if (!title.trim()) {
        toast.error(
          "❌ Course title is required"
        );
        return;
      }

      if (!discruption.trim()) {
        toast.error(
          "❌ Course description is required"
        );
        return;
      }

      if (!studentenroll) {
        toast.error(
          "❌ Student enroll count is required"
        );
        return;
      }

      if (!recordingDate) {
        toast.error(
          "❌ Recording date is required"
        );
        return;
      }

      if (!duration) {
        toast.error(
          "❌ Course duration is required"
        );
        return;
      }

      if (!day) {
        toast.error(
          "❌ Please select a day"
        );
        return;
      }

      if (!time) {
        toast.error(
          "❌ Please select a time"
        );
        return;
      }

      if (!currentId) {
        toast.error(
          "❌ Course ID is missing"
        );
        return;
      }

      // =========================
      // FORM DATA
      // =========================

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "discruption",
        discruption.trim()
      );

      formData.append(
        "studentenroll",
        Number(studentenroll)
      );

      formData.append(
        "recordingDate",
        recordingDate
      );

      formData.append(
        "duration",
        Number(duration)
      );

      formData.append(
        "day",
        day
      );

      formData.append(
        "time",
        time
      );

      formData.append(
        "category",
        category.trim()
      );

      // =========================
      // NEW IMAGE
      // =========================

      // IMPORTANT:
      // If user doesn't select new image,
      // old image will remain.

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      // =========================
      // WHAT YOU WILL LEARN
      // =========================

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

      try {
        setLoading(true);

        console.log(
          "UPDATING COURSE:",
          currentId
        );

        const res =
          await fetch(
            `${API_URL}/upcomings/updateupcomingcourese/${currentId}`,
            {
              method: "PUT",
              body: formData,
            }
          );

        const data =
          await res.json();

        console.log(
          "UPDATE RESPONSE:",
          data
        );

        if (data.success) {
          toast.success(
            "✅ Course updated successfully"
          );

          // Clear preview URL
          if (imagePreview) {
            URL.revokeObjectURL(
              imagePreview
            );
          }

          setShowModal(false);

          setImage(null);

          setImagePreview("");

          fetchCourses();
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
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setShowModal(false);

    setImage(null);

    setImagePreview("");

    setCurrentImage("");
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

      <div className="container-fluid">
        <h3 className="text-center my-4 fw-bold">
          Upcoming Courses List
        </h3>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>

                <th>Image</th>

                <th>Title</th>

                <th>Description</th>

                <th>Category</th>

                <th>Student Enroll</th>

                <th>Recording Date</th>

                <th>Duration</th>

                <th>Day</th>

                <th>Time</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {upcomingcourses.length >
              0 ? (
                upcomingcourses.map(
                  (course, index) => (
                    <tr
                      key={
                        course._id
                      }
                    >
                      {/* NUMBER */}

                      <td>
                        {index + 1}
                      </td>

                      {/* IMAGE */}

                      <td>
                        {course.imageUrl ? (
                          <img
                            src={
                              course.imageUrl
                            }
                            alt={
                              course.title ||
                              "Course"
                            }
                        style={{
  width: "160px",
  aspectRatio: "4 / 5",
  objectFit: "contain",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "#f5f5f5",
}}
                          />
                        ) : (
                          <span className="text-muted">
                            No Image
                          </span>
                        )}
                      </td>

                      {/* TITLE */}

                      <td>
                        {course.title ||
                          "-"}
                      </td>

                      {/* DESCRIPTION */}

                      <td
                        style={{
                          minWidth:
                            "200px",
                        }}
                      >
                        {course.discruption ||
                          "-"}
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {course.category ||
                          "-"}
                      </td>

                      {/* STUDENT */}

                      <td>
                        {
                          course.studentenroll
                        }
                      </td>

                      {/* RECORDING DATE */}

                      <td>
                        {course.recordingDate
                          ? course.recordingDate.split(
                              "T"
                            )[0]
                          : "-"}
                      </td>

                      {/* DURATION */}

                      <td>
                        {course.duration
                          ? `${course.duration} days`
                          : "-"}
                      </td>

                      {/* DAY */}

                      <td>
                        {course.day ||
                          "-"}
                      </td>

                      {/* TIME */}

                      <td>
                        {course.time ||
                          "-"}
                      </td>

                      {/* ACTION */}

                      <td>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm mx-1 mb-2 fw-bold text-white"
                          onClick={() =>
                            openModal(
                              course
                            )
                          }
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm fw-bold text-white"
                          onClick={() =>
                            deleteCourse(
                              course._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="py-4"
                  >
                    No upcoming courses
                    found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          UPDATE MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="modal d-block"
          style={{
            background:
              "rgba(0,0,0,0.6)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Update Upcoming Course
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={
                    closeModal
                  }
                ></button>
              </div>

              {/* =================================================
                  MODAL BODY
              ================================================= */}

              <div className="modal-body">
                {/* TITLE */}

                <label className="form-label fw-bold">
                  Course Title
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

                {/* DESCRIPTION */}

                <label className="form-label fw-bold">
                  Course Description
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  value={
                    discruption
                  }
                  onChange={(e) =>
                    setDiscruption(
                      e.target.value
                    )
                  }
                />

                {/* STUDENT */}

                <label className="form-label fw-bold">
                  Student Enroll
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-control mb-3"
                  value={
                    studentenroll
                  }
                  onChange={(e) =>
                    setStudentenroll(
                      e.target.value
                    )
                  }
                />

                {/* CATEGORY */}

                <label className="form-label fw-bold">
                  Course Category
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                />

                {/* =================================================
                    CURRENT IMAGE
                ================================================= */}

                <label className="form-label fw-bold">
                  Current Course Image
                </label>

                {currentImage ? (
                  <div className="mb-3">
                    <img
                      src={
                        currentImage
                      }
                      alt="Current Course"
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
                ) : (
                  <p className="text-muted">
                    No current image
                  </p>
                )}

                {/* =================================================
                    NEW IMAGE
                ================================================= */}

                <label className="form-label fw-bold">
                  Change Course Image
                </label>

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                />

                <small className="text-muted d-block mb-3">
                  Leave empty if you want to keep
                  the current image.
                  <br />
                  Allowed: JPG, JPEG, PNG,
                  WEBP — Maximum 5 MB.
                </small>

                {/* NEW IMAGE PREVIEW */}

                {imagePreview && (
                  <div className="mb-4">
                    <p className="fw-bold">
                      New Image Preview
                    </p>

                    <img
                      src={
                        imagePreview
                      }
                      alt="New Preview"
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

                {/* RECORDING DATE */}

                <label className="form-label fw-bold">
                  Recording Date
                </label>

                <input
                  type="date"
                  className="form-control mb-3"
                  value={
                    recordingDate
                  }
                  onChange={(e) =>
                    setRecordingDate(
                      e.target.value
                    )
                  }
                />

                {/* DURATION */}

                <label className="form-label fw-bold">
                  Course Duration (in days)
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control mb-3"
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                />

                {/* DAY */}

                <label className="form-label fw-bold">
                  Day
                </label>

                <select
                  className="form-control mb-3"
                  value={day}
                  onChange={(e) =>
                    setDay(
                      e.target.value
                    )
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

                {/* TIME */}

                <label className="form-label fw-bold">
                  Time
                </label>

                <input
                  type="time"
                  className="form-control mb-3"
                  value={time}
                  onChange={(e) =>
                    setTime(
                      e.target.value
                    )
                  }
                />

                {/* =================================================
                    WHAT YOU WILL LEARN
                ================================================= */}

                <label className="form-label fw-bold">
                  What You'll Learn
                </label>

                {whatYouWillLearn.map(
                  (
                    item,
                    index
                  ) => (
                    <input
                      key={index}
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Learn ${
                        index + 1
                      }`}
                      value={
                        item
                      }
                      onChange={(
                        e
                      ) => {
                        const updated =
                          [
                            ...whatYouWillLearn,
                          ];

                        updated[
                          index
                        ] =
                          e.target.value;

                        setWhatYouWillLearn(
                          updated
                        );
                      }}
                    />
                  )
                )}
              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold"
                  disabled={
                    loading
                  }
                  onClick={
                    closeModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success fw-bold text-white"
                  disabled={
                    loading
                  }
                  onClick={
                    updateCourse
                  }
                >
                  {loading
                    ? "Updating..."
                    : "Save Changes"}
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

