const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');

// get all users
router.get('/', async (req, res) => {
  try {
      const posts = await Post.findAll(
          {
              attributes: ['id', 'title', 'content'],
              order: [['created_at', 'DESC']]
          }
      )

      res.status(200).json(posts);
  } catch (err) {
      // return server error message
      console.log(err);
      res.status(500).json(err);
  }
})

  
router.get('/:id', async (req, res) => {
  try {
      const posts = await Post.findByPk(req.params.id,
          {
              attributes: ['id', 'title', 'content'],
              order: [['created_at', 'DESC']],
              include: [
                  {
                      model: User,
                      attributes: ['username']
                  },
                  {
                      model: Comment,
                      attributes: ['text'],
                      include: [
                          {
                              model: User,
                              attributes: ['username']
                          }
                      ]
                  }
              ]
          }
      )

      res.status(200).json(posts);
  } catch (err) {
      // return server error message
      console.log(err);
      res.status(500).json(err);
  }
})
  
  router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.put('/upvote', (req, res) => {
    // make sure the session exists first
    if (req.session) {
      // pass session id along with all destructured properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  });
  
  router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
module.exports = router;