#!/bin/bash
set -e

echo "🔄 Renommage du projet : nuxt-dashbaord-pro → nuxt-dashboard-pro"
echo ""

# 1. Vérifier qu'on est dans le bon répertoire
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" != *"nuxt-dashbaord-pro"* ]]; then
  echo "❌ Erreur : Ce script doit être exécuté depuis nuxt-dashbaord-pro"
  exit 1
fi

echo "✅ Répertoire actuel vérifié"

# 2. Mettre à jour .git/config
echo "📝 Mise à jour de .git/config..."
sed -i 's|nuxt-dashbaord-pro|nuxt-dashboard-pro|g' .git/config
echo "✅ .git/config mis à jour"

# 3. Mettre à jour .idea/modules.xml
echo "📝 Mise à jour de .idea/modules.xml..."
sed -i 's|nuxt-dashbaord-pro|nuxt-dashboard-pro|g' .idea/modules.xml
echo "✅ .idea/modules.xml mis à jour"

# 4. Renommer .idea/nuxt-dashbaord-pro.iml
if [ -f ".idea/nuxt-dashbaord-pro.iml" ]; then
  echo "📝 Renommage de .idea/nuxt-dashbaord-pro.iml..."
  mv .idea/nuxt-dashbaord-pro.iml .idea/nuxt-dashboard-pro.iml
  echo "✅ Fichier .iml renommé"
fi

# 5. Commit des changements Git et IDE
echo "📝 Commit des changements de configuration..."
git add .git/config .idea/modules.xml .idea/nuxt-dashboard-pro.iml
git commit -m "chore: fix typo in project name (dashbaord → dashboard)

- Update Git remote URL to nuxt-dashboard-pro
- Update IDE configuration files
- Rename .iml file to match new project name" || echo "⚠️  Pas de changements à commiter (déjà à jour)"

# 6. Sortir du répertoire et le renommer
echo "📁 Renommage du répertoire principal..."
cd ..
mv nuxt-dashbaord-pro nuxt-dashboard-pro
echo "✅ Répertoire renommé"

echo ""
echo "🎉 Renommage terminé avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. cd /home/franck/workspace/nuxt-dashboard-pro"
echo "2. Relancer Claude Code dans ce nouveau répertoire"
echo "3. Exécuter : npm install"
echo "4. Exécuter : git fetch"
echo "5. Exécuter : git push (pour synchroniser les commits)"
echo ""
