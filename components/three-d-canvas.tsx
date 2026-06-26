'use client';

import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// Import random from maath/random/dist/maath-random.esm (or generate points in raw JS to avoid maath dependency issues)

function generateSphericalPoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(Math.random());
    
    points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    points[i * 3 + 2] = r * Math.cos(phi);
  }
  return points;
}

function ParticleBackground() {
  const ref = React.useRef<any>(null);
  const [sphere] = React.useState(() => generateSphericalPoints(1200, 2.5));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingShapes() {
  const meshRef1 = React.useRef<any>(null);
  const meshRef2 = React.useRef<any>(null);
  const meshRef3 = React.useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.2;
      meshRef1.current.rotation.y = time * 0.3;
      meshRef1.current.position.y = Math.sin(time) * 0.15 + 0.5;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = -time * 0.3;
      meshRef2.current.rotation.y = time * 0.1;
      meshRef2.current.position.y = Math.cos(time * 0.8) * 0.1 - 0.5;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.z = time * 0.2;
      meshRef3.current.position.x = Math.sin(time * 0.5) * 0.2 - 1.2;
      meshRef3.current.position.y = Math.cos(time * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* 3D Wireframe Cube representing a data cluster */}
      <mesh ref={meshRef1} position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
      </mesh>
      
      {/* Floating sphere node */}
      <mesh ref={meshRef2} position={[-0.8, -0.6, 0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Wireframe Torus representing data ring */}
      <mesh ref={meshRef3} position={[-1.2, 0, -0.5]}>
        <torusGeometry args={[0.4, 0.12, 8, 24]} />
        <meshBasicMaterial color="#ec4899" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function ThreeDCanvas() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-screen bg-transparent overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.8} />
        <ParticleBackground />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
