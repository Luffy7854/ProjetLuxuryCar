# 🚗 Luxury Car Rent

**Luxury Car Rent** est une application web de location de voitures de luxe, réalisée dans le cadre d’un projet scolaire. Elle permet à des utilisateurs de réserver des véhicules haut de gamme pour la route ou pour des circuits, avec un système de paiement en ligne sécurisé via Stripe. Une interface d’administration permet également de gérer les voitures, les utilisateurs et les réservations.

---

## ✨ Fonctionnalités

### 🔒 Authentification
- Inscription et connexion d’utilisateurs
- Rôles : `utilisateur` (client) ou `administrateur` (gestionnaire)

### 🚘 Utilisateur
- Parcours visuel des voitures (carousel par type : route ou circuit)
- Filtrage des voitures par marque
- Sélection de dates et de ville (pour les voitures de route)
- Réservation via paiement Stripe sécurisé
- Historique des réservations avec suppression possible

### 🛠️ Administrateur
- Interface de gestion des voitures (ajout/suppression)
- Interface de gestion des utilisateurs
- Suppression de réservations en cours
- Suivi de l’historique global

---

## ⚙️ Installation

### 🔗 Prérequis
- Node.js
- MySQL (ou MariaDB)
- Un compte Stripe
- Git

### 📦 Étapes

1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/ton-utilisateur/LuxuryCarRent.git
   cd LuxuryCarRent
   ```

2. **Back-end :**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   > Remplir `.env` avec vos variables :
   ```
   DB_NAME=...
   DB_USER=...
   DB_PASS=...
   STRIPE_SECRET_KEY=...
   ```

   Puis :
   ```bash
   npm start
   ```

3. **Front-end :**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

L'application est maintenant disponible sur : `http://localhost:3000/`.

---

## 🧭 Mode d'emploi

### 👤 Utilisateur
1. S’inscrire ou se connecter
2. Choisir une marque (facultatif)
3. Naviguer parmi les voitures ou circuits
4. Cliquer sur "Réserver"
5. Remplir les informations de réservation
6. Payer via Stripe
7. Visualiser les réservations dans la section dédiée

### 👨‍💼 Administrateur
1. Se connecter avec un compte admin
2. Accéder au panneau d’administration
3. Gérer les utilisateurs, voitures, réservations
4. Supprimer les éléments au besoin

---

## 📌 Remarques

- Toutes les réservations sont mises à jour automatiquement à l’état **"terminé"** si la date est dépassée.
- Le paiement Stripe est obligatoire pour confirmer une réservation.
- Les réservations sont bloquées pour les dates déjà prises.

---

## ✍️ Auteur

Ce projet a été réalisé par MASSE Thibault - FERNANDEZ Bastien - FELIS Nicolas dans le cadre d’un projet scolaire à l’ESME.