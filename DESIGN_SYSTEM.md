# AMD Dashboard - Design System

## Color Palette

### Light Mode
- **Primary**: `hsl(221.2, 83.2%, 53.3%)` - Vibrant Blue
- **Secondary**: `hsl(210, 40%, 96.1%)` - Light Grey
- **Background**: `hsl(0, 0%, 100%)` - White
- **Foreground**: `hsl(222.2, 84%, 4.9%)` - Dark Blue-Grey
- **Muted**: `hsl(210, 40%, 96.1%)` - Soft Grey
- **Accent**: `hsl(210, 40%, 96.1%)` - Accent Grey
- **Destructive**: `hsl(0, 84.2%, 60.2%)` - Red
- **Border**: `hsl(214.3, 31.8%, 91.4%)` - Light Border

### Dark Mode
- **Primary**: `hsl(217.2, 91.2%, 59.8%)` - Bright Blue
- **Secondary**: `hsl(217.2, 32.6%, 17.5%)` - Dark Grey-Blue
- **Background**: `hsl(222.2, 84%, 4.9%)` - Very Dark Blue
- **Foreground**: `hsl(210, 40%, 98%)` - Off-White
- **Muted**: `hsl(217.2, 32.6%, 17.5%)` - Muted Dark
- **Accent**: `hsl(217.2, 32.6%, 17.5%)` - Accent Dark
- **Destructive**: `hsl(0, 62.8%, 30.6%)` - Dark Red
- **Border**: `hsl(217.2, 32.6%, 17.5%)` - Dark Border

## Typography

- **Font Family**: System UI stack (system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- **Headings**: 
  - H1: 2.25rem (36px), font-bold
  - H2: 1.875rem (30px), font-semibold
  - H3: 1.5rem (24px), font-semibold
  - H4: 1.25rem (20px), font-medium
- **Body**: 0.875rem (14px), font-normal
- **Small**: 0.75rem (12px), font-normal

## Iconography

Using **Lucide React** icons:
- **Home**: Home icon
- **Dialer**: Phone icon
- **History**: History icon
- **Comparison**: BarChart3 icon
- **Settings**: Settings icon
- **User**: User icon
- **Human Result**: UserCheck icon
- **Machine Result**: Bot icon
- **Error**: AlertCircle icon
- **Success**: CheckCircle icon
- **Loading**: Loader2 icon (animated)

## Components

### Button Variants
- **Default**: Primary blue background
- **Secondary**: Grey background
- **Outline**: Border only
- **Ghost**: Transparent with hover
- **Destructive**: Red for dangerous actions

### Card
- Rounded corners (0.5rem)
- Subtle shadow
- Border for definition
- Padding: 1.5rem (24px)

### Input
- Height: 2.5rem (40px)
- Border radius: 0.375rem (6px)
- Focus ring: Primary color

### Badge
- Small, rounded pill
- Variants: default, secondary, destructive, outline
- Used for status indicators

## Layout Structure

### Desktop (≥768px)
- **Sidebar**: Fixed left, 256px width
- **Main Content**: Flexible, max-width 1400px
- **Header**: 64px height
- **Spacing**: 24px grid

### Mobile (<768px)
- **Bottom Navigation**: Fixed, 56px height
- **Content**: Full width with padding
- **Cards**: Stacked vertically
- **Spacing**: 16px grid

## Status Colors

- **Connecting**: Blue (`text-blue-500`)
- **In Progress**: Yellow (`text-yellow-500`)
- **Human Detected**: Green (`text-green-500`)
- **Machine Detected**: Orange (`text-orange-500`)
- **Error**: Red (`text-red-500`)
- **Completed**: Grey (`text-grey-500`)

## Accessibility

- **Contrast Ratios**: WCAG AA compliant (4.5:1 minimum)
- **Focus Indicators**: Visible 2px ring
- **Touch Targets**: Minimum 44x44px
- **Screen Reader**: Semantic HTML, ARIA labels
- **Keyboard Navigation**: Full support with Tab/Enter/Escape

## Animation

- **Transitions**: 200ms ease-out
- **Hover Effects**: Scale 1.02, opacity 0.9
- **Loading Spinners**: Rotate animation
- **Toast Notifications**: Slide in from top-right
- **Page Transitions**: Fade 150ms

## Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Component Patterns

### Dialer Card
- Large, centered
- Phone input with validation
- Strategy dropdown
- Prominent call button (primary, large)
- Real-time status indicator below

### Call History Table
- Responsive (cards on mobile)
- Sortable columns
- Search/filter bar
- Export button (top-right)
- Pagination (bottom)
- Status badges
- Expandable rows for details

### AMD Comparison Cards
- Grid layout (2 cols on desktop, 1 on mobile)
- Icon + title
- Key metrics (accuracy, latency, cost)
- Visual chart/graph
- "Learn More" link

### Toast Notifications
- Top-right position
- Auto-dismiss (5s)
- Close button
- Icon based on type (success/error/info)
- Stacked when multiple

## Best Practices

1. **Consistency**: Use design tokens (colors, spacing) from Tailwind config
2. **Accessibility**: Always include alt text, ARIA labels, keyboard support
3. **Performance**: Lazy load heavy components, optimize images
4. **Mobile-First**: Design for mobile, enhance for desktop
5. **Dark Mode**: Test all components in both themes
6. **Error Handling**: Clear, actionable error messages
7. **Loading States**: Show spinners/skeletons during async operations
8. **Empty States**: Friendly messages with CTAs when no data
