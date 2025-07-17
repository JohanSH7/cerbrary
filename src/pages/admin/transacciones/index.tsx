import React, { useEffect, useState } from 'react';
import { getUserTransactions } from '@/utils/api';
import TransactionDataTable from '@/components/organism/DataTable/index';

const Index = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getUserTransactions();
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    console.log('transactions :>> ', transactions);

    return (
        <div>
            <TransactionDataTable users={transactions} />
        </div>
    );
};

export default Index;