# 📱 Install Your KhaoPiyo App on iPhone

## 🎯 **EASIEST METHOD: Expo Go + QR Code**

### Step 1: Start Development Server
```bash
npm start
# or
expo start
```

### Step 2: Install Expo Go on iPhone
- Open App Store on your iPhone
- Search for "Expo Go" 
- Install the official Expo Go app

### Step 3: Scan QR Code
- Open your terminal where `npm start` is running
- You'll see a QR code
- Open Expo Go app on iPhone
- Scan the QR code
- Your app will load on iPhone!

---

## 🏗️ **PERMANENT INSTALLATION: Standalone App**

### Option A: Using TestFlight (Best Option)

1. **Get Apple Developer Account** ($99/year or free with limitations)
   - Visit: https://developer.apple.com
   - Sign up with your Apple ID

2. **Build & Upload to TestFlight**
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

3. **Install via TestFlight**
   - Download TestFlight app from App Store
   - Get invite link from Apple Developer Console
   - Install your app permanently!

### Option B: Using AltStore (Free but Limited)

1. **Install AltStore on iPhone**
   - Visit: https://altstore.io
   - Follow installation guide (requires computer)

2. **Build IPA file**
   ```bash
   eas build --platform ios --profile preview
   ```

3. **Sideload via AltStore**
   - Download the .ipa file from EAS build
   - Install via AltStore
   - App stays for 7 days, then needs refresh

### Option C: Enterprise Distribution (Advanced)

If you have access to an enterprise certificate, you can create a permanently installable .ipa file.

---

## 🚀 **Quick Start (Recommended for Testing)**

1. Run: `npm start` in your project folder
2. Install "Expo Go" app on your iPhone
3. Scan the QR code that appears in terminal
4. Enjoy your app on iPhone! 📱

---

## 🛠️ **Troubleshooting**

- **QR Code not working?** Make sure your phone and computer are on same WiFi
- **App not loading?** Check if Metro bundler is running
- **Build failing?** Ensure you're logged into Expo account: `eas login`

## 📞 **Need Help?**

Your app "KhaoPiyo" is configured and ready to build!
- EAS Project ID: 0bcdc384-60aa-455c-9915-59f11a4ab907
- Project URL: https://expo.dev/accounts/sagarguptaofiicial/projects/khaopiyo
