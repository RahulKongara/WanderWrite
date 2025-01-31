const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const uploadMiddleware = multer({ dest: 'uploads/' });
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 4000;


const salt = bcrypt.genSaltSync(10);
const secret = process.env.secret || 'awdawdawdasdaw2134tw';
const db_url = process.env.db_url || 'mongodb+srv://admin:ye9fJnSoXrMdZBe5@cluster0.rlj1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:80",
    "https://wanderwrite-frontend.onrender.com",
];

// app.use(cors({credentials:true,origin:'https://wanderwrite-frontend.onrender.com'}));
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
const corsOptions = {
    origin: [
      'https://wanderwrite-frontend.onrender.com', // Production frontend
      'http://localhost' // Keep for local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If using cookies/auth headers
    optionsSuccessStatus: 200 // Legacy browser support
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

mongoose.connect(db_url);

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    // res.json(userDoc);
    const passOk = bcrypt.compareSync(password, userDoc.password);
    // res.json(passOk);
    if (passOk) {
        // Logged in
        
        jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
        // res.json();
    } else {
        res.status(400).json('Wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    })
    // res.json(req.cookies);
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
        // res.json(info);
    })

    // res.json({files:req.file});
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        // res.json({isAuthor, postDoc, info});
        if (!isAuthor) {
            res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title, 
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    })
});

app.get('/post', async (req, res) => {
    // const posts = await Post.find();
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
    console.log('posts sent');
})
app.listen(PORT);


app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

// mongodb+srv://admin:ye9fJnSoXrMdZBe5@cluster0.rlj1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// ye9fJnSoXrMdZBe5
