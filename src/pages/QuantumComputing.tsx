import BlochSphere from "@/components/BlochSphere";

export default function QuantumComputing() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Quantum Computing</h1>
      <p className="text-muted-foreground mb-8">Interactive Bloch Sphere visualization and quantum gate operations</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Bloch Sphere</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The Bloch sphere represents a single qubit's state as a point on a unit sphere. Apply quantum gates to rotate the state and observe how superposition changes.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <BlochSphere width={400} height={400} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Quantum Gates</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Quantum gates are unitary transformations that manipulate qubit states. Each gate rotates the state vector on the Bloch sphere:
          </p>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="font-mono font-bold">Hadamard (H)</div>
              <div className="text-muted-foreground">Creates equal superposition: |0⟩ → (|0⟩ + |1⟩)/√2</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="font-mono font-bold">Pauli-X (NOT)</div>
              <div className="text-muted-foreground">Flips the qubit: |0⟩ ↔ |1⟩</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="font-mono font-bold">Pauli-Y, Pauli-Z</div>
              <div className="text-muted-foreground">Rotations around Y and Z axes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

