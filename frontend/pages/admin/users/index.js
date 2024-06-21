import { useState, useCallback, useEffect, useRef } from "react"
import UserTable from "@/components/user/UserTable";
import AdminLayout from "@/components/layout/AdminLayout"
import { authorizeAdmin } from "@/utils/auth";
import UserService from "@/services/user.service";

export default function UserPage({ accessToken }) {
    const [users, setUsers] = useState([]);
    const hasFetched = useRef(false);

    const fetchUsers = useCallback(async () => {
        try {
            const { users } = await UserService.getUsers(accessToken);
            if (users) {
                setUsers(users);
            }
        }
        catch (e) {
            console.log("ERROR:", e);
        }

    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchUsers();
            hasFetched.current = true;
        }
    }, []);

    return (
        <AdminLayout>
            <UserTable users={users} setUsers={setUsers} accessToken={accessToken} />
        </AdminLayout>
    )
}

export const getServerSideProps = authorizeAdmin;