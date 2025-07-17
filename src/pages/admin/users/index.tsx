import React, { useEffect, useState } from 'react';
import { getUsers } from '@/utils/api';
import UserDataTable from '@/components/organism/DataTable/index';

const Index = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        }
        fetchUsers();
    }, []);
    console.log('users :>> ', users);
    return <div>
        <UserDataTable users={users} />
    </div>
};

export default Index;