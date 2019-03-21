const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Session Model
const Session = require('../../models/Session');

// Profile Model
const Profile = require('../../models/Profile');

// Validation
const validateSessionInput = require('../../validation/session');

// @route  GET api/sessions/test
// @desc   Tests sessions route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'Sessions Works' }));

// @route  GET api/sessions/:id
// @desc   Get sessions by id
// @access Public
router.get('/:id', (req, res) => {
  Session.findById(req.params.id)
    .then(session => res.json(session))
    .catch(err =>
      res.status(404).json({ nosessionfound: 'No session found with that id' })
    );
});

// @route  GET api/sessions
// @desc   Get sessions
// @access Public
router.get('/', (req, res) => {
  Session.find()
    .sort({ createdAt: -1 })
    .then(sessions => res.json(sessions))
    .catch(err =>
      res.status(404).json({ nosessionsfound: 'No sessions found' })
    );
});

// @route  POST api/sessions
// @desc   Create session
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    /*const { errors, isValid } = validateSessionInput(req.body);

    //Check validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }*/

    const newSession = new Session({
      class: req.body.class,
      information: req.body.information,
      type: req.body.type,
      scheduledStart: req.body.scheduledStart,
      createdBy: req.user.id
    });

    newSession.save().then(session => {
      Profile.findOne({ handle: req.body.handle })
        .then(profile => {
          if (
            session.instructors.filter(
              instructor =>
                instructor.user.toString() === profile.user.toString()
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyadded: 'Instructor already attending session' });
          }

          // Add user id to sessions array
          session.instructors.unshift({ user: profile.user });

          session.save().then(session => res.json(session));
        })
        .catch(err =>
          res.status(404).json({ tutornotfound: 'Tutor was not found' })
        );
    });

    //newSession.save().then(session => res.json(session));
  }
);

// @route  DELETE api/sessions/:id
// @desc   Delete session
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Session.findById(req.params.id).then(session => {
        // Check for Session owner
        if (session.createdBy.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }

        // Delete
        session
          .remove()
          .then(() => {
            res.json({ success: true });
          })
          .catch(err =>
            res.status(404).json({ sessionnotfound: 'No session found' })
          );
      });
    });
  }
);

// @route  POST api/sessions/student/:id
// @desc   Add student to session
// @access Private
router.post(
  '/student/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ handle: req.body.handle }).then(profile => {
      Session.findById(req.params.id)
        .then(session => {
          if (
            session.students.filter(
              student => student.user.toString() === profile.user.toString()
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyadded: 'Student already attending session' });
          }

          // Add user id to sessions array
          session.students.unshift({ user: profile.user });

          session.save().then(session => res.json(session));
        })
        .catch(err =>
          res.status(404).json({ sessionnotfound: 'No session found' })
        );
    });
  }
);

// @route  DELETE api/sessions/student/:id/:student_id
// @desc   Remove student from session
// @access Private
router.delete(
  '/student/:id/:student_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Session.findById(req.params.id)
      .then(session => {
        // Check to see if student exists
        if (
          session.students.filter(
            student => student.user._id.toString() === req.params.student_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ studentnotfound: 'Student does not exist' });
        }

        // Get remove index
        const removeIndex = session.students
          .map(item => item._id.toString())
          .indexOf(req.params.student_id);

        // Splice student out of array
        session.students.splice(removeIndex, 1);

        session.save().then(session => res.json(session));
      })
      .catch(err =>
        res.status(404).json({ sessionnotfound: 'No session found' })
      );
  }
);

// @route  POST api/sessions/instructor/:id
// @desc   Add instructor to session
// @access Private
router.post(
  '/instructor/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ handle: req.body.handle }).then(profile => {
      Session.findById(req.params.id)
        .then(session => {
          if (
            session.instructors.filter(
              instructor =>
                instructor.user.toString() === profile.user.toString()
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyadded: 'Instructor already attending session' });
          }

          // Add user id to sessions array
          session.instructors.unshift({ user: profile.user });

          session.save().then(session => res.json(session));
        })
        .catch(err =>
          res.status(404).json({ sessionnotfound: 'No session found' })
        );
    });
  }
);

// @route  DELETE api/sessions/instructor/:id/:instructor_id
// @desc   Remove instructor from session
// @access Private
router.delete(
  '/instructor/:id/:instructor_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Session.findById(req.params.id)
      .then(session => {
        // Check to see if instructor exists
        if (
          session.instructors.filter(
            instructor =>
              instructor.user._id.toString() === req.params.instructor_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ instructornotfound: 'Instructor does not exist' });
        }

        // Get remove index
        const removeIndex = session.instructors
          .map(item => item._id.toString())
          .indexOf(req.params.instructor_id);

        // Splice instructor out of array
        session.instructors.splice(removeIndex, 1);

        session.save().then(session => res.json(session));
      })
      .catch(err =>
        res.status(404).json({ sessionnotfound: 'No session found' })
      );
  }
);

module.exports = router;
