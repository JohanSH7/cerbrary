"use client"

import { useEffect, useState } from "react"
import { getUsers } from "@/utils/api"
import UserDataTable from "@/components/organism/DataTable/index"
import { DashboardLayout } from "@/components/templates/dashboardLayout"

const Index = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  console.log("users :>> ", users)

  return (
    <DashboardLayout>
      <UserDataTable users={users} />
    </DashboardLayout>
  )
}

export default Index
