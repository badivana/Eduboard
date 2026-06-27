export default function Spinner({ full = false }) {
  const spinner = (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
  );
  if (full) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>;
  }
  return <div className="flex justify-center py-10">{spinner}</div>;
}
