import { Movie } from './models.js';

export async function seedMovies() {
  if (await Movie.countDocuments()) return;
  const now = new Date();
  const posters = [
    'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    'https://image.tmdb.org/t/p/w500/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg'
  ];
  const data = [
    ['Interstellar','A team travels beyond this galaxy to discover whether mankind has a future among the stars.','Sci-Fi','2h 49m','8.7'],
    ['The Shawshank Redemption','Hope can set you free. A moving story of friendship and resilience.','Drama','2h 22m','9.3'],
    ['Dune: Part Two','Paul Atreides unites with Chani and the Fremen while seeking revenge.','Adventure','2h 46m','8.6']
  ];
  await Movie.insertMany(data.map((m,i)=>({
    title:m[0], description:m[1], genre:m[2], duration:m[3], rating:m[4],
    poster:posters[i],
    shows:[10,14,18,21].map(hour=>({
      startsAt:new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,hour,0),
      screen:`Screen ${i+1}`, price:180+i*30, bookedSeats:[]
    }))
  })));
}
