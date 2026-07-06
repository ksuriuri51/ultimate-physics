import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuantumComputing from './pages/QuantumComputing';
import BlackHoles from './pages/BlackHoles';
import ClassicalMechanics from './pages/ClassicalMechanics';
import VisualMath from './pages/VisualMath';
import AIPhysics from './pages/AIPhysics';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quantum" element={<QuantumComputing />} />
          <Route path="/black-holes" element={<BlackHoles />} />
          <Route path="/classical-mechanics" element={<ClassicalMechanics />} />
          <Route path="/visual-math" element={<VisualMath />} />
          <Route path="/ai-physics" element={<AIPhysics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
