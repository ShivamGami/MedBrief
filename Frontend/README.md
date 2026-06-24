# MedBrief Frontend

A production-ready React + TypeScript application for managing health data, appointments, prescriptions, and AI-powered health insights.

## Technology Stack

- **React** 19.x with TypeScript
- **Vite** — Fast build tool and dev server
- **React Router** v7 — Client-side routing
- **TailwindCSS** 4.x — Utility-first styling
- **Lucide React** — Icon library
- **Motion** — Animation library

## Project Structure

```
src/
├── Pages/                    # Page components
│   ├── Intro.tsx            # Landing page
│   ├── Auth.tsx             # Login/signup
│   ├── Dashboard.tsx        # Health reports
│   ├── Profile.tsx          # User profile
│   ├── Chat.tsx             # AI chat
│   ├── Appointments.tsx     # Schedule appointments
│   ├── Doctors.tsx          # Doctor listings
│   └── Prescriptions.tsx    # Medication tracking
│
├── Components/               # Reusable components
│   ├── Navbar.tsx           # Top navigation
│   ├── Sidebar.tsx          # Side navigation
│   ├── ProtectedRoute.tsx   # Auth guard
│
├── Config/                  # Configuration
│   ├── Api.ts              # API client with token refresh
│   └── Types.tsx           # TypeScript interfaces
│
├── Context/                 # React Context
│   └── AuthContext.tsx      # Auth state management
│
├── Css/                     # Global styles
│   ├── pages/              # Page-specific styles
│   ├── auth.css
│   ├── layout.css
│   ├── components.css
│   ├── theme.css
│   ├── responsive.css
│   └── forms.css
│
├── App.tsx                  # Root component & routes
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## Development

### Setup

```bash
cd Frontend
npm install
```

### Environment

Create `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Optimized output in `dist/`

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## API Integration

### API Client (`Config/Api.ts`)

Universal HTTP client with automatic token refresh:

```typescript
export async function API<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    data?: unknown
): Promise<T>
```

**Features:**
- Automatic Bearer token injection
- JWT token refresh on 401
- FormData support for file uploads
- Error handling

### Usage Examples

```typescript
import { API } from "./Config/Api";

async function login(email: string, password: string) {
    const response = await API("POST", "/auth/login", {
        email,
        password
    });
    localStorage.setItem("access", response.access_token);
}

async function uploadReport(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return API("POST", "/reports/upload", formData);
}
```

### Authentication Flow

1. User logs in with email/password
2. Backend returns `access_token` and `refresh_token`
3. Tokens stored in localStorage
4. Access token sent with every request
5. On 401, refresh token is used to get new access token
6. If refresh fails, user is logged out

## Type Definitions

Core TypeScript interfaces in `Config/Types.tsx`:

- `User` — Logged-in user profile
- `Auth` — Login/signup credentials
- `HealthData` — Lab results and vitals
- `Prescription` — Medication data
- `Doctor` — Doctor profile
- `Profile` — Patient profile
- `Appointment` — Meeting data
- `ChatMessage` — Conversation message

## Pages & Features

### Intro (`Pages/Intro.tsx`)
- Landing page with feature showcase
- Call-to-action for login

### Auth (`Pages/Auth.tsx`)
- Login and signup forms
- Role selection (Patient/Doctor)
- Session validation

### Dashboard (`Pages/Dashboard.tsx`)
- Upload health reports (PDF)
- View report list with AI analysis
- Filter and search reports

### Profile (`Pages/Profile.tsx`)
- View/edit patient demographics
- Doctor listings (for doctors)
- Patient management (for doctors)

### Chat (`Pages/Chat.tsx`)
- AI-powered health Q&A
- Conversation history
- Real-time responses

### Appointments (`Pages/Appointments.tsx`)
- Schedule appointments
- View upcoming meetings
- Cancel appointments

### Doctors (`Pages/Doctors.tsx`)
- Browse doctor listings
- Filter by specialty
- View profiles

### Prescriptions (`Pages/Prescriptions.tsx`)
- Active prescriptions
- Medication history
- Dosage information

## Styling

### Global Styles

`index.css` defines CSS variables:
```css
--color-primary: #7c3aed;  /* Purple */
--color-secondary: #0ea5e9;  /* Blue */
--color-success: #10b981;    /* Green */
--color-warning: #f59e0b;    /* Amber */
--color-danger: #ef4444;     /* Red */
```

### Page-Specific CSS

Located in `Css/pages/` for modular styling

### Responsive Design

Mobile-first approach with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## State Management

### Auth Context

`Context/AuthContext.tsx` manages:
- Current user object
- User role (patient/doctor)
- Login/logout state

```typescript
const { user, setUser, role, setrole } = useContext(AuthContext);
```

## Production Deployment

### Environment

```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

### Build

```bash
npm run build
```

### Deployment Options

**Static Hosting (Vercel, Netlify):**
- Upload `dist/` folder
- Set environment variables
- Enable client-side routing

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Nginx:**
```nginx
server {
    listen 80;
    root /var/www/medbrief/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
    }
}
```

## Performance Optimization

- Tree-shaking removes unused code
- Code splitting for lazy-loaded routes
- Image optimization
- CSS minification
- JavaScript minification

### Metrics

- Lighthouse score target: 90+
- First Contentful Paint: <2s
- Time to Interactive: <3s

## Common Issues

### CORS Errors
- Verify `VITE_BACKEND_URL` is correct
- Check backend `ALLOWED_HOSTS`

### Token Expiration
- Implement refresh token logic
- Clear localStorage on logout

### Type Errors
- Update `Config/Types.tsx` with backend changes
- Regenerate types after API changes

## Security

- Tokens stored in localStorage (consider sessionStorage for sensitive apps)
- Passwords transmitted over HTTPS only
- No sensitive data in URL params
- CSRF protection via SameSite cookies
- XSS protection via React's auto-escaping

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest version
- Mobile: iOS Safari 12+, Chrome Mobile

## Contributing

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Prefer functional components
- Use React hooks

### Commit Convention

```
feat: add user profile page
fix: resolve token refresh bug
docs: update API docs
style: format code
test: add login tests
```

## Troubleshooting

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
npm run lint
npm run build -- --debug
```

## Related Documentation

- [Backend README](../Backend/readme.md)
- [Main Project README](../readme.md)
