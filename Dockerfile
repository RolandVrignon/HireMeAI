# Utiliser une image de base officielle Node.js (avec Alpine pour réduire la taille de l'image)
FROM node:20-alpine AS base

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json* ./ 

# Installer les dépendances
RUN npm install --frozen-lockfile

# Copier tout le code de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape de production : démarrer l'application
FROM node:20-alpine AS production
WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape précédente
COPY --from=base /app /app

# Installer uniquement les dépendances de production
RUN npm prune --production

# Définir la commande par défaut pour démarrer l'application
CMD ["npm", "run", "start"]
