const express = require('express');
const fengari = require('fengari');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies

// Lua script execution route
app.post('/execute-lua', (req, res) => {
    const luaCode = req.body.code;

    try {
        // Execute Lua code using fengari (Lua interpreter for JavaScript)
        const result = fengari.luaL_loadstring(fengari.to_luastring(luaCode));
        if (result === 0) {
            const luaResult = fengari.lua_tostring(fengari.lua_getglobal(-1), -1);
            res.json({ result: fengari.to_jsstring(luaResult) });
        } else {
            res.json({ error: 'Error executing Lua code' });
        }
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Serve the HTML page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
