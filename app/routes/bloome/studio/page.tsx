import { useParams } from "react-router";


import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '~/clients/firebaseClient';

interface Assignment {
    id: string;
    classId: string;
    title: string;
    description: string;
    dueDate: Date;
    points: number;
}

const Studio: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!classId) return;

        const fetchAssignments = async () => {
            const q = query(collection(db, 'assignments'), where('classId', '==', classId));

            const snap = await getDocs(q);

            const data = snap.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Assignment, 'id'>),
            }));

            setAssignments(data);
            setLoading(false);
        };

        fetchAssignments();
    }, [classId]);

    if (!classId) return <p>Invalid class</p>;
    if (loading) return <p>Loading assignments...</p>;

    return (
        <div>
            <h2>Assignments</h2>
            <ul>
                {assignments.map((a) => (
                    <li key={a.id}>
                        <strong>{a.title}</strong>
                        <p>{a.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Studio;
