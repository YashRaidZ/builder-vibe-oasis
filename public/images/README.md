# IndusNetwork Image Assets

This directory contains all image assets for the IndusNetwork Minecraft server management system.

## 📁 Folder Structure

```
images/
├── logos/              # Brand logos and icons
├── ranks/              # Rank badges (VIP, MVP, LEGEND, etc.)
├── packs/              # Item pack images (starter, builder, etc.)
├── backgrounds/        # Background images and patterns
├── ui/                 # UI elements (coins, gems, etc.)
├── icons/              # General icons
├── players/            # Player avatars and skins
└── achievements/       # Achievement badges
```

## 🎨 Image Specifications

### Logos
- **Format**: SVG preferred, PNG for complex graphics
- **Size**: 200x60px for main logo
- **Background**: Transparent
- **Colors**: Blue (#3B82F6) to Purple (#8B5CF6) gradient

### Rank Badges
- **Format**: SVG
- **Size**: 100x100px
- **Style**: Crown-based design with rank-specific colors
  - VIP: Gold (#F59E0B)
  - MVP: Cyan (#06B6D4)
  - LEGEND: Emerald (#10B981)

### Pack Images
- **Format**: SVG
- **Size**: 120x120px
- **Style**: Chest with floating items representing the pack contents

### UI Elements
- **Format**: SVG
- **Size**: Variable (optimized for use case)
- **Style**: Consistent with blue/purple theme

### Player Avatars
- **Format**: SVG/PNG
- **Size**: 64x64px (Minecraft head style)
- **Style**: Pixelated Minecraft-style heads

### Achievement Badges
- **Format**: SVG
- **Size**: 80x80px
- **Style**: Circular badges with achievement-specific icons

## 🖼️ Current Assets

### Logos
- ✅ `indusnetwork-logo.svg` - Main brand logo

### Ranks
- ✅ `vip-badge.svg` - VIP rank badge
- ✅ `mvp-badge.svg` - MVP rank badge  
- ✅ `legend-badge.svg` - LEGEND rank badge
- ⏳ `default-badge.svg` - Default player badge

### Packs
- ✅ `starter-kit.svg` - Starter pack image
- ✅ `builder-kit.svg` - Builder pack image
- ⏳ `combat-kit.svg` - Combat pack image
- ⏳ `premium-kit.svg` - Premium pack image

### UI Elements
- ✅ `coins.svg` - Currency icon
- ⏳ `gems.svg` - Premium currency icon
- ⏳ `loading.svg` - Loading spinner
- ⏳ `error.svg` - Error state icon

### Players
- ✅ `default-avatar.svg` - Default player avatar
- ⏳ `male-avatar.svg` - Male player avatar
- ⏳ `female-avatar.svg` - Female player avatar

### Achievements  
- ✅ `first-kill.svg` - First kill achievement
- ⏳ `master-builder.svg` - Master builder achievement
- ⏳ `rich-player.svg` - Rich player achievement
- ⏳ `long-player.svg` - Long playtime achievement

### Backgrounds
- ✅ `pattern.svg` - Background pattern
- ⏳ `hero-bg.jpg` - Hero section background
- ⏳ `gaming-bg.jpg` - Gaming background

## 🔧 Usage

Import the image utilities in your components:

```typescript
import { images, getRankImage, getPackImage } from '@/lib/images';

// Direct usage
<img src={images.logos.main} alt="IndusNetwork" />

// Helper functions
<img src={getRankImage('vip')} alt="VIP Rank" />
<img src={getPackImage('starter-kit')} alt="Starter Kit" />
```

## 📝 TODO - Missing Assets

### High Priority
- [ ] Default rank badge
- [ ] Combat kit image  
- [ ] Premium kit image
- [ ] Gems UI icon
- [ ] Loading spinner
- [ ] Error state icon

### Medium Priority
- [ ] Male/female player avatars
- [ ] Additional achievement badges
- [ ] Hero background image
- [ ] Gaming background image
- [ ] Icon set (sword, shield, crown, star)

### Low Priority
- [ ] Animated versions of static images
- [ ] Dark/light theme variants
- [ ] Seasonal/event-specific assets
- [ ] Custom Minecraft skin integration

## 🎯 Design Guidelines

1. **Consistency**: All assets should follow the blue/purple theme
2. **Scalability**: Use SVG when possible for crisp rendering
3. **Performance**: Optimize file sizes without losing quality
4. **Accessibility**: Include meaningful alt text and descriptions
5. **Responsive**: Ensure assets work well at different sizes

## 🔄 Image Replacement

To replace placeholder images:

1. Create new image with same filename
2. Ensure dimensions match specifications
3. Test across different screen sizes
4. Update this README if specifications change

## 📱 Responsive Considerations

- Use CSS `object-fit` for proper scaling
- Provide multiple sizes for critical images
- Consider WebP format for better compression
- Implement lazy loading for non-critical images

## 🎮 Minecraft Integration

For Minecraft-specific assets:
- Use official Minecraft color palette
- Maintain pixelated aesthetic for game-related images
- Consider block-based designs for UI elements
- Respect Minecraft's visual style guidelines
