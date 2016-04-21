import express from 'express';
import * as indexController from '../controllers/index-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  const pageNumber = req.query.page || 1;

  indexController.getAllPosts(pageNumber)
    .then(indexController.getPostAuthors)
    .then(result => {
      res.render('index', {
        title: 'Home',
        posts: result.posts,
        authors: result.authors
      });
    });
});

export default router;
