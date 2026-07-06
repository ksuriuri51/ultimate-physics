import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DoublePendulumCanvas from "@/components/DoublePendulumCanvas";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Double Pendulum */}
      <section className="py-16 bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Physics & Quantum Science Showcase
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Interactive simulations demonstrating the beauty and rigor of physics, mathematics, and quantum computing. Each visualization uses numerically accurate methods to ensure scientific validity.
              </p>
              <div className="flex gap-4">
                <Link to="/quantum">
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    Explore Simulations
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <DoublePendulumCanvas width={400} height={400} />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NavCard
              title="Quantum Computing"
              description="Bloch Sphere visualization and quantum circuit builder with live state vector computation"
              to="/quantum"
            />
            <NavCard
              title="Black Holes & Cosmology"
              description="Spacetime curvature and gravitational lensing based on general relativity equations"
              to="/black-holes"
            />
            <NavCard
              title="Classical Mechanics"
              description="Double pendulum, simple pendulum, and historical pendulum experiments"
              to="/classical-mechanics"
            />
            <NavCard
              title="Visual Math"
              description="Fourier epicycles and Mandelbrot fractal with interactive exploration"
              to="/visual-math"
            />
            <NavCard
              title="AI × Physics"
              description="Watch AI discover Kepler's Law through regression on orbital data"
              to="/ai-physics"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function NavCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link to={href}>
      <a className="block p-6 border border-border rounded-lg bg-card hover:border-accent hover:shadow-lg transition-all duration-300 group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </a>
    </Link>
  );
}
