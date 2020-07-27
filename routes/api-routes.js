// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.username
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        nickname: req.user.nickname
      });
    }
  });

  // get all the published stories
  app.get("/api/story/published", function(req, res){
    db.Story.findAll({
      where: {
        published: true
      }
    }).then(function(dbStories){
      res.json(dbStories);
    }).catch(function(err){ res.status(500).end()})
  })
  app.get("/api/story/mine", function(req, res){
    if(!req.user){
      return res.status(401).json([]);
    }
    db.Story.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(dbStories){
      res.json(dbStories);
    }).catch(function(err){ res.status(500).end()})
  })
  app.get("/api/story/edit/:id", function(req, res){
    if(!req.user){
      return res.status(401).end();
    }
    db.Story.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(dbStories => {
      res.json(dbStories);
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    });
  })
  // get a specific story
    // it's published
    // it belongs to the person requesting it
  app.get("/api/story/:id", function(req, res){
    let userId = 0;
    if(req.user){
      userId = parseInt(req.user.id) || 0
    }
    db.Story.findOne({
      where: {
        id: req.params.id,
        published: true
      }
    }).then(dbStories => {
      res.json(dbStories);
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    });
  })
  // allow a logged in user to create new stories
  app.post("/api/story", function(req, res){
    if(!req.user){
      return res.status(401).end();
    }

    const {title, body, category, published} = req.body;
    const UserId = req.user.id;
    db.Story.create({
      title,
      body,
      category,
      published,
      UserId
    }).then(dbStory => res.json(dbStory))
    .catch(err => res.json(err))
  })

  app.put("/api/story", function(req, res){
    if(!req.user){
      return res.status(401).end();
    }

    const {title, body, category, published} = req.body;
    const UserId = req.user.id;
    db.Story.update({
      title,
      body,
      category,
      published
    }, {
      where: {
        id: req.body.id,
        UserId: req.user.id
      }
    }).then(dbStory => res.json(dbStory))
    .catch(err => res.json(err))
  })

  app.delete("/api/story/:id", function(req, res){
    if(!req.user){
      return res.status(401).end();
    }

    const {title, body, category, published} = req.body;
    const UserId = req.user.id;
    db.Story.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(dbStory => res.json(dbStory))
    .catch(err => res.json(err))
  })
};
