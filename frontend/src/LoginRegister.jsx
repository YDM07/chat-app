// src/LoginRegister.jsx
import React, { useState } from 'react';
import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

function LoginRegister({ onAuthSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        let userCredential;
        if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        }

        onAuthSuccess(userCredential.user);
    } catch (err) {
        setError(err.message);
    }
    };

    return (
    <div style={styles.container}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
        />
        <button type="submit" style={styles.button}>
            {isRegistering ? 'Register' : 'Login'}
        </button>
        </form>
        <p style={{ color: 'red' }}>{error}</p>
        <p>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
            {isRegistering ? 'Login' : 'Register'}
        </button>
        </p>
    </div>
    );
}

const styles = {
    container: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    textAlign: 'center',
    fontFamily: 'Arial',
    },
    form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    },
    input: {
    padding: '10px',
    fontSize: '16px',
    },
    button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#2c7be5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    },
    toggleButton: {
    background: 'none',
    border: 'none',
    color: '#2c7be5',
    cursor: 'pointer',
    marginLeft: '8px',
    },
};

export default LoginRegister;
