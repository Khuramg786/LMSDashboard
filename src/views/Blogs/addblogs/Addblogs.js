import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Addblogs = () => {
  const [title, setTitle] = useState('')
  const [descruption, setDescruption] = useState('')
  const [createdby, setCreatedby] = useState('')
  const [timeread, setTimeread] = useState('')
  const [categary, setCategary] = useState('')
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const registerProduct = async (e) => {
    e.preventDefault()

    if (!title || !createdby || !categary) {
      toast.error('⚠️ Please fill required fields')
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
        'https://lms-backend-umup.onrender.com/blog/postbloges',
        formData
      )

      if (res.status === 201) {
        toast.success('✅ Blog added successfully!', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored"
        })

        setTimeout(() => {
          navigate('/Blogs/Getblogs')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      toast.error('❌ Something went wrong')
    }
  }

  return (
    <>
      {/* 🔔 TOAST CONTAINER */}
      <ToastContainer />

      <h1 className="text-center my-4 fw-bold fs-4">Add Blogs</h1>

      <div className="container w-50">
        <form onSubmit={registerProduct}>
          <div className="mb-3">
            <label className="form-label fw-bold">Blog Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label className="form-label fw-bold">Created By</label>
            <input
              className="form-control"
              value={createdby}
              onChange={(e) => setCreatedby(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Time Read</label>
            <input
              type="number"
              className="form-control"
              value={timeread}
              onChange={(e) => setTimeread(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-control"
              value={categary}
              onChange={(e) => setCategary(e.target.value)}
            >
              <option value="">Select Course Category</option>
              <option value="Business">Business</option>
              <option value="Physical Health">Physical Health</option>
              <option value="Business, Physical Health">
                Business, Physical Health
              </option>
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

          <button className="btn btn-primary w-25 fw-bold">
            ADD Blog
          </button>
        </form>
      </div>
    </>
  )
}

export default Addblogs
