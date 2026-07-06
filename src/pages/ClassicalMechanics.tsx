import DoublePendulumCanvas from "@/components/DoublePendulumCanvas";

export default function ClassicalMechanics() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Classical Mechanics</h1>
      <p className="text-muted-foreground mb-8">Pendulum simulations solved with 4th-order Runge-Kutta integration for numerical accuracy</p>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Double Pendulum: Chaos in Motion</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The double pendulum is a chaotic system. Small differences in initial conditions lead to dramatically different trajectories. This simulation uses RK4 integration to accurately capture the chaotic behavior. The trajectory (tan line) shows the path of the second bob.
          </p>
          <div className="flex justify-center">
            <DoublePendulumCanvas width={500} height={500} showTrajectory={true} />
          </div>
        </div>

        <div className="p-6 bg-secondary/20 rounded-lg">
          <h3 className="font-bold mb-3">Historical Pendulum Experiments</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Classical mechanics has been validated through centuries of pendulum experiments:
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li><span className="font-bold">Kater's Pendulum:</span> Used to measure gravitational acceleration with high precision</li>
            <li><span className="font-bold">Ballistic Pendulum:</span> Demonstrates conservation of momentum in collisions</li>
            <li><span className="font-bold">Foucault Pendulum:</span> Proves Earth's rotation through precession of the swing plane</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

