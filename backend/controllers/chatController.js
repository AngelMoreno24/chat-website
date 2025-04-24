import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../db.js'; // adjust the path as needed

export const createChat = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Missing name!' });
    }
  
    try {
      const pool = await poolPromise;
  
      // Insert chat and return the newly created ID
      const chatResult = await pool
        .request()
        .input('Name', sql.NVarChar, name)
        .query('INSERT INTO Conversations (Name) OUTPUT INSERTED.Id AS ChatId VALUES (@Name)');
  
      const chatId = chatResult.recordset[0].ChatId;
  
      // Add creator as participant
      await pool
        .request()
        .input('ConversationId', sql.Int, chatId)
        .input('UserId', sql.Int, req.user.id)
        .query('INSERT INTO ConversationParticipants (ConversationId, UserId) VALUES (@ConversationId, @UserId)');
  
      return res.status(200).json({ message: 'Chat created successfully', chatId });
    } catch (err) {
      console.error('Create chat error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
};



export const getChats = async (req, res) => {

    const id = req.user.id;
    if (!id) {
        return res.status(400).json({ message: 'Missing id!' });
    }


    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, id)
            .query('SELECT * FROM Conversations WHERE Id IN (SELECT ConversationId FROM ConversationParticipants WHERE UserId = @UserId)');


        return res.status(200).json({ message: 'this is getChats', chats: result.recordset });
    } catch (err) {
        console.error('Get chats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }

}
export const addChatMember = async (req, res) => {


    const { chatId, friendUsername } = req.body;

    if (!chatId || !friendUsername) {
        return res.status(400).json({ message: 'Missing chatId or friendUsername!' });
    }

    try{

        const pool = await poolPromise;

        // Get friend ID from username
        const result = await pool
            .request()
            .input('Username', sql.NVarChar, friendUsername)
            .query('SELECT Id FROM Users WHERE Username = @Username');


        const friendId = result.recordset[0].Id;

        await pool
        .request()
        .input('ConversationId', sql.Int, chatId)
        .input('UserId', sql.Int, friendId)
        .query('INSERT INTO ConversationParticipants (ConversationId, UserId) VALUES (@ConversationId, @UserId)');

        

        return res.status(200).json({ message: 'this is createChat' });

    } catch(err){
        console.error('add member error:', err);
        return res.status(500).json({ message: 'Server error' });

    }
}


export const getChatMembers = async (req, res) => {

    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({ message: 'Missing chatId!' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('ConversationId', sql.Int, chatId)
            .query(`
                SELECT u.Username 
                FROM Users u
                JOIN ConversationParticipants cp ON u.Id = cp.UserId
                WHERE cp.ConversationId = @ConversationId
            `);

        return res.status(200).json({ message: 'this is getChatMembers', members: result.recordset });
    } catch (err) {
        console.error('Get chat members error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}