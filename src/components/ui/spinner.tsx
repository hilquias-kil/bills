export function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );
}
