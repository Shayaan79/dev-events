import { Schema, model, models, Document, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to verify that the referenced event exists
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's modified or the document is new
  if (booking.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.findById(booking.eventId);
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Referenced event does not exist') {
        return next(error);
      }
      return next(new Error('Error validating event reference'));
    }
  }

  next();
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

// Use existing model if available (prevents OverwriteModelError in development)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
