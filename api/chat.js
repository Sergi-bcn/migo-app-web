// Simple API endpoint for Vercel serverless function
module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Handle POST requests
    if (req.method === 'POST') {
        try {
            const { message } = req.body;
            
            // Simple echo response
            res.status(200).json({
                success: true,
                message: `Received: ${message}`,
                response: `This is a response to: ${message}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    } else {
        // Handle GET requests
        res.status(200).json({
            success: true,
            message: 'Chat API is running',
            endpoints: {
                POST: '/api/chat - Send a message',
                GET: '/api/chat - API status'
            }
        });
    }
};
