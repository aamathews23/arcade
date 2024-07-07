import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const gameRouter = createTRPCRouter({
  getLeaderboardByGameId: protectedProcedure
    .input(z.object({ gameId: z.number(), limit: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.userGame.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
          highScore: true,
        },
        where: {
          gameId: input.gameId,
        },
        take: input.limit,
        orderBy: { highScore: 'desc' },
      });
    }),
  getHighScoreForUserByGame: protectedProcedure
    .input(z.object({ userId: z.string(), name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.userGame.findFirst({
        select: {
          id: true,
          game: {
            select: {
              id: true,
            },
          },
          highScore: true,
        },
        where: {
          userId: input.userId,
          game: {
            name: input.name,
          },
        },
      });
    }),
  setHighScoreForUserByGameId: protectedProcedure
    .input(z.object({ highScore: z.number(), gameName: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.game.findFirst({
        select: {
          id: true,
        },
        where: {
          name: input.gameName,
        },
      });

      if (!game) {
        return;
      }

      return ctx.db.userGame.upsert({
        create: {
          gameId: game.id,
          userId: input.userId,
          highScore: input.highScore,
        },
        update: {
          highScore: input.highScore,
        },
        where: {
          userId_gameId: {
            gameId: game.id,
            userId: input.userId,
          },
        },
      });
    }),
});
