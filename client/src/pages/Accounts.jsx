import React from 'react'

function Accounts() {
  // Call the API to get the accounts data and display it in a table or list format.
  // Accounts management logic
  // 1. Accounts tab is limited to admin users only.
  // 2. Admin users can view, create, and delete (deactivate) user accounts.
  // 3. Accounts are staff accounts by default, Admin label is additional privilege.
  // 4. Admin can also deactivate other admin accounts, bearing that at least one admin account remains active at all times.

  const [users, setUsers] = React.useState([])

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
  return <div>Accounts</div>
}

export default Accounts
