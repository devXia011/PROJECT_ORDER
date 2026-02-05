const { createApp } = Vue
const { createRouter, createWebHistory } = VueRouter

// --- Login Component ---
const LoginPage = {
  template: `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8 mt-10">
      <h1 class="text-2xl font-bold mb-4">Sign In</h1>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="username" type="text"
                 class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="password" type="password"
                 class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button @click="login"
                class="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
          Login
        </button>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>
    </div>
  `,
  data() {
    return { username: "", password: "", error: "" }
  },
  methods: {
    async login() {
      this.error = ""
      try {
        const formData = new URLSearchParams()
        formData.append("username", this.username)
        formData.append("password", this.password)

        const res = await fetch("/login", {
          method: "POST",
          body: formData,
          credentials: "include"
        })

        if (!res.ok) {
          const data = await res.json()
          this.error = data.detail || "Login failed"
          return
        }

        // After login, redirect to dashboard
        this.$root.checkSession()
        this.$router.push("/dashboard")
      } catch (err) {
        this.error = "Login request failed"
        console.error(err)
      }
    }
  }
}

// --- Dashboard Component (protected) ---
const DashboardPage = {
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {{ username }}! You are authenticated.</p>
      <router-link to="/demo" class="text-indigo-600 underline block mt-4">
        Go to Demo Store
      </router-link>
      <button @click="logout"
              class="bg-red-500 text-white px-3 py-1 rounded mt-4">Logout</button>
    </div>
  `,
  data() {
    return { username: "" }
  },
  async mounted() {
    const res = await fetch("/session", { credentials: "include" })
    const data = await res.json()
    if (!data.authenticated) {
      this.$router.push("/") // redirect back to login if not authenticated
    } else {
      this.username = data.username
    }
  },
  methods: {
    async logout() {
      await fetch("/logout", { method: "POST", credentials: "include" })
      this.$root.loggedIn = false
      this.$router.push("/")
    }
  }
}

// --- Store Landing Page (public) ---
const StorePage = {
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Welcome to {{ storeName }}</h1>
      <router-link :to="storeName + '/menu'"
                   class="text-indigo-600 underline">View Menu</router-link>
    </div>
  `,
  computed: {
    storeName() {
      return this.$route.params.store_name
    }
  }
}

// --- Menu Page (public) ---
const MenuPage = {
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">{{ storeName }} Menu</h1>
      <ul class="list-disc ml-6">
        <li v-for="item in menu" :key="item">{{ item }}</li>
      </ul>
    </div>
  `,
  data() {
    return { menu: [] }
  },
  computed: {
    storeName() {
      return this.$route.params.store_name
    }
  },
  async mounted() {
    try {
      const res = await fetch(`/${this.storeName}/menulist`, { credentials: "include" })
      const data = await res.json()
      this.menu = data.menu
    } catch (err) {
      console.error("Failed to load menu:", err)
      this.menu = ["Error loading menu"]
    }
  }
}

// --- Routes ---
const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: DashboardPage }, // protected
  { path: '/:store_name', component: StorePage }, // public
  { path: '/:store_name/menu', component: MenuPage } // public
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- Navigation Guard (only protect dashboard) ---
router.beforeEach(async (to, from, next) => {
  if (to.path === "/" || to.path.startsWith("/s")) {
    next() // login and store/menu are public
    return
  }

  if (to.path === "/dashboard") {
    const res = await fetch("/session", { credentials: "include" })
    const data = await res.json()
    if (!data.authenticated) {
      next("/") // redirect to login if not authenticated
    } else {
      next()
    }
  } else {
    next()
  }
})

// --- Root App ---
const app = createApp({
  data() {
    return {
      loggedIn: false,
      username: ""
    }
  },
  methods: {
    async checkSession() {
      try {
        const res = await fetch("/session", { credentials: "include" })
        const data = await res.json()
        if (data.authenticated) {
          this.loggedIn = true
          this.username = data.username
        } else {
          this.loggedIn = false
          this.username = ""
        }
      } catch (err) {
        console.error("Session check failed:", err)
      }
    }
  },
  mounted() {
    this.checkSession()
  },
  template: `
    <div>
      <nav v-if="loggedIn" class="bg-indigo-600 text-white px-4 py-2 flex justify-between">
        <span>Welcome, {{ username }}</span>
        <router-link to="/dashboard" class="underline">Dashboard</router-link>
      </nav>
      <router-view></router-view>
    </div>
  `
})

app.use(router)
app.mount('#app')