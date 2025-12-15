export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-8 text-base-content/70">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="btn btn-primary rounded-xl shadow-lg text-base-100 border-0 hover:bg-primary-600">
          Back to Home
        </a>
      </div>
    </div>
  );
}
