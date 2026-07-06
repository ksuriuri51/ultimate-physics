# Physics & Quantum Science Showcase

An interactive web application featuring scientifically rigorous physics and quantum computing simulations.

## Features

- **Home**: Live double pendulum simulation with energy tracking
- **Quantum Computing**: Interactive Bloch sphere with quantum gates (Hadamard, Pauli-X/Y/Z)
- **Black Holes & Cosmology**: Spacetime curvature visualization and gravitational lensing simulator
- **Classical Mechanics**: Double pendulum chaos simulation with trajectory visualization
- **Visual Math**: Fourier epicycles and interactive Mandelbrot fractal
- **AI × Physics**: Kepler's Law regression discovery demo

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Deployment**: Vercel

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Build

```bash
npm run build
```

The production build is output to the `dist/` directory.

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the repository into Vercel
3. Vercel will automatically detect the Vite configuration
4. The application will deploy to production

No additional configuration needed!

## Project Structure

```
physics-showcase/
├── src/
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── lib/              # Physics and math utilities
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── api/                  # Vercel serverless functions (optional)
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Dependencies
```

## License

MIT
