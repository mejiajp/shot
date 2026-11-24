import React from 'react'

function AccountsTable({ users }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <p className="text-sm text-gray-500">
            Manage staff accounts and administrative privileges.
          </p>
        </div>

        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Add Account
        </button>
      </div>

      {/* Accounts Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{user.username}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">Active</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline">
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Account Count */}
      <p className="text-sm text-gray-500">Total accounts: {users.length}</p>
    </div>
  )
}

export default AccountsTable
