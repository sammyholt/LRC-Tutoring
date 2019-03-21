const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SessionSchema = new Schema(
  {
    class: {
      type: String,
      required: true
    },
    information: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    students: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users'
        }
      }
    ],
    instructors: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users'
        }
      }
    ],
    scheduledStart: {
      type: Date
    },
    scheduledEnd: {
      type: Date
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    }
  },
  {
    timestamps: true // generate createdAt and updatedAt fields
  }
);

module.exports = Session = mongoose.model('session', SessionSchema);
