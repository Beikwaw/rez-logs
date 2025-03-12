'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface LoginPageProps {
    userType: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
    const router = useRouter();
    const [role, setRole] = useState(userType);

    useEffect(() => {
        setRole(userType);
    }, [userType]);

    const handleLogin = () => {
        if (role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/student');
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <div>
                <label>
                    <input
                        type="radio"
                        value="student"
                        checked={role === 'student'}
                        onChange={() => setRole('student')}
                    />
                    Student
                </label>
                <label>
                    <input
                        type="radio"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={() => setRole('admin')}
                    />
                    Admin
                </label>
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;