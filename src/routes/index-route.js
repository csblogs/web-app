import express from 'express';
import * as indexController from '../controllers/index-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const pageNumber = (req.query.page - 1) || 0;

  indexController.getAllPosts(pageNumber)
    .then(indexController.getPostAuthors)
    .then(posts => {
      res.render('index', {
        title: 'Home',
        posts
      });
    })
    .catch(err => {
      next(err);
    });
});

export default router;
