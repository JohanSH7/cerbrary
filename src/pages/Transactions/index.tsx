import React, { useEffect, useState } from 'react';
import { getUserTransactions } from '@/utils/api';
import TransactionDataTable from '@/components/organism/transactionsTable/index';
import { useSession } from 'next-auth/react'; // Asegúrate de usar un hook para obtener la sesión

const Index = () => {
    const [transactions, setTransactions] = useState([]);
    const { data: session } = useSession(); // Obtener la sesión del usuario logueado

    useEffect(() => {
    const fetchTransactions = async () => {
        if (!session) return;

        const data = await getUserTransactions(session.user.id);
        setTransactions(data);
    };
    fetchTransactions();
}, [session]);

    console.log('Filtered transactions :>> ', transactions);

    return (
        <div>
            <TransactionDataTable transactions={transactions} />
        </div>
    );
};

export default Index;