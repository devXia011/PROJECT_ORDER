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


// --- Store Component (public) ---
const StorePage = {
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
          title: "Happy Dining",
          desc: "Friends and families enjoying meals together with unforgettable flavors."
        },
        {
          img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          title: "Fresh & Delicious",
          desc: "Every dish is prepared fresh with ingredients you can taste in every bite."
        },
        {
          img: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9",
          title: "Moments That Matter",
          desc: "Good food creates memories — and we’re proud to be part of yours."
        }
      ]
    }
  },
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50">

      <!-- HERO -->
      <section class="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400">
            {{ formattedStoreName }}
          </span>
        </h1>

        <p class="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
          Delicious food, freshly prepared, and ready when you are.
        </p>

        <div class="mt-10">
          <router-link
            :to="'/' + storeName + '/menu'"
            class="px-10 py-4 rounded-xl bg-pink-200 text-pink-900 font-semibold shadow hover:bg-pink-300 transition"
          >
            🍽 View Menu
          </router-link>
        </div>
      </section>

      <!-- FULL WIDTH CAROUSEL WITH DOTS INSIDE -->
      <section class="w-full relative overflow-hidden py-6 -mt-3">
        <div
          class="flex transition-transform duration-700 ease-in-out"
          :style="{ transform: 'translateX(-' + (currentSlide * 100) + '%)' }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="min-w-full flex flex-col md:flex-row md:space-x-6"
          >
            <!-- IMAGE 60% -->
            <div class="md:w-3/5 flex-shrink-0">
              <img
                :src="slide.img"
                class="w-full h-auto max-h-[500px] md:max-h-[600px] rounded-xl shadow-lg object-cover"
              />
            </div>

            <!-- TEXT 40% -->
            <div class="md:w-2/5 bg-white flex flex-col justify-between p-8 md:p-16 rounded-xl shadow-lg">
              <div>
                <h3 class="text-3xl font-bold mb-4 text-purple-600">{{ slide.title }}</h3>
                <p class="text-gray-700 text-lg leading-relaxed">{{ slide.desc }}</p>
              </div>

              <!-- DOTS NAVIGATION INSIDE CAROUSEL -->
              <div class="flex justify-center mt-6">
                <span
                  v-for="(s, i) in slides"
                  :key="i"
                  @click="goToSlide(i)"
                  :class="[
                    'w-4 h-4 rounded-full cursor-pointer mx-1 transition',
                    currentSlide === i ? 'bg-purple-400' : 'bg-gray-300'
                  ]"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FULL-HEIGHT LOCATION SECTION -->
      <section class="w-full flex flex-col md:flex-row bg-pink-50">

        <!-- INFO PANEL 40% LEFT -->
        <div class="md:w-2/5 flex flex-col gap-6 p-8 md:p-12">
          <h2 class="text-3xl md:text-4xl font-bold text-purple-700 mb-2">Visit {{ formattedStoreName }}</h2>
          <p class="text-gray-700 mb-4">
            Come visit us! Here’s how you can find us easily:
          </p>

          <div>
            <p class="font-semibold text-gray-700">Address:</p>
            <p class="text-gray-600">123 Main St, Your City, Your Country</p>
          </div>

          <div>
            <p class="font-semibold text-gray-700">Phone:</p>
            <a href="tel:+1234567890" class="text-pink-500 hover:underline">+1 234 567 890</a>
          </div>

          <div>
            <p class="font-semibold text-gray-700">Opening Hours:</p>
            <p class="text-gray-600">Mon-Fri: 10:00 AM - 10:00 PM</p>
            <p class="text-gray-600">Sat-Sun: 9:00 AM - 11:00 PM</p>
          </div>

          <router-link
            :to="'/' + storeName + '/menu'"
            class="mt-4 px-6 py-3 rounded-xl bg-pink-200 text-pink-900 font-semibold shadow hover:bg-pink-300 transition text-center"
          >
            🍽 View Menu
          </router-link>
        </div>

        <!-- MAP 60% RIGHT -->
        <div class="md:w-3/5 h-[500px] md:h-auto md:flex-1">
          <iframe
            class="w-full h-full border-0 object-cover"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.2215438846383!2d121.04142677683808!3d14.756544785748506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b10060d3e649%3A0x7f71cb56180acae7!2sKai%20Mall!5e0!3m2!1sen!2sph!4v1770271204721!5m2!1sen!2sph">
          </iframe>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="bg-purple-50 text-purple-900 py-10 text-center">
        <h3 class="text-xl font-semibold mb-6">
          Follow {{ formattedStoreName }}
        </h3>

        <div class="flex flex-wrap justify-center gap-8 mb-6 text-lg">

          <!-- Facebook -->
          <a href="#" class="flex items-center gap-2 hover:text-purple-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
              <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z"/>
            </svg>
            Facebook
          </a>

          <!-- Instagram -->
          <a href="#" class="flex items-center gap-2 hover:text-pink-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.3A4.7 4.7 0 1112 17a4.7 4.7 0 010-9.4zm6.2-.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
            Instagram
          </a>

          <!-- TikTok -->
          <a href="#" class="flex items-center gap-2 hover:text-yellow-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
              <path d="M16 2h3a5 5 0 005 5v3a8 8 0 01-5-1.7V15a7 7 0 11-7-7h1v3h-1a4 4 0 104 4V2z"/>
            </svg>
            TikTok
          </a>

        </div>

        <p class="text-sm text-purple-600">
          © {{ new Date().getFullYear() }} {{ formattedStoreName }}. All rights reserved.
        </p>
      </footer>

    </div>
  `,
  computed: {
    storeName() {
      return this.$route.params.store_name
    },
    formattedStoreName() {
      return this.storeName
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.slides.length) % this.slides.length
    },
    goToSlide(index) {
      this.currentSlide = index
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