<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Dashboard Preview - Nuxt Dashboard Pro",
  meta: [
    {
      name: "description",
      content: "Explorez toutes les fonctionnalités du Nuxt Dashboard Pro avec notre démo interactive.",
    },
  ],
});

const features = [
  {
    icon: "lucide:layout-dashboard",
    title: "Dashboard Analytics",
    description: "Visualisez vos métriques avec des graphiques interactifs et des KPIs en temps réel.",
    image: "/screenshots/dashboard.png",
  },
  {
    icon: "lucide:table",
    title: "Data Tables",
    description: "Tables de données avancées avec tri, filtrage, pagination et export.",
    image: "/screenshots/data-table.png",
  },
  {
    icon: "lucide:palette",
    title: "Dark Mode",
    description: "Thème sombre/clair avec transition fluide et personnalisation complète.",
    image: "/screenshots/dark-mode.png",
  },
  {
    icon: "lucide:shield-check",
    title: "Authentication",
    description: "Système d'authentification complet avec login, register et gestion de profil.",
    image: "/screenshots/auth.png",
  },
  {
    icon: "lucide:settings",
    title: "Settings",
    description: "Panneau de paramètres avec tabs, formulaires et validation.",
    image: "/screenshots/settings.png",
  },
  {
    icon: "lucide:smartphone",
    title: "Responsive Design",
    description: "Interface parfaitement adaptée à tous les écrans (mobile, tablette, desktop).",
    image: "/screenshots/responsive.png",
  },
];
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
              <span class="font-semibold">Retour</span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <DpThemeToggle />
            <NuxtLink to="/auth/login">
              <DpButton variant="primary">
                Essayer Maintenant
              </DpButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-sm font-medium">Démo Interactive</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Découvrez Nuxt Dashboard Pro
        </h1>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explorez toutes les fonctionnalités de notre template premium et voyez comment il peut accélérer votre développement.
        </p>

        <!-- Live Demo Button -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/dashboard">
            <DpButton variant="primary" size="lg" class="group">
              <Icon name="lucide:external-link" class="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Ouvrir le Dashboard
            </DpButton>
          </NuxtLink>
          <NuxtLink to="/auth/login">
            <DpButton variant="outline" size="lg">
              <Icon name="lucide:log-in" class="w-5 h-5 mr-2" />
              Se Connecter
            </DpButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Showcase -->
    <section class="py-20 bg-muted/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Fonctionnalités Principales
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour créer une application professionnelle
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="group relative bg-background border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Icon :name="feature.icon" class="w-6 h-6 text-primary" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-foreground mb-2">
                  {{ feature.title }}
                </h3>
                <p class="text-muted-foreground">
                  {{ feature.description }}
                </p>
              </div>
            </div>

            <!-- Screenshot placeholder -->
            <div class="mt-4 aspect-video bg-muted rounded-lg border border-border overflow-hidden">
              <div class="w-full h-full flex items-center justify-center">
                <Icon :name="feature.icon" class="w-12 h-12 text-muted-foreground/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Stack Technique Moderne
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Construit avec les meilleures technologies web
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <!-- Nuxt Logo SVG -->
              <svg class="w-10 h-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M227.92 355.8H358.4C362.5 355.8 366.5 354.7 370 352.7C373.6 350.6 376.6 347.6 378.7 344C380.8 340.4 381.9 336.3 381.9 332.2C381.9 328 380.8 324 378.7 320.4L302.9 187.1C300.8 183.5 297.8 180.5 294.3 178.4C290.7 176.4 286.7 175.3 282.6 175.3C278.5 175.3 274.5 176.4 270.9 178.4C267.4 180.5 264.4 183.5 262.3 187.1L227.92 247.7L159.42 127.1C157.32 123.5 154.32 120.5 150.72 118.4C147.12 116.4 143.12 115.3 139.02 115.3C134.92 115.3 130.92 116.4 127.32 118.4C123.72 120.5 120.72 123.5 118.62 127.1L21.32 296.4C19.22 300 18.12 304 18.12 308.2C18.12 312.3 19.22 316.4 21.32 320C23.42 323.6 26.42 326.6 30.02 328.7C33.52 330.7 37.52 331.8 41.62 331.8H124.12C162.92 331.8 191.32 314.3 211.02 280.1L271.92 175.3L302.92 229.1L227.92 355.8Z" fill="#00DC82"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-foreground">Nuxt 3</div>
              <div class="text-sm text-muted-foreground">Framework Vue</div>
            </div>
          </div>

          <div class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <!-- Vue Logo SVG -->
              <svg class="w-10 h-10" viewBox="0 0 256 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M204.8 0H256L128 220.8L0 0H97.92L128 51.2L157.44 0H204.8Z" fill="#41B883"/>
                <path d="M0 0L128 220.8L256 0H204.8L128 132.48L50.56 0H0Z" fill="#41B883"/>
                <path d="M50.56 0L128 133.12L204.8 0H157.44L128 51.2L97.92 0H50.56Z" fill="#35495E"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-foreground">Vue 3</div>
              <div class="text-sm text-muted-foreground">Composition API</div>
            </div>
          </div>

          <div class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <!-- TypeScript Logo SVG -->
              <svg class="w-10 h-10" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="256" height="256" rx="20" fill="#3178C6"/>
                <path d="M150.518 200.475V228.238C154.926 230.551 160.159 232.302 166.218 233.491C172.277 234.68 178.751 235.274 185.64 235.274C192.269 235.274 198.543 234.594 204.462 233.233C210.381 231.872 215.548 229.706 219.961 226.736C224.375 223.766 227.869 219.918 230.444 215.191C233.018 210.465 234.305 204.76 234.305 198.075C234.305 193.263 233.613 189.037 232.227 185.398C230.842 181.759 228.83 178.499 226.189 175.616C223.549 172.733 220.348 170.093 216.587 167.697C212.826 165.3 208.579 163.033 203.845 160.894C200.431 159.402 197.361 157.953 194.634 156.545C191.907 155.138 189.571 153.709 187.627 152.258C185.683 150.807 184.167 149.27 183.078 147.645C181.989 146.021 181.444 144.223 181.444 142.251C181.444 140.453 181.924 138.829 182.883 137.378C183.842 135.927 185.187 134.672 186.919 133.612C188.651 132.552 190.738 131.731 193.182 131.147C195.625 130.564 198.352 130.273 201.362 130.273C203.546 130.273 205.857 130.448 208.292 130.797C210.728 131.147 213.185 131.687 215.663 132.418C218.141 133.15 220.576 134.057 222.968 135.142C225.359 136.227 227.608 137.487 229.714 138.922V112.62C225.568 111.011 221.047 109.782 216.15 108.934C211.253 108.086 205.605 107.662 199.209 107.662C192.645 107.662 186.48 108.391 180.713 109.847C174.946 111.303 169.866 113.553 165.475 116.594C161.083 119.636 157.58 123.487 154.966 128.148C152.352 132.808 151.045 138.338 151.045 144.739C151.045 152.559 153.269 159.265 157.715 164.858C162.162 170.45 169.217 175.263 178.88 179.294C182.554 180.873 185.943 182.43 189.048 183.968C192.152 185.505 194.851 187.085 197.143 188.71C199.436 190.335 201.253 192.09 202.595 193.975C203.938 195.861 204.609 197.962 204.609 200.28C204.609 201.99 204.173 203.571 203.301 205.022C202.429 206.473 201.149 207.728 199.461 208.788C197.773 209.848 195.712 210.669 193.278 211.253C190.844 211.836 188.074 212.128 184.968 212.128C179.604 212.128 174.304 211.198 169.069 209.34C163.833 207.481 158.969 204.717 154.479 201.046L150.518 200.475ZM113.719 131.807H148.569V109.674H51.6748V131.807H86.0066V232.1H113.719V131.807Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-foreground">TypeScript</div>
              <div class="text-sm text-muted-foreground">Type Safety</div>
            </div>
          </div>

          <div class="text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <!-- Tailwind CSS Logo SVG -->
              <svg class="w-10 h-10" viewBox="0 0 256 154" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 91.733 27.733 108.8 32C118.537 34.452 125.493 41.523 133.207 49.369C145.707 62.095 160.199 76.8 192 76.8C226.133 76.8 247.467 59.733 256 25.6C243.2 42.667 228.267 49.067 211.2 44.8C201.463 42.348 194.507 35.277 186.793 27.431C174.293 14.705 159.801 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128C12.8 110.933 27.733 104.533 44.8 108.8C54.537 111.252 61.493 118.323 69.207 126.169C81.707 138.895 96.199 153.6 128 153.6C162.133 153.6 183.467 136.533 192 102.4C179.2 119.467 164.267 125.867 147.2 121.6C137.463 119.148 130.507 112.077 122.793 104.231C110.293 91.505 95.801 76.8 64 76.8Z" fill="#06B6D4"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-foreground">Tailwind CSS</div>
              <div class="text-sm text-muted-foreground">Utility First</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Prêt à Commencer ?
        </h2>
        <p class="text-xl text-muted-foreground mb-8">
          Lancez votre projet en quelques minutes avec Nuxt Dashboard Pro
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register">
            <DpButton variant="primary" size="lg">
              <Icon name="lucide:rocket" class="w-5 h-5 mr-2" />
              Créer un Compte
            </DpButton>
          </NuxtLink>
          <NuxtLink to="/">
            <DpButton variant="outline" size="lg">
              <Icon name="lucide:arrow-left" class="w-5 h-5 mr-2" />
              Retour à l'Accueil
            </DpButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center text-muted-foreground">
          <p>&copy; 2024 Nuxt Dashboard Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
