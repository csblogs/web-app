import express from 'express';
import * as indexController from '../controllers/index-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const pageNumber = req.query.page || 1;

  indexController.getAllPosts(pageNumber)
    .then(indexController.getPostAuthors)
    .then(posts => {
      if (posts.length === 0) {
        res.render('end-of-posts', {
          title: 'No more posts'
        });
      } else {
        res.render('index', {
          title: 'Home',
          hasLess: pageNumber > 1,
          pageNumber,
          posts
        });
      }
    })
    .catch(err => {
      next(err);
    });
});

export default router;