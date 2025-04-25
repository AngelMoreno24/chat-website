import { sql, poolPromise } from '../db.js'; // adjust the path as needed

export const addFriend = async (req, res) => {

    const { username  } = req.body;

    const userId = req.user.id;

    if(!username){
        return res(400).json({ message: 'missing username!' });  
    }
    
    try{

        const pool = await poolPromise;
        const response = await pool
            .request()
            .input('Username', sql.NVarChar, username)
            .query(`
                Select Id FROM Users Where Username = @Username
            `);


        const friendId = response.recordset[0].Id;


        if(!friendId){
            return res.status(400).json({ message: 'Friend not found!' });  
        }
        

        await pool
            .request()
            .input('UserId', sql.Int, userId )
            .input('FriendId', sql.Int, friendId)
            .query(`
                INSERT INTO Friendships (UserId, FriendId)
                VALUES (@UserId, @FriendId)
            `);

        return res.status(200).json({ message: 'Friend request sent successfully' });
    }catch(err){

        console.error('add member error:', err);
        return res.status(500).json({ message: 'Server error' });
    }

}

export const getRequests = async (req, res) => {
    const id = req.user.id;

    console.log("getRequests route hit");

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, id)
            .query(`
                SELECT 
                    f.Id AS FriendshipId,
                    f.UserId AS SenderId,
                    u.Username AS SenderUsername,
                    f.Status,
                    f.CreatedAt
                FROM Friendships f
                JOIN Users u ON f.UserId = u.Id
                WHERE f.FriendId = @UserId AND f.Status = 'pending'
            `);

        return res.status(200).json({ requests: result.recordset });

    } catch (err) {
        console.error('Get requests error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const acceptRequest = async (req, res) => {

    const { userId } = req.body;

    if(!userId){
        return res.status(400).json({ message: 'missing request id!' });  
    }

    const friendId = req.user.id;
    
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, userId)
            .input('FriendId', sql.Int, friendId)
            .query(`
                UPDATE Friendships
                SET Status = 'accepted'
                WHERE UserId = @UserId AND FriendId = @FriendId AND Status = 'pending'
            `);


        return res.status(200).json({ userId, message: 'Friend request accepted successfully' });

    } catch (err) {
        console.error('Get requests error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getFriends = async (req, res) => {
    const id = req.user.id;

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('UserId', sql.Int, id)
            .query(`
                SELECT 
                    u.Id AS FriendId,
                    u.Username
                FROM Friendships f
                JOIN Users u ON 
                    (u.Id = f.FriendId AND f.UserId = @UserId)
                    OR (u.Id = f.UserId AND f.FriendId = @UserId)
                WHERE 
                    (f.UserId = @UserId OR f.FriendId = @UserId)
                    AND f.Status = 'accepted'
            `);

        return res.status(200).json({ friends: result.recordset });
    } catch (err) {
        console.error('Get friends error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};