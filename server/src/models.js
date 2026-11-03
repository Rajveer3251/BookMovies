import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  startsAt: { type: Date, required: true },
  screen: { type: String, default: 'Screen 1' },
  price: { type: Number, default: 180 },
  bookedSeats: { type: [String], default: [] }
});
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  poster: String,
  genre: String,
  duration: String,
  rating: String,
  language: { type: String, default: 'English' },
  shows: [showSchema]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, required: true },
  seats: [{ type: String, required: true }],
  total: { type: Number, required: true },
  status: { type: String, default: 'confirmed' }
}, { timestamps: true });

export const Movie = mongoose.model('Movie', movieSchema);
export const User = mongoose.model('User', userSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
