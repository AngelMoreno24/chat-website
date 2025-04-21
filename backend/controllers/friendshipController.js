import { sql, poolPromise } from '../db.js'; // adjust the path as needed

export const addFriend = async (req, res) => {

    const { friendCode  } = req.body;

    if(!friendCode){
        return res(400).json({ message: 'missing friend code!' });  
    }
    
    try{

        pool = await poolPromise;
        const response = await pool
            .request()
            .input('UserId', sql.NVarChar, UserId )
            .input('FriendId', sql.NVarChar, FriendId)
            .query(`
                Select Id FROM Users Where FriendCode = @FriendCode
            `);


        const friendId = response.recordset[0].Id;

        const id = req.user.id;

        await pool
            .request()
            .input('UserId', sql.NVarChar, UserId )
            .input('FriendId', sql.NVarChar, friendId)
            .query(`
                INSERT INTO Friendships (UserId, FriendId)
                VALUES (@UserId, @FriendId)
            `);

        return res.status(200).json({ message: 'Friend added successfully' });
    }catch(err){

        console.error('add member error:', err);
        return res.status(500).json({ message: 'Server error' });
    }

}

export const getRequests = async (req, res) => {

    
    const id = req.user.id;
    
    
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, id)
            .query(`
                SELECT * FROM Friendships WHERE FriendId = @UserId AND Status = 'pending'
            `);


            return res.status(200).json({ requests: result.recordset });
    } catch (err) {
        console.error('Get requests error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}



export const acceptRequest = async (req, res) => {

    const { userId } = req.body;

    if(!id){
        return res(400).json({ message: 'missing request id!' });  
    }

    const friendId = req.user.id;
    
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, userId)
            .input('FriendId', sql.Int, friendId)
            .query(`
                SELECT * FROM Friendships 
                WHERE (FriendId = @UserId) AND Status = 'pending'
            `);

        return res.status(200).json({ requests: result.recordset });

    } catch (err) {
        console.error('Get requests error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}