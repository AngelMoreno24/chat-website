import { sql, poolPromise } from '../db.js'; // adjust the path as needed


export const sendMessage = async (req, res) => {

    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
        return res.status(400).json({ message: 'Missing conversationId or message!' });
    }

    const SenderId = req.user.id;
    try{

        const pool = await poolPromise;

        await pool.request()
            .input('ConversationId', sql.Int, conversationId)
            .input('SenderId', sql.Int, SenderId)
            .input('Content', sql.NVarChar, message)
            .query(`
                INSERT INTO Messages (ConversationId, SenderId, Content)
                VALUES (@ConversationId, @SenderId, @Content)
            `);


        return res.status(200).json({ message: 'Message sent successfully' });
    }catch(err){
            
            console.error('send message error:', err);
            return res.status(500).json({ message: 'Server error' });
    }
}



export const getMessages = async (req, res) => {

    const { conversationId } = req.body;

    try{

        const pool = await poolPromise;

        const result = await pool.request()
            .input('ConversationId', sql.Int, conversationId)
            .query(`
                SELECT * FROM Messages
                WHERE (ConversationId = @ConversationId)
            `);

            return res.status(200).json({ message: 'this is getMessages', messages: result.recordset });
    }catch(err){
            
            console.error('send message error:', err);
            return res.status(500).json({ message: 'Server error' });
    }
}