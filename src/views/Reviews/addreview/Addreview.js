import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Addviews = () => {
  const [review, setReview] = useState('')
  const [user, setUser] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const registerProduct = async (e) => {
    e.preventDefault() // ✅ VERY IMPORTANT

    if (!review || !user || !category) {
      alert('Please fill required fields')
      return
    }

    try {
      const formData = new FormData()
      formData.append('review', review)
      formData.append('user', user)
      formData.append('category', category)
      if (image) formData.append('image', image)

      const res = await axios.post(
        'http://localhost:5000/reviews/postreviews',
        formData
      )

      if (res.status === 201) {
        alert('Course added successfully!')
        navigate('/Blogs/Getblogs') // ✅ FIXED PATH
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  return (
    <>
      <h1 className="text-center my-4 fw-bold fs-4">
        Add Review
      </h1>

      <div className="container w-50">
        <form onSubmit={registerProduct}>
          <div className="mb-3">
            <label className="form-label fw-bold">Review</label>
            <input
              type="text"
              className="form-control"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">User</label>
            <input
              type="text"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>



          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
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
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3 mb-3 w-25 fw-bold">
            ADD Review
          </button>
        </form>
      </div>
    </>
  )
}

export default Addviews;
