import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../db.js'; // adjust the path as needed

export const createChat = async (req, res) => {

    const { userId, friendId } = req.body;


    return res.status(200).json({ message: 'this is createChat' });

    if (!userId || !friendId) {
        return res.status(200).json({ message: 'missing userId or friendId!' });
    }


    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, userId)
            .input('FriendId', sql.Int, friendId)
            .query('INSERT INTO Chats (UserId, FriendId) VALUES (@UserId, @FriendId)');


        return res.status(200).json({ message: 'Chat created successfully' });

    } catch (err) {
        console.error('Create chat error:', err);
        return res.status(500).json({ message: 'Server error' });
    }


}
export const getChats = async (req, res) => {

    return res.status(200).json({ message: 'this is createChat' });
}
export const addChatMember = async (req, res) => {

    return res.status(200).json({ message: 'this is createChat' });
}