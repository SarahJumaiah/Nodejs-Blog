import express from 'express';

const app = express();
app.use(express.json());

const port = 3000;
let users = [];
let blogs = [];


app.get('/users', (req, res) => {
    res.json(users);
});


app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already used' });
    }

    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    res.status(201).json(newUser);
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Wrong email or password' });
    }

    res.json(user);
});


app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, password } = req.body;

    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    res.json(user);
});


app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser);
});


app.post('/users/:id/blogs', (req, res) => {
    const userId = parseInt(req.params.id);
    const { title, content } = req.body;

    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const newBlog = { id: blogs.length + 1, userId, title, content };
    blogs.push(newBlog);

    res.status(201).json(newBlog);
});


app.patch('/users/:id/blogs/:blogId', (req, res) => {
    const blogId = parseInt(req.params.blogId);
    const { title, content } = req.body;

    const blog = blogs.find(blog => blog.id === blogId);
    if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
    }

    
    if (title) blog.title = title;
    if (content) blog.content = content;

    res.json(blog);
});


app.delete('/users/:id/blogs/:blogId', (req, res) => {
    const blogId = parseInt(req.params.blogId);
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);

    if (blogIndex === -1) {
        return res.status(404).json({ error: 'Blog post not found' });
    }

    const deletedBlog = blogs.splice(blogIndex, 1);
    res.json(deletedBlog);
});


app.get('/users/:id/blogs', (req, res) => {
    const userId = parseInt(req.params.id);

    const userBlogs = blogs.filter(blog => blog.userId === userId);
    res.json(userBlogs);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
