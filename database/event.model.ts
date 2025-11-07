import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must have at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Tags must have at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for slug generation and date/time normalization
EventSchema.pre('save', function (next) {
  const event = this as IEvent;

  // Generate slug only if title is modified or document is new
  if (event.isModified('title')) {
    event.slug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Normalize date to ISO format if modified
  if (event.isModified('date')) {
    try {
      const parsedDate = new Date(event.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'));
      }
      event.date = parsedDate.toISOString().split('T')[0]; // Store as YYYY-MM-DD
    } catch (error) {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time to HH:MM format if modified
  if (event.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(event.time)) {
      // Try parsing various time formats
      try {
        const timeStr = event.time.trim();
        const match = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
          const hours = parseInt(match[1], 10);
          const minutes = parseInt(match[2], 10);
          if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            event.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          } else {
            return next(new Error('Invalid time format. Use HH:MM (24-hour format)'));
          }
        } else {
          return next(new Error('Invalid time format. Use HH:MM (24-hour format)'));
        }
      } catch (error) {
        return next(new Error('Invalid time format. Use HH:MM (24-hour format)'));
      }
    }
  }

  next();
});

// Create unique index on slug
EventSchema.index({ slug: 1 }, { unique: true });

// Use existing model if available (prevents OverwriteModelError in development)
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
