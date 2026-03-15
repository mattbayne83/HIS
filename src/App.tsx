function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-primary text-white px-8 py-6">
        <h1 className="font-display text-3xl">Himali Indigenous Services</h1>
        <p className="text-white/70 text-sm mt-1">Facilitating transformation in Nepal through local partnerships</p>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-surface rounded-xl p-8 border border-border">
          <h2 className="font-display text-2xl text-primary mb-4">Welcome to HIS</h2>
          <p className="text-text-muted leading-relaxed">
            Project scaffolded and ready for development. Supabase integration configured for
            database, authentication, and image storage.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
