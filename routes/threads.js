const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/users');
const Thread = require('../models/thread');

const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');

router.get("/:threadId", checkAuth, (req, res, next) => {
	const id = req.params.threadId;
	console.log(id);
  Thread.findById(id)
    .select()
    .exec()
    .then(thread => {
      console.log("From database", thread);
      if(thread) {
        res.status(200).json({
						thread: thread,
            request: {
                type: 'GET',
                url: '/thread/'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:email", checkAuth, (req, res, next) => {
  Thread.find()
    .where(Thread.email = req.params.email)
    .select()
    .exec()
    .then(threads => {
      const response = {
        count: threads.length,
        threads: threads.map(thread => {
          return {
						_id: thread._id,
            title: thread.title,
            description: thread.description,
						tags: thread.tags,
						date: thread.date,
            request: {
              type: "GET",
              url: "/thread/" + thread._id
            }
          };
        })
      };
        if (threads.length >= 0) {
			res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', checkAuth, (req, res, next) => {
	const thread = new Thread({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		description: req.body.description,
		tags: req.body.tags,
		username: req.body.email,
		date: Date.now()
	});

	thread
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Thread created successfully",
				createdProduct: {
					_id: result._id,
					title: result.title,
					description: result.description,
					tags: result.tags,
					username: result.email,
					date: result.date
				}
			})
		})
		.catch(err => console.log(err));

});

module.exports = router;