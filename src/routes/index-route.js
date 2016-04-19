import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  });
});

export default router;
