export default function Loading() {
  return (
    <div className="container-custom py-20">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-primary-500 border-r-transparent"></div>
          <p className="mt-4 text-brand-secondary-500">Loading team details...</p>
        </div>
      </div>
    </div>
  );
}
