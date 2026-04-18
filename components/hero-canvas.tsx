"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";

function pseudoRandom(index: number, salt: number) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function Swarm() {
  const group = useRef<Group>(null);
  const points = useMemo(
    () =>
      new Array(80).fill(0).map((_, index) => ({
        position: new Vector3(
          (pseudoRandom(index, 1) - 0.5) * 7,
          (pseudoRandom(index, 2) - 0.5) * 4,
          (pseudoRandom(index, 3) - 0.5) * 3
        ),
        scale: 0.03 + pseudoRandom(index, 4) * 0.06,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.2;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <group ref={group}>
      {points.map((point, index) => (
        <mesh key={index} position={point.position} scale={point.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#21c7ff" emissive="#0ea5c9" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroCanvas() {
  return (
    <div className="relative h-[min(42dvh,20rem)] w-full min-h-[200px] touch-none rounded-2xl border border-border bg-gradient-to-b from-surface/80 to-black min-[480px]:h-[min(44dvh,22rem)] md:h-[320px] md:min-h-[320px]">
      <Canvas
        className="h-full w-full"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 55 }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[2, 2, 3]} intensity={10} color="#21c7ff" />
        <Swarm />
      </Canvas>
    </div>
  );
}
