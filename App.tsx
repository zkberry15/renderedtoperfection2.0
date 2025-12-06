import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import NanoBananaEditor from "./NanoBananaEditor" // ✅ your real app

type SupabaseUser = {
  id: string
  email?: string
}

function App() {
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

  // LOADING
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    )
  }

  // NOT LOGGED IN
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
          style={{ padding: "12px 24px", borderRadius: 30, cursor: "pointer" }}
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  // ✅ LOGGED IN — SHOW FULL APP
  return (
    <div>
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 1000,
        }}
      >
        <div style={{ fontSize: 14 }}>
          Signed in as <strong>{user.email}</strong>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>

      {/* ✅ YOUR REAL NANO BANANA APP BELOW */}
      <NanoBananaEditor />
    </div>
  )
}

export default App


