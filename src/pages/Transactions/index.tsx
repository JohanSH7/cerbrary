import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { withPageAuth } from '@/hooks/withPageAuth';
import { getUserTransactions } from '@/utils/api';
import TransactionDataTable from '@/components/organism/transactionsTable';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/templates/dashboardLayout'; // Ajusta la ruta si está en otro lugar

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!session) return;
            const data = await getUserTransactions(session.user.id);
            setTransactions(data);
        };
        fetchTransactions();
    }, [session]);

    return (
        <DashboardLayout>
            <TransactionDataTable transactions={transactions} />
        </DashboardLayout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async () => {
        return {
            props: {},
        };
    },
    { allowedRoles: ["USER", "ADMIN"] }
);

export default TransactionsPage;
