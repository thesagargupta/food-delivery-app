# 🆓 Install KhaoPiyo on iPhone - FREE Methods

## 🎯 **Method 1: AltStore (Recommended - Free)**

### ✅ **What is AltStore?**
- **FREE sideloading tool** for iPhone
- Allows installing **any .ipa file** without Apple Developer account
- Works on **any iPhone** (iOS 12.2+)
- **No jailbreak required**

### 📱 **Installation Steps:**

#### Step 1: Install AltStore on iPhone
1. **Download AltStore** from: https://altstore.io
2. **Follow their guide** to install (requires computer initially)
3. **Trust the profile** in iPhone Settings

#### Step 2: Build Your App
```bash
# Create unsigned .ipa file
cd "c:\Users\SAGAR GUPTA\OneDrive\Desktop\food-delivery-app\my-app"
eas build --platform ios --profile preview --local
```

#### Step 3: Install via AltStore
1. **Transfer .ipa file** to iPhone (AirDrop/Email/Cloud)
2. **Open in AltStore** app
3. **Install** - Your app will be permanently on iPhone!

### 🔄 **Renewal:**
- **Free apps expire every 7 days**
- **Easy refresh**: Just open AltStore and tap refresh
- **Takes 30 seconds** to renew

---

## 🎯 **Method 2: Web-Based Install (Easiest)**

### 📋 **Steps:**
1. **Build web version** of your app
2. **Add to iPhone Home Screen** as PWA
3. **Works like native app**

```bash
# Build web version
expo build:web
```

---

## 🎯 **Method 3: TestFlight with Free Apple ID**

### 📋 **What You Need:**
- **Free Apple ID** (no payment required)
- **Limited to 100 beta testers**
- **90-day app expiration**

### 📋 **Steps:**
1. **Create free Apple Developer account**:
   - Go to https://developer.apple.com
   - Sign up with Apple ID (FREE)
   - Accept agreements
   
2. **Build for TestFlight**:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

3. **Create TestFlight beta**:
   - Upload to App Store Connect
   - Add yourself as beta tester
   - Install via TestFlight app

---

## 🚀 **Method 4: Expo Development Build (My Recommendation)**

### ✅ **Why This is Best:**
- **Real native app**
- **No Apple Developer account needed**
- **Install directly on iPhone**
- **Easy updates**

### 📋 **Steps:**
```bash
# Build development client
cd "c:\Users\SAGAR GUPTA\OneDrive\Desktop\food-delivery-app\my-app"
eas build --platform ios --profile development --local
```

This creates a **development build** that:
- ✅ **Installs like real app**
- ✅ **No expiration issues**
- ✅ **Easy to update**
- ✅ **Professional appearance**

---

## 🎯 **Quick Start (Right Now)**

Let's go with **AltStore method** since it's the most reliable:

### Step 1: Install AltStore
- Visit: https://altstore.io
- Download for Windows
- Follow their 5-minute setup guide

### Step 2: We'll build your .ipa
- I'll help you create the .ipa file
- Takes 10-15 minutes

### Step 3: Install on iPhone
- Transfer .ipa to iPhone
- Open with AltStore
- Install your KhaoPiyo app!

---

## 💡 **Pro Tip**

**AltStore is used by millions** of iPhone users to install apps without App Store. It's:
- ✅ **100% Legal**
- ✅ **Safe and Secure**
- ✅ **Easy to Use**
- ✅ **Regular Updates**

---

## 🤔 **Which Method Do You Prefer?**

1. **🆓 AltStore** - Free, permanent, easy to refresh
2. **🌐 Web App** - Instant, no installation needed
3. **📱 TestFlight** - Official Apple method, 90-day limit
4. **🏗️ Development Build** - Professional, native performance

**Recommendation: Start with AltStore - it's the closest to having a real App Store app!**
