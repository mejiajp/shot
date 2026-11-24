import { useState, useEffect } from 'react'
import AccountsTable from '../components/Accounts/AccountsTable'
import { getUsers } from '../api/users'
function Accounts() {
  // Call the API to get the accounts data and display it in a table or list format.
  // Accounts management logic
  // 1. Accounts tab is limited to admin users only.
  // 2. Admin users can view, create, and delete (deactivate) user accounts.
  // 3. Accounts are staff accounts by default, Admin label is additional privilege.
  // 4. Admin can also deactivate other admin accounts, bearing that at least one admin account remains active at all times.

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <p>Loading users...</p>
  }

  console.log(users)
  return (
    <div className="p-6 space-y-6">
      <AccountsTable users={users} />
    </div>
  )
}

export default Accounts
