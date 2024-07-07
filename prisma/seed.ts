import { db } from '~/server/db';

const seedGames = async () => {
  await db.game.create({
    data: {
      name: 'snake',
    },
  });
};

const main = async () => {
  await seedGames();
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
