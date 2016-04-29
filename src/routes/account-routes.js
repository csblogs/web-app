import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

export default router;
