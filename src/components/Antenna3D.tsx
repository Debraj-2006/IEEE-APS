import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Main satellite mesh + animation ─── */
function SatelliteModel({ isMobile }: { isMobile?: boolean }) {
  const { scene: originalScene } = useGLTF('/satellite.glb');
  const groupRef = useRef<THREE.Group>(null);
  const introRef = useRef(0);

  // Clone the scene so we always get FRESH, unmutated panel positions.
  // useMemo runs synchronously during render — before any useFrame callback
  // can fire — eliminating the race condition that caused the one-wing bug.
  // The original cached scene is never mutated.
  const { clonedScene, panel1, panel2, natP1X, natP2X } = useMemo(() => {
    const clone = originalScene.clone(true);
    const p1 = clone.getObjectByName('panel1') as THREE.Object3D | undefined;
    const p2 = clone.getObjectByName('panel2') as THREE.Object3D | undefined;

    // Read natural positions from the fresh clone
    const nx1 = p1 ? p1.position.x : 0;
    const nx2 = p2 ? p2.position.x : 0;

    // Start panels closed (at center) for the wing-open animation
    if (p1) p1.position.x = 0;
    if (p2) p2.position.x = 0;

    // Apply realistic materials
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name.toLowerCase();
        const parentName = mesh.parent?.name.toLowerCase() || '';

        // Extract existing color if possible to preserve it
        let origColor = new THREE.Color('#cccccc');
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
             if (mesh.material[0] && (mesh.material[0] as any).color) {
               origColor = (mesh.material[0] as any).color;
             }
          } else if ((mesh.material as any).color) {
             origColor = (mesh.material as any).color;
          }
        }

        // Apply realistic materials
        if (name.includes('panel') || parentName.includes('panel') || name.includes('wing') || name.includes('solar')) {
           // Solar panels: dark blue/black, glossy, slightly metallic
           mesh.material = new THREE.MeshStandardMaterial({
             color: '#040d1a',
             metalness: 0.6,
             roughness: 0.15,
             envMapIntensity: 2.5,
           });
        } else {
           // Body: highly reflective metal, preserving original hue but making it physically metallic
           mesh.material = new THREE.MeshStandardMaterial({
             color: origColor,
             metalness: 0.9,
             roughness: 0.25,
             envMapIntensity: 1.5,
           });
        }
      }
    });

    return {
      clonedScene: clone,
      panel1: p1 ?? null,
      panel2: p2 ?? null,
      natP1X: nx1,
      natP2X: nx2,
    };
  }, [originalScene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Wing-open animation (quartic ease-out, ~3.3s)
    if (introRef.current < 1) {
      introRef.current = Math.min(1, introRef.current + 0.005);
      const e = 1 - Math.pow(1 - introRef.current, 4);
      if (panel1) panel1.position.x = THREE.MathUtils.lerp(0, natP1X, e);
      if (panel2) panel2.position.x = THREE.MathUtils.lerp(0, natP2X, e);
    }

    // Gentle float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.55) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={isMobile ? 0.28 : 0.32} rotation={isMobile ? [0, 1.8, 0] : [0.05, 1.8, 0]} />
    </group>
  );
}

/* ─── Root component ─── */
export const Antenna3D: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-[350px] lg:h-[400px] relative pointer-events-none overflow-visible">
      {/* Canvas is oversized to prevent any clipping of the satellite wings */}
      <Canvas
        style={{
          position: 'absolute',
          top: isMobile ? '-10%' : '-30%',
          left: isMobile ? '-10%' : '-40%',
          width: isMobile ? '120%' : '180%',
          height: isMobile ? '120%' : '160%',
          background: 'transparent',
          pointerEvents: 'auto',
        }}
        camera={{ position: [0, 0.2, 7], fov: 30 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        dpr={[1, 2]}
      >
        <directionalLight position={[5, 7, 3]}   intensity={2.8}  color="#fff8f0" castShadow />
        <directionalLight position={[-4, -2, -5]} intensity={0.45} color="#3a80bb" />
        <pointLight       position={[0, -3, 2]}   intensity={0.9}  color="#00d4ff" distance={9} />
        <ambientLight intensity={0.14} color="#080e1a" />

        <Suspense fallback={null}>
          {/* Group offset shifts the model to the right visually on desktop, centered on mobile */}
          <group position={isMobile ? [0, -0.4, 0] : [1.0, 0, 0]}>
            <SatelliteModel isMobile={isMobile} />
          </group>
          <Environment preset="city" background={false} environmentIntensity={1.0} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.8}
          dampingFactor={0.05}
          enableDamping
          target={isMobile ? [0, -0.4, 0] : [1.0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/satellite.glb');
