// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mt-4">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
