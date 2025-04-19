

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password ) {
        res.status(200).json({ message: 'missing email or password!' });
    }
    
    // Here you would typically check the credentials against a database
    if (email === 'admin' && password === 'password') {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}


export const register = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password ) {
        res.status(200).json({ message: 'missing email or password!' });
    }

    // Here you would typically check the credentials against a database
    if (email === 'admin' && password === 'password') {
        res.status(200).json({ message: 'register successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
}

