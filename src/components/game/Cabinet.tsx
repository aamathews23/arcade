type CabinetProps = {
  title: string;
  canvas: React.LegacyRef<HTMLCanvasElement>;
  score: number;
  highScore: number;
  message: string;
};

export const Cabinet = ({ title, canvas, score, highScore, message }: CabinetProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-4xl">{title}</h1>
      <p>{message}</p>
      <div className="flex w-full flex-row items-start justify-between gap-4">
        <span>Score: {score}</span>
        <span>High Score: {highScore}</span>
      </div>
      <canvas
        ref={canvas}
        id={title}
        className="border-2 border-slate-900 bg-slate-700"
        width="512"
        height="512"
      />
    </section>
  );
};
