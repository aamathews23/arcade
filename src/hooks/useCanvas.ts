import { useRef, useEffect, useState } from 'react';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasCtx(canvasRef.current.getContext('2d'));
    }
  }, []);

  return {
    canvasRef,
    canvas: canvasCtx,
  };
};
