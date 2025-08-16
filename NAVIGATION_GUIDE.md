# KhaoPiyo - Food Delivery App

## 📁 Project Structure

```
my-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.jsx      # Home tab
│   │   ├── menu.jsx       # Menu tab
│   │   ├── deals.jsx      # Deals tab
│   │   ├── orders.jsx     # Orders tab
│   │   ├── profile.jsx    # Profile tab
│   │   └── _layout.jsx    # Tab navigator layout
│   ├── cart.jsx           # Cart modal/screen
│   └── _layout.jsx        # Root stack layout
├── screens/               # All screen components
│   ├── home.jsx           # Home screen component
│   ├── menu.jsx           # Menu screen component
│   ├── cart.jsx           # Cart screen component
│   ├── deals.jsx          # Deals screen component
│   ├── orders.jsx         # Orders screen component
│   ├── profile.jsx        # Profile screen component
│   └── index.js           # Screen exports
├── components/            # Reusable UI components
│   ├── Header.jsx         # Custom header
│   ├── Button.jsx         # Custom button
│   ├── Card.jsx           # Card container
│   ├── SafeScreen.jsx     # Safe area wrapper
│   └── index.js           # Component exports
└── styles/                # Common styles and theme
    └── index.js           # Colors, spacing, typography
```

## 🧭 Navigation Structure

### Tab Navigation (Main App Flow)
```
┌─────────────────────────────────────────────┐
│  🏠 Home  │  🍽️ Menu  │  🎁 Deals  │  📋 Orders  │  👤 Profile  │
├─────────────────────────────────────────────┤
│                                             │
│           Screen Content                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Tab Features:**
- **Home**: Welcome screen with categories and popular restaurants
- **Menu**: Browse food items and add to cart
- **Deals**: Special offers and discount codes (with 🔥 badge)
- **Orders**: Order history with status tracking
- **Profile**: User profile and app settings

### Stack Navigation (Modal Screens)
- **Cart**: Accessible from any screen via navigation

## 🎨 Professional Design Features

### Tab Bar Styling
- **Zomato/Swiggy-inspired design** with professional look
- **Elevated shadow** for depth
- **Dynamic icons** (filled when active, outlined when inactive)
- **Color theming** (dark/light mode support)
- **Badge indicators** (🔥 for hot deals)
- **Smooth animations** and transitions

### Screen Features
- **Responsive safe area** handling for notches and status bars
- **Professional card layouts** with shadows and rounded corners
- **Consistent color scheme** throughout the app
- **Vector icons** from Expo Vector Icons
- **Dark mode support** for all screens

## 🚀 How to Use

### Tab Navigation
Users can seamlessly switch between main app sections using the bottom tab bar. Each tab maintains its own state and navigation history.

### Adding Cart Functionality
Cart is accessible as a modal screen from any tab:

```jsx
import { router } from 'expo-router';

// Navigate to cart from any screen
const goToCart = () => {
  router.push('/cart');
};
```

### Adding New Screens

1. **Create Screen Component**: Add new screen in `/screens/` folder
2. **Export Screen**: Add to `/screens/index.js`
3. **Add to Tab Navigation**: Update `/app/(tabs)/_layout.jsx`
4. **Create Tab File**: Add `/app/(tabs)/newscreen.jsx`

### Navigation Between Tabs

Tabs automatically handle navigation. For programmatic navigation:

```jsx
import { router } from 'expo-router';

// Navigate to specific tab
router.push('/(tabs)/deals');  // Go to deals tab
router.push('/cart');          // Go to cart modal
```

### Current Screen Features

#### 🏠 Home Screen
- Welcome message with app branding
- Category selection with icons
- Deals carousel with images
- Popular restaurants grid
- Responsive search bar

#### 🍽️ Menu Screen
- Food categories and items
- Add to cart functionality
- Price display with currency
- Professional card layouts

#### 🎁 Deals Screen
- Special offers with discount badges
- Coupon codes with copy functionality
- Beautiful image backgrounds
- Terms and conditions

#### 📋 Orders Screen
- Order history with status tracking
- Filter tabs (All, Active, Delivered, Cancelled)
- Status indicators with icons and colors
- Reorder functionality

#### 👤 Profile Screen
- User profile with photo
- Menu items with navigation arrows
- Professional settings layout
- Logout functionality

#### 🛒 Cart Screen
- Empty state with call-to-action
- Order summary (when items added)
- Checkout functionality
- Back navigation

## 🎯 Professional Features

### Design System
- **Consistent spacing** using predefined values
- **Color palette** with primary, secondary, and semantic colors
- **Typography scale** with proper hierarchy
- **Component library** for reusability

### User Experience
- **Smooth animations** and transitions
- **Intuitive navigation** patterns
- **Professional iconography** from Vector Icons
- **Accessibility** considerations
- **Performance optimizations**

### Code Quality
- **Modular architecture** with clear separation
- **Reusable components** for consistency
- **Type safety** with proper imports
- **Error handling** and validation
- **Clean code** principles

## 🛠️ Commands

```bash
# Start development server
npx expo start

# Clear cache and restart
npx expo start --clear

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

## 🔧 Customization

### Adding Cart Badge
To show cart item count on tab bar:

```jsx
// In tab layout, add badge to any tab
<Tab.Screen 
  name="orders" 
  component={OrdersScreen}
  options={{
    tabBarBadge: cartCount > 0 ? cartCount : null,
  }}
/>
```

### Custom Tab Bar
For advanced customization, you can create custom tab bar components in the tab navigator configuration.

---

**Your KhaoPiyo app now has a professional tab navigation system like Zomato and Swiggy! 🚀**
