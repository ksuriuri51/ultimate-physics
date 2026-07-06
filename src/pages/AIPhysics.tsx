import KeplersLawRegression from "@/components/KeplersLawRegression";

export default function AIPhysics() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">AI × Physics</h1>
      <p className="text-muted-foreground mb-8">Machine learning discovers physical laws from data</p>

      <div className="max-w-4xl">
        <div>
          <h2 className="text-xl font-bold mb-4">Discovering Kepler's Third Law</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Kepler's Third Law states that the square of a planet's orbital period is proportional to the cube of its semi-major axis: T² ∝ a³. 
            Click "Discover Kepler's Law" to watch a regression algorithm analyze planetary data and derive this relationship from scratch.
          </p>
          <KeplersLawRegression width={700} height={500} />
        </div>

        <div className="mt-8 p-6 bg-secondary/20 rounded-lg">
          <h3 className="font-bold mb-3">How It Works</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The algorithm uses power-law regression (fitting y = a·x^b) to discover the relationship between orbital period and semi-major axis. 
            This demonstrates how machine learning can uncover fundamental physical laws from observational data—a key technique in modern physics discovery.
          </p>
        </div>
      </div>
    </div>
  );
}
