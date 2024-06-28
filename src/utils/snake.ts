import type { DirectionType, Point } from '~/types/snake';

export const spawnFood = (nodes: Point[]) => {
  const food = {
    x: Math.floor(Math.random() * 31) * 16,
    y: Math.floor(Math.random() * 31) * 16,
  };

  if (!nodes || (nodes && nodes.length === 0)) {
    return food;
  }

  let sameNode = nodes.filter((node) => food.x === node.x && food.y === node.y).length > 0;
  while (sameNode) {
    food.x = Math.floor(Math.random() * 31) * 16;
    food.y = Math.floor(Math.random() * 31) * 16;
    sameNode = nodes.filter((node) => food.x === node.x && food.y === node.y).length > 0;
  }

  return food;
};

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
