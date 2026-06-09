import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className='max-w-400 w-full mt-12 px-4 md:px-40 pt-8 md:pt-10 md:pb-0 flex flex-col border-0'>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-10 md:pt-17  md:pb-8 text-center border-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
            Welcome to Connect.Hub
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
            Receive honest anonymous messages from friends, colleagues,
            and anyone who has something meaningful to share.
          </p>

          <div className="flex justify-center gap-4">
            <button className="px-4 py-1 md:px-6 md:py-3 rounded-md bg-black text-white">
              <Link href={'/dashboard'}>
                <span className="md:hidden">Dashboard</span>
                <span className="hidden md:block">Go to Dashboard</span>
              </Link>
            </button>

            <button className="px-4 py-2 md:px-6 md:py-3 rounded-md border">
              <Link href={'/send-message'}>Send Message</Link>
            </button>
          </div>
        </section>

        {/* Sample Messages */}
        <section className="container mx-auto pt-12 md:pt-18 border-0">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">
            Sample Messages
          </h2>

          <div className="grid gap-3 md:gap-6 md:grid-cols-3 md:px-10">
            <div className=" container rounded-xl border p-5">
              <h3 className="font-semibold">Anonymous</h3>
              <p className="text-sm text-muted-foreground mb-4">
                2 minutes ago
              </p>
              <p className="text-sm">You are doing an amazing job. Keep going!</p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold">Anonymous</h3>
              <p className="text-sm text-muted-foreground mb-4">
                5 minutes ago
              </p>
              <p className="text-sm">Your Next.js projects are getting better every day.</p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold">Anonymous</h3>
              <p className="text-sm text-muted-foreground mb-4">
                10 minutes ago
              </p>
              <p className="text-sm">I really like your portfolio design.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="pt-12 md:pt-18 border-0 md:px-10">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">
              How It Works
            </h2>

            <div className="grid gap-3 md:gap-6 md:grid-cols-3">
              <div className="rounded-xl border bg-background p-6">
                <h3 className="font-semibold mb-3">
                  Create Account
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sign up and create your personal profile.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-6">
                <h3 className="font-semibold mb-3">
                  Share Your Link
                </h3>
                <p className="text-muted-foreground text-sm">
                  Send your unique anonymous message link to friends.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-6">
                <h3 className="font-semibold mb-3">
                  Receive Messages
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get anonymous feedback directly in your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto md:px-10 pt-12 md:pt-18 border-0">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">
            Features
          </h2>

          <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-2">
                Anonymous Messaging
              </h3>
              <p className="text-muted-foreground text-sm">
                Receive messages without revealing the sender.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-2">
                Message Inbox
              </h3>
              <p className="text-muted-foreground text-sm">
                Organize and manage all received messages.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-2">
                Message Control
              </h3>
              <p className="text-muted-foreground text-sm">
                Enable or disable message receiving anytime.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="font-semibold mb-2">
                Easy Sharing
              </h3>
              <p className="text-muted-foreground text-sm">
                Copy and share your unique profile link instantly.
              </p>
            </div>
          </div>
        </section>



        {/* CTA */}
        <section className="container mx-auto px-4 py-20 text-center border-0">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Receive Anonymous Messages?
          </h2>

          <p className="text-muted-foreground mb-8">
            Create your free account and start receiving feedback today.
          </p>

          <button className="px-4 py-3 md:px-6 md:py-3 rounded-md bg-black text-white hover:opacity-90">
            <Link href={'/sign-up'}>Create Free Account</Link>
          </button>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            © 2026 Connect.Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}
