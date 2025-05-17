export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-center m-4" style={{ fontFamily: 'var(--font-gta-medium)' }}>Unauthorized</h1>
            <p className="text-lg text-center">You do not have permission to access this page.</p>
        </div>
    );
}