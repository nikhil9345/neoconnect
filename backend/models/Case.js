const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },

    attachments: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      enum: ['New', 'Assigned', 'InProgress', 'Pending', 'Resolved', 'Escalated'],
      default: 'New'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    notes: [
      {
        text: {
          type: String
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);


// Generate tracking ID automatically
caseSchema.pre('save', async function () {

  if (this.isNew && !this.trackingId) {

    const year = new Date().getFullYear();

    const count = await mongoose.model('Case').countDocuments({
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });

    this.trackingId = `NEO-${year}-${String(count + 1).padStart(3, '0')}`;
  }

});


module.exports = mongoose.model('Case', caseSchema);