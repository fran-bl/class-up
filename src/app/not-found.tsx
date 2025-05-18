export default async function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>404</h1>
            <p className="text-lg text-center">This page could not be found.</p>
        </div>
    );
}