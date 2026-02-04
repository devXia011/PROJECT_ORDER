const { createApp } = Vue

createApp({
  data() {
    return {
      username: '',
      password: '',
      loggedIn: false,
      error: null,
      message: null
    }
  },
  async mounted() {
    try {
      const res = await fetch("/session", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          this.loggedIn = true
          this.username = data.username
        }
      }
    } catch (err) {
      console.error("Session check failed:", err)
    }
  },
  methods: {
    async login() {
      this.error = null
      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ username: this.username, password: this.password }),
          credentials: "include"
        })
        if (!res.ok) throw new Error("Invalid credentials")
        this.loggedIn = true
      } catch (err) { this.error = err.message }
    },
    async fetchProtected() {
      const csrfToken = this.getCookie("csrf_token")
      try {
        const res = await fetch("/protected", {
          method: "POST",
          credentials: "include",
          headers: { "X-CSRF-Token": csrfToken }
        })
        this.message = res.ok ? (await res.json()).message : "Access denied"
      } catch (err) {
        this.message = "Error contacting server"
      }
    },
    async logout() {
      try {
        await fetch("/logout", { method: "POST", credentials: "include" })
        this.loggedIn = false
        this.message = null
        this.password = ''
      } catch (err) {
        console.error("Logout failed:", err)
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(";").shift()
    }
  }
}).mount('#app')