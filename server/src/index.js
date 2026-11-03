import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Movie, User, Booking } from './models.js';
import { requireAuth } from './auth.js';
import { seedMovies } from './seed.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req,res)=>res.json({status:'ok', service:'BookMovies API'}));
app.get('/api/movies', async (_req,res,next)=>{
  try { res.json(await Movie.find().sort({createdAt:1})); } catch(e){next(e);}
});

app.post('/api/auth/register', async (req,res,next)=>{
  try {
    const {name,email,password}=req.body;
    if(!name || !email || !password || password.length<8)
      return res.status(400).json({message:'Name, email and a password of at least 8 characters are required.'});
    const normalized=email.toLowerCase().trim();
    if(await User.findOne({email:normalized})) return res.status(409).json({message:'An account with this email already exists.'});
    const user=await User.create({name:name.trim(),email:normalized,passwordHash:await bcrypt.hash(password,12)});
    const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.status(201).json({token,user:{id:user.id,name:user.name,email:user.email}});
  } catch(e){next(e);}
});
app.post('/api/auth/login', async (req,res,next)=>{
  try {
    const user=await User.findOne({email:(req.body.email||'').toLowerCase().trim()});
    if(!user || !await bcrypt.compare(req.body.password||'',user.passwordHash))
      return res.status(401).json({message:'Email or password is incorrect.'});
    const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.json({token,user:{id:user.id,name:user.name,email:user.email}});
  } catch(e){next(e);}
});
app.get('/api/auth/me',requireAuth,async(req,res,next)=>{
  try { const user=await User.findById(req.user.id).select('name email'); if(!user)return res.status(404).json({message:'User not found'}); res.json(user); } catch(e){next(e);}
});

app.get('/api/shows/:showId/seats',async(req,res,next)=>{
  try {
    const movie=await Movie.findOne({'shows._id':req.params.showId});
    if(!movie)return res.status(404).json({message:'Show not found'});
    const show=movie.shows.id(req.params.showId);
    res.json({bookedSeats:show.bookedSeats,price:show.price,startsAt:show.startsAt});
  } catch(e){next(e);}
});

app.post('/api/bookings',requireAuth,async(req,res,next)=>{
  try {
    const {movieId,showId,seats}=req.body;
    if(!Array.isArray(seats)||!seats.length||new Set(seats).size!==seats.length)
      return res.status(400).json({message:'Choose one or more unique seats.'});
    const movie=await Movie.findOne({'_id':movieId,'shows._id':showId});
    if(!movie)return res.status(404).json({message:'Movie show not found.'});
    const show=movie.shows.id(showId);
    if(seats.some(s=>show.bookedSeats.includes(s)))
      return res.status(409).json({message:'One or more seats were just booked. Refresh seat availability.'});
    show.bookedSeats.push(...seats);
    await movie.save();
    const booking=await Booking.create({user:req.user.id,movie:movie._id,showId,seats,total:seats.length*show.price});
    res.status(201).json(await booking.populate('movie','title poster'));
  } catch(e){next(e);}
});
app.get('/api/bookings/my',requireAuth,async(req,res,next)=>{
  try { res.json(await Booking.find({user:req.user.id}).populate('movie','title poster').sort({createdAt:-1})); } catch(e){next(e);}
});

app.use((err,_req,res,_next)=>{
  console.error(err);
  res.status(500).json({message:'Something went wrong on the server.'});
});

const port=process.env.PORT||5000;
if(!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Set MONGO_URI and JWT_SECRET in server/.env'); process.exit(1);
}
await mongoose.connect(process.env.MONGO_URI);
await seedMovies();
app.listen(port,()=>console.log(`BookMovies API running on http://localhost:${port}`));
