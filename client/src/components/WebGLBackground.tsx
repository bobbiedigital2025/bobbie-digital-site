import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function MovingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      // Move grid forward to simulate movement
      gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 2;
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[60, 60, 0x4F46E5, 0x4F46E5]} 
      position={[0, -2, 0]} 
      rotation={[0, 0, 0]}
    />
  );
}

function FloatingBlock({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      // Bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={true}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function Scene() {
  // Generate random blocks
  const blocks = useMemo(() => {
    const items = [];
    const colors = ["#4F46E5", "#EC4899", "#111827"]; // Indigo, Pink, Black
    for (let i = 0; i < 15; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20 - 5
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.5 + Math.random() * 1.5
      });
    }
    return items;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <MovingGrid />
      
      {/* Second grid for depth/parallax effect */}
      <gridHelper args={[60, 10, 0xEC4899, 0xEC4899]} position={[0, 5, -10]} rotation={[Math.PI / 2, 0, 0]} />

      {blocks.map((block, i) => (
        <FloatingBlock 
          key={i} 
          position={block.position} 
          color={block.color} 
          speed={block.speed} 
        />
      ))}
    </>
  );
}

export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-gray-50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <Scene />
        <fog attach="fog" args={['#F3F4F6', 5, 30]} />
      </Canvas>
    </div>
  );
}
