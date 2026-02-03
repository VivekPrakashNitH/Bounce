# URL Routing Structure for BounceGame

## Overview
The application has been migrated from a `viewState`-based navigation system to **URL-based routing** using React Router v6. This provides better browser history support, shareable URLs, and cleaner navigation.

---

## Route Structure

### Entry Routes
- **`/`** → Redirects to `/intro`
- **`/intro`** → Landing page with intro/onboarding (BeCuriousIntro component)
- **`/home`** → Home/dashboard with learning tracks (LandingPage component)
- **`*`** (catch-all) → Redirects to `/intro`

---

## System Design Routes

### Main System Design Path
- **`/system-design`** → Shows system design page
- **`/system-design/level-:levelId`** → Specific level (e.g., `/system-design/level-1`, `/system-design/level-2`)
  - Level 1: Client-Server
  - Level 2: Load Balancer
  - Level 3: API Gateway
  - Level 4: Caching
  - Level 5: Database Sharding
  - Level 6: Docker
  - Level 7: Message Queues
  - And more...

### System Design Components
- **`/system-design/hld-vs-lld`** → HLD vs LLD Explainer component

---

## Case Studies Routes
- **`/case-studies`** → Case studies listing
- **`/case-studies/url-shortener`** → URL Shortener case study
- **`/case-studies/instagram`** → Instagram-scale case study
- **`/case-studies/uber`** → Uber case study
- **`/case-studies/quadtree`** → Quadtree visualization

---

## Game Engineering Routes
- **`/gaming`** → Gaming section
- **`/gaming/intro`** → Game engineering introduction
- **`/gaming/architecture`** → Game architecture
- **`/gaming/networking`** → Game networking
- **`/gaming/physics`** → Physics/Hit detection
- **`/gaming/loop`** → Game loop
- **`/gaming/order-book`** → Order matching system

---

## Cybersecurity Routes
- **`/cybersecurity`** → Cybersecurity section
- **`/cybersecurity/encryption`** → Encryption fundamentals
- **`/cybersecurity/sql-injection`** → SQL injection vulnerabilities

---

## Example Navigation

### From Home to System Design Level 1
```
/home → (click "System Design") → /system-design/level-1
```

### From Level to Level
```
/system-design/level-1 → (click "Next") → /system-design/level-2
```

### Jumping to a Specific Level
```
/home → (click "Roadmap") → (select level 5) → /system-design/level-5
```

### Switching Tracks
```
/system-design/level-3 → (click "Home") → /home → (click "Game Dev") → /gaming/intro
```

---

## Key Files Modified

1. **`frontend/router.tsx`** - New router configuration file
2. **`frontend/index.tsx`** - Updated to use RouterProvider
3. **`frontend/pages/GamePage.tsx`** - New component replacing game logic from App.tsx
4. **`frontend/components/pages/LandingPage.tsx`** - Updated to use useNavigate hook
5. **`frontend/components/pages/BeCuriousIntro.tsx`** - Updated to use useNavigate hook

---

## Implementation Details

### Navigation Hooks Used
- **`useNavigate()`** - To programmatically navigate
- **`useParams()`** - To extract URL parameters (levelId, caseId, gameLevel, cyberTopic)
- **`useLocation()`** - To get current location for route-based logic

### Route Parameter Mapping
URL parameters are mapped to GameState enum values:
```typescript
levelId "1" → GameState.LEVEL_CLIENT_SERVER
caseId "url-shortener" → GameState.CASE_URL_SHORTENER
gameLevel "networking" → GameState.LEVEL_GAME_NETWORKING
cyberTopic "encryption" → GameState.LEVEL_CYBER_ENCRYPTION
```

---

## Browser History & Deep Linking
Users can now:
- ✅ Share direct links to specific levels
- ✅ Use browser back/forward buttons
- ✅ Bookmark favorite levels
- ✅ See route in address bar

Example shareable links:
- `yoursite.com/system-design/level-5`
- `yoursite.com/gaming/networking`
- `yoursite.com/cybersecurity/encryption`

---

## Future Enhancements
- Add progress persistence by URL
- Implement query parameters for filters
- Add hash-based routing for specific sections within levels
- Consider lazy-loading routes for code splitting
