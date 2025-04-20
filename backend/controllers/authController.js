import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../db.js'; // adjust the path as needed
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(200).json({ message: 'missing email or password!' });
    }

        
    try {
        const pool = await poolPromise;

        const result = await pool
        .request()
        .input('Email', sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE Email = @Email');

        const user = result.recordset[0];

        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({ message: 'Login successful', user: { id: user.Id, email: user.Email } });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

function generateFriendCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}


export const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing username, email, or password!' });
      }
  
      const pool = await poolPromise;
  
      // Check if user already exists
      const checkUser = await pool
        .request()
        .input('Email', sql.NVarChar, email)
        .input('Username', sql.NVarChar, username)
        .query('SELECT * FROM Users WHERE Email = @Email OR Username = @Username');
  
      if (checkUser.recordset.length > 0) {
        return res.status(409).json({ message: 'Email or username already in use!' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const friendCode = generateFriendCode();
  
      // Insert new user
      await pool
        .request()
        .input('Username', sql.NVarChar, username)
        .input('Email', sql.NVarChar, email)
        .input('FriendCode', sql.NVarChar, friendCode)
        .input('PasswordHash', sql.NVarChar, hashedPassword)
        .query(`
          INSERT INTO Users (Username, Email, FriendCode, PasswordHash)
          VALUES (@Username, @Email, @FriendCode, @PasswordHash)
        `);
  
      return res.status(201).json({ message: 'User registered successfully!' });
  
    } catch (err) {
      console.error('Register Error:', err);
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  };
