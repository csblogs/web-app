import express from 'express';
import * as indexController from '../controllers/index-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  indexController.test();

  res.render('index', {
    title: 'Home'
  });
});

export default router;
