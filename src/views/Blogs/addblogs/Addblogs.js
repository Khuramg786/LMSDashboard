import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Addblogs = () => {
  const [title, setTitle] = useState('')
  const [descruption, setDescruption] = useState('')
  const [createdby, setCreatedby] = useState('')
  const [timeread, setTimeread] = useState('')
  const [categary, setCategary] = useState('')
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const registerProduct = async (e) => {
    e.preventDefault() // ✅ VERY IMPORTANT

    if (!title || !createdby || !categary) {
      alert('Please fill required fields')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('descruption', descruption)
      formData.append('createdby', createdby)
      formData.append('timeread', timeread)
      formData.append('categary', categary)
      if (image) formData.append('image', image)

      const res = await axios.post(
        'http://localhost:5000/blog/postbloges',
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
        Add Blogs
      </h1>

      <div className="container w-50">
        <form onSubmit={registerProduct}>
          <div className="mb-3">
            <label className="form-label fw-bold">Blog Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={descruption}
              onChange={(e) => setDescruption(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Created-By</label>
            <textarea
              className="form-control"
              type="text"
              value={createdby}
              onChange={(e) => setCreatedby(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Timeread</label>
            <input
              type="number"
              className="form-control"
              value={timeread}
              onChange={(e) => setTimeread(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <input
              type="text"
              className="form-control"
              value={categary}
              onChange={(e) => setCategary(e.target.value)}
              required
            />
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

          <button type="submit" className="btn btn-primary mt-3 mb-3 w-25 fw-bold"
          >
            ADD Blog
          </button>
        </form>
      </div>
    </>
  )
}

export default Addblogs;
