import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

type SupabaseUser = {
  id: string
  email?: string
}

export default function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user as SupabaseUser | null)
      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser((session?.user as SupabaseUser) ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: window.location.origin },
            })
          }
          style={{
            padding: "12px 24px",
            borderRadius: 30,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <div>
          Signed in as <strong>{user.email}</strong>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = window.location.origin
          }}
          style={{
            padding: "8px 18px",
            borderRadius: 20,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* APP BODY */}
      <div style={{ padding: 40 }}>
        Your Nano Banana app is now protected and working properly.
      </div>
    </div>
  )
}

