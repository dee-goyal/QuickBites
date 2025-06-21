import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:5000/api/createuser", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation
      })
    })

    const json = await response.json()
    console.log(json)

    if (json.success) {
      alert("Account created successfully! Please login.")
      navigate('/login')
    } else {
      alert("Enter valid credentials")
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name='name'
            value={credentials.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name='email'
            value={credentials.email}
            onChange={onChange}
            required
          />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name='password'
            value={credentials.password}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="geolocation" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="geolocation"
            name='geolocation'
            value={credentials.geolocation}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="m-3 btn btn-success">Submit</button>
        <Link to="/login" className='m-3 btn btn-danger'>Already a User</Link>
      </form>
    </div>
  )
}
