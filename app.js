const express = require('express');
const morgan = require('morgan')
const app = express(); 
const Blog = require('./models/blog')
// connect to mongodb

const dbURI = 'mongodb+srv://netNinja:pass123@cluster0.yizgi.mongodb.net/nodeHomework?retryWrites=true&w=majority'



const mongoose = require('mongoose');
const { render } = require('ejs');
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3001))
.catch((err) => console.log(err))

app.set('view engine', 'ejs')

// listen for requests
app.listen(3000);
// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));



app.get('/', (req, res) =>{
res.redirect ('/blogs')
});
app.get('/about', (req, res) =>{
    res.render('about', { title: 'about'})
    // res.send('<p>about page</p>');
});


app.get('/about-us', (req, res) => {
       res.redirect('/about');
})
// these are the blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result})
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/blogs', (req,res) => {
        const blog = new Blog(req.body)
        blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details', {blog: result, title:'Blog Details'})
           })
           .catch(err => {
               console.log(err)
           })
        })

        app.delete('/blogs/:id', (req,res) => {
            const id = req.params.id;

            Blog.findByIdAndDelete(id)
            .then(result => {
                res.json({ redirect: '/blogs'})
            })
            .catch((err) =>{
                console.log(err)
            })
        })

app.get('/blogs/create', (req,res) => {
    res.render('create' , { title: 'New Blog'});
})

app.use((req,res) => {
    res.status(404).render('404', { title: '404'})
});