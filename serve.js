const http = require('http');

const todos = [
    { id: 1, text: 'Sudah' },
    { id: 2, text: 'sudah woy' },
    { id: 3, text: 'kubilang sudah woi' },
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js');

    // Mendapatkan ID dari URL yang diminta
    const urlParts = req.url.split('/');
    const id = parseInt(urlParts[1]);

    if (req.method === 'GET') {
        if (!isNaN(id)) {
            const todo = todos.find(item => item.id === id);
            if (todo) {
                const data = JSON.stringify({
                    success: true,
                    data: todo,
                });
                res.statusCode = 200; // Mengganti status code menjadi 200 OK
                res.end(data);
            } else {
                const data2 = JSON.stringify({
                    success: false,
                    error: 'Data not found',
                });
                res.statusCode = 404;
                res.end(data2);
            }
        } else {
            // Jika URL tidak sesuai format yang diharapkan
            const data2 = JSON.stringify({
                success: false,
                error: 'Invalid request',
            });
            res.statusCode = 404;
            res.end(data2);
        }
    } else if (req.method === 'POST') {
        // Mengurai data dari tubuh permintaan POST
        let body = [];
        req
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();
                const requestData = JSON.parse(body);

                // Memeriksa apakah ID dan teks disertakan dalam permintaan POST
                if (requestData.id && requestData.text) {
                    const newTodo = {
                        id: requestData.id,
                        text: requestData.text,
                    };
                    todos.push(newTodo);
                    const data = JSON.stringify({
                        success: true,
                        data: newTodo,
                    });
                    res.statusCode = 201; // Mengganti status code menjadi 201 Created
                    res.end(data);
                } else {
                    const data2 = JSON.stringify({
                        success: false,
                        error: 'ID and text are required for POST request',
                    });
                    res.statusCode = 400; // Bad Request
                    res.end(data2);
                }
            });
    } else {
        // Jika metode HTTP tidak didukung
        const data2 = JSON.stringify({
            success: false,
            error: 'Method not supported',
        });
        res.statusCode = 405; // Method Not Allowed
        res.end(data2);
    }
});

const PORT = 8808;

server.listen(PORT, () => console.log('Server berjalan pada port ' + PORT));