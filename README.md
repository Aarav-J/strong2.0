
# 💪 AaravStrong

AaravStrong is a modern, customizable fitness tracker and workout planner built with React Native, Expo, and TypeScript. It features a beautiful UI, advanced filtering, custom templates, and a smooth mobile experience for tracking your workouts and progress.

---

## 🚀 Features

- 📅 **Workout Templates**: Create, view, and start custom workout routines
- 🏋️ **Exercise Library**: Browse, search, and filter hundreds of exercises by muscle group, equipment, and more
- 🔍 **Advanced Filtering**: Filter exercises by body part, equipment, and search with fuzzy matching
- 📝 **Add Exercises**: Add new exercises to your workout with a modern modal interface
- 🧮 **Custom Numpad**: Enter reps, sets, and weights with a sleek, animated numpad
- 📈 **Progress Tracking**: Track your sets, reps, and weights for each exercise
- 🕒 **Rest Timer**: Built-in rest timer with notifications
- 🌙 **Dark Mode**: Beautiful dark UI throughout
- 📱 **Mobile-First**: Fully responsive and optimized for iOS and Android

---

## 🖼️ Screenshots

<p align="center">
  <img src="./assets/images/screenshot1.png" width="200" />
  <img src="./assets/images/screenshot2.png" width="200" />
  <img src="./assets/images/screenshot3.png" width="200" />
</p>

---

## 🛠️ Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)
- [PapaParse](https://www.papaparse.com/) (CSV parsing)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

## 🏗️ Project Structure

```
/aaravstrong
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   └── exercises.tsx
│   └── _layout.tsx
├── components/
│   ├── ExerciseList/
│   │   ├── ExercisePreview.tsx
│   │   ├── ExerciseInfo.tsx
│   │   └── Filter.tsx
│   ├── Numpad.tsx
│   ├── Button.tsx
│   ├── Header.tsx
│   └── ...
├── assets/
│   ├── images/
│   └── exercises.csv
├── store.ts
├── utils/
│   └── utils.ts
├── App.tsx
└── README.md
```

---

## 🏃 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Aarav-J/strong2.0.git
cd strong2.0/aaravstrong
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Start the Expo app
```bash
npx expo start
```

### 4. Open on your device
- Scan the QR code with the Expo Go app (iOS/Android)
- Or run on an emulator with `i` (iOS) or `a` (Android)

---

## ✨ Customization
- Add your own exercises to `assets/exercises.csv`
- Add images to `assets/images/`
- Edit templates and workouts in the app

---

## 📦 Scripts
- `npm start` — Start Expo dev server
- `npm run build` — Build the app for production
- `npm run lint` — Lint the codebase

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT

---

## 🙏 Acknowledgements
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [PapaParse](https://www.papaparse.com/)
- [All open source contributors!](https://github.com/Aarav-J/strong2.0/graphs/contributors)
