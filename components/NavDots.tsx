interface NavDotsProps {
  total: number;
  active: number;
}

export default function NavDots({ total, active }: NavDotsProps) {
  return (
    <div className="flex flex-col gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            border: "1px solid rgba(100,120,130,0.5)",
            backgroundColor: i === active ? "#6abf3c" : "transparent",
          }}
        />
      ))}
    </div>
  );
}
