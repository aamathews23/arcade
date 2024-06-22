import type { DirectionType, Point } from '~/types/snake';

export const move = (node: Point, direction: DirectionType) => {
  switch (direction) {
    case 'up':
      return {
        ...node,
        y: node.y - 16,
      };
    case 'down':
      return {
        ...node,
        y: node.y + 16,
      };
    case 'right':
      return {
        ...node,
        x: node.x + 16,
      };
    case 'left':
      return {
        ...node,
        x: node.x - 16,
      };
    default:
      return {
        ...node,
      };
  }
};
