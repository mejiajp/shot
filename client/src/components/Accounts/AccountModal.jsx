import React, { useState } from 'react'
import Modal from '../Modal'
import { createUser } from '../../api/users'

function AccountModal({ isVisible, onClose, onUserCreated }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'BASIC',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const newUser = await createUser(formData)

      onUserCreated(newUser)

      setFormData({
        username: '',
        password: '',
        role: 'BASIC',
      })

      onClose()
    } catch (error) {
      console.error('Failed to create account:', error)
      setError(error.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isVisible={isVisible} onClose={loading ? undefined : onClose}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Add Account</h2>
          <p className="text-sm text-gray-500">
            Create a new staff or administrator account.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>

          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            autoComplete="off"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Account Role
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          >
            <option value="BASIC">Staff (BASIC)</option>
            <option value="ADMIN">Administrator (ADMIN)</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AccountModal
