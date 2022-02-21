const router = require('express').Router();
const sequalize = require('../config/connection');
const { Post, User, Comment } = require('../models');



router.get('/', async (req, res) => {
    try {
        let posts = await Post.findAll(
            {
                attributes: ['title', 'id', 'content', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            }
        )

        posts = posts.map(post => post.get({ plain: true}));

        res.render('homepage', {posts, loggedIn: req.session.loggedIn, singlePost: true})
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        let post = await Post.findByPk(req.params.id,
            {
                attributes: ['title', 'id', 'content', 'created_at'],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    },
                    {
                        model: Comment,
                        attributes: ['text', 'created_at'],
                        include: [
                            {
                                model: User,
                                attributes: ['username']
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            }
        )

        post = post.get({ plain: true});
        res.render('single-post', {post, loggedIn: req.session.loggedIn, singlePost: false});
} catch (err) {
    console.log(err);
    res.status(500).json(err);
}
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) { res.redirect('/'); 
    return;        
}
res.render('login');
})

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) { res.redirect('/');
    return;
}

res.render('signup')
})

module.exports = router;

