import { useState } from "react"
import UserTable from "@/components/user/UserTable";
import AdminLayout from "@/components/layout/AdminLayout"

export default function UserPage() {
    const [users, setUsers] = useState([]);
    return (
        <AdminLayout>
            <UserTable />
        </AdminLayout>
    )
}
