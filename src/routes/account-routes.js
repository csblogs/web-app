import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
