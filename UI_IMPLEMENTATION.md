# AMD Dashboard - Modern UI Implementation Guide

## Overview

A complete modern UI redesign for the Advanced Answering Machine Detection (AMD) telephony application with:
- **Sleek dialer interface** with real-time status
- **AMD strategy comparison dashboard** with metrics
- **Enhanced call history** with filters and export
- **Modern authentication** flow
- **Responsive sidebar layout** with mobile bottom navigation
- **Light/Dark mode** support
- **Toast notifications** for real-time feedback

## Installation & Setup

### 1. Install Dependencies

```bash
cd amd-app
npm install
```

This installs:
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui components** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Recharts** - Charting library for AMD comparisons
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Utility class merging

### 2. Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to `/login`

## Design System

### Color Palette

**Light Mode:**
- Primary: Vibrant Blue (`#3B82F6`)
- Background: White (`#FFFFFF`)
- Foreground: Dark Blue-Grey (`#0F172A`)
- Muted: Soft Grey (`#F1F5F9`)
- Border: Light Grey (`#E2E8F0`)

**Dark Mode:**
- Primary: Bright Blue (`#60A5FA`)
- Background: Very Dark Blue (`#0F172A`)
- Foreground: Off-White (`#F8FAFC`)
- Muted: Dark Grey-Blue (`#1E293B`)
- Border: Dark Grey (`#334155`)

### Typography

- **Font**: System UI stack (native fonts for best performance)
- **Headings**: Bold/Semibold, 24-36px
- **Body**: Regular, 14px
- **Small**: 12px for labels/captions

### Icons

Using **Lucide React** for consistent, beautiful icons:
- `Phone` - Dialer, calls
- `UserCheck` - Human detected
- `Bot` - Machine detected
- `History` - Call logs
- `BarChart3` - Comparisons
- `Settings` - Configuration
- `Loader2` - Loading states (animated)
- `AlertCircle` - Errors

## Page Implementations

### 1. Dialer Page (`/dialer`)

**Features:**
- Large phone input with E.164 validation
- AMD strategy dropdown with descriptions
- Prominent "Dial" button (primary, large)
- Real-time call status card with:
  - Status indicator (connecting/in-call/completed)
  - Animated loading spinner
  - Result badge (Human/Machine with confidence %)
  - Audio waveform visualization (gradient animation)
- Strategy information cards

**Status Colors:**
- Connecting: Blue
- In Call: Yellow
- Human: Green
- Machine: Orange
- Error: Red

**Mobile Optimizations:**
- Stacked cards (single column)
- Larger touch targets (44x44px minimum)
- Simplified status display

### 2. Call History Page (`/history`)

**Features:**
- Search bar (filters by phone number)
- Strategy filter dropdown
- Date range picker
- Export to CSV button
- Responsive table/card layout
- Status badges with icons
- Pagination controls
- Expandable rows for audio playback (optional)

**Table Columns:**
- Timestamp
- Phone Number
- AMD Strategy
- Status (with badge)
- Result (Human/Machine icon)
- Actions (View details, Hang up)

**Mobile View:**
- Cards instead of table
- Swipeable for actions
- Collapsible details

### 3. Comparison Dashboard (`/compare`)

**Features:**
- Grid of strategy cards (2 cols desktop, 1 mobile)
- Each card shows:
  - Strategy name + icon
  - Accuracy percentage
  - Average latency
  - Cost per call
  - Recent performance chart (Recharts)
- "Learn More" links
- Filter by date range
- Export comparison data

**Metrics Display:**
- Large numbers with units
- Color-coded performance (green/yellow/red)
- Trend indicators (up/down arrows)
- Mini sparkline charts

### 4. Authentication (`/login`)

**Features:**
- Centered card layout
- Email + password inputs
- "Sign In" button (primary, full-width)
- Error messages (inline, red)
- Animated transitions
- Modern gradient background
- "Remember me" checkbox (optional)
- "Forgot password?" link (optional)

**Styling:**
- Glassmorphism effect on card
- Subtle animations on focus
- Clear error states
- Loading spinner on submit

### 5. Home Dashboard (`/`)

**Features:**
- Welcome message with user name
- Quick stats cards:
  - Total calls today
  - Human detection rate
  - Machine detection rate
  - Average latency
- Recent calls list (last 5)
- Quick dial shortcut
- AMD strategy performance chart

## Layout Structure

### Desktop (≥768px)

```
┌─────────────────────────────────────┐
│ Sidebar (256px)  │  Main Content    │
│                  │                   │
│ • Home           │  ┌─────────────┐ │
│ • Dialer         │  │   Header    │ │
│ • History        │  ├─────────────┤ │
│ • Comparison     │  │             │ │
│ • Settings       │  │   Content   │ │
│                  │  │             │ │
│ [Sign Out]       │  └─────────────┘ │
└─────────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────┐
│                     │
│     Content         │
│     (Full Width)    │
│                     │
│                     │
├─────────────────────┤
│ [Home][Dial][Hist]  │ ← Bottom Nav
└─────────────────────┘
```

## Component Library

### UI Components Created

1. **Button** (`components/ui/button.tsx`)
   - Variants: default, secondary, outline, ghost, destructive
   - Sizes: sm, default, lg, icon
   - Loading state support

2. **Card** (`components/ui/card.tsx`)
   - CardHeader, CardTitle, CardDescription
   - CardContent, CardFooter
   - Responsive padding

3. **Input** (`components/ui/input.tsx`)
   - Focus ring
   - Disabled states
   - Error states (red border)

4. **Select** (`components/ui/select.tsx`)
   - Native select styled
   - Consistent with design system

5. **Badge** (`components/ui/badge.tsx`)
   - Variants: default, secondary, destructive, outline
   - Used for status indicators

### Layout Components

1. **Sidebar** (`components/layout/sidebar.tsx`)
   - Fixed left navigation
   - Active route highlighting
   - Sign out button at bottom

2. **MobileNav** (`components/layout/mobile-nav.tsx`)
   - Fixed bottom navigation
   - Icon + label
   - Active state

3. **ThemeProvider** (`components/providers/theme-provider.tsx`)
   - Light/Dark mode toggle
   - Persists to localStorage
   - System preference detection

## Real-Time Features

### Server-Sent Events (SSE)

Call status updates via `/api/stream/calls`:
- Initial snapshot on connection
- Updates every 3 seconds
- Heartbeat every 15 seconds
- Auto-reconnect on disconnect

**Client Implementation:**
```typescript
const es = new EventSource('/api/stream/calls');
es.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data?.items) setRows(data.items);
};
```

### Toast Notifications

Using **Sonner** for elegant toasts:
- Success: Green with checkmark
- Error: Red with alert icon
- Info: Blue with info icon
- Auto-dismiss after 5 seconds
- Stacked when multiple
- Close button

**Usage:**
```typescript
import { toast } from "sonner";

toast.success("Call initiated!");
toast.error("Failed to connect");
```

## Responsive Design

### Breakpoints

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets (sidebar appears)
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large desktops
- **2xl**: 1536px - Extra large screens

### Mobile Optimizations

1. **Bottom Navigation** instead of sidebar
2. **Stacked layouts** (single column)
3. **Larger touch targets** (44x44px minimum)
4. **Swipeable cards** for actions
5. **Collapsible sections** to save space
6. **Simplified tables** (cards on mobile)

### Tablet Optimizations

1. **2-column grids** for cards
2. **Sidebar visible** but collapsible
3. **Hybrid navigation** (sidebar + bottom)

## Accessibility

### WCAG AA Compliance

- **Contrast ratios**: 4.5:1 minimum for text
- **Focus indicators**: 2px visible ring on all interactive elements
- **Keyboard navigation**: Full support (Tab, Enter, Escape)
- **Screen readers**: Semantic HTML + ARIA labels
- **Touch targets**: 44x44px minimum
- **Alt text**: All images and icons

### Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` - Activate buttons/links
- `Escape` - Close modals/dropdowns
- `Arrow keys` - Navigate lists/tables

## Performance Optimizations

1. **Code splitting** - Dynamic imports for heavy components
2. **Image optimization** - Next.js Image component
3. **Lazy loading** - Components loaded on demand
4. **Memoization** - React.memo for expensive renders
5. **Virtual scrolling** - For large call history lists
6. **Debounced search** - Reduces API calls

## Testing

### Manual Testing Checklist

- [ ] Login/logout flow
- [ ] Dial a call with each AMD strategy
- [ ] View call history and filter
- [ ] Export call history to CSV
- [ ] View AMD comparison metrics
- [ ] Toggle light/dark mode
- [ ] Test on mobile device
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Ensure these are set in production:
```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=...
```

## Future Enhancements

1. **Audio playback** - Play recorded call audio
2. **Real-time waveform** - Visualize audio during call
3. **Advanced filters** - More granular call history filtering
4. **Custom reports** - Generate PDF reports
5. **Webhooks** - Real-time updates via WebSockets
6. **Multi-user** - Role-based access control
7. **Analytics dashboard** - Detailed AMD performance metrics
8. **A/B testing** - Compare AMD strategies side-by-side

## Troubleshooting

### TypeScript Errors

Run `npm install` to ensure all dependencies are installed. The TypeScript errors shown are due to missing node_modules.

### Styles Not Loading

Ensure `globals.css` is imported in `layout.tsx` and Tailwind is configured correctly.

### SSE Not Working

Check that `/api/stream/calls` endpoint is accessible and CORS is configured if using a different domain.

### Dark Mode Not Persisting

Verify `localStorage` is available and `ThemeProvider` is wrapping the app.

## Support

For issues or questions:
1. Check the Design System documentation (`DESIGN_SYSTEM.md`)
2. Review component examples in `/components/ui`
3. Test with the provided mock data
4. Ensure all environment variables are set

## Credits

- **UI Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner
- **Design Inspiration**: Modern SaaS dashboards

---

**Built with ❤️ for seamless AMD telephony management**
