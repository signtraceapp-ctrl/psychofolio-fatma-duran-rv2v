"use client";

import { useRef, useMemo, Suspense, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

type ProgressRef = RefObject<number>;

const MODEL_URL = "/models/sculpture-web.glb";

/* -- Gold dust particles -------------------------------------------------- */
const DUST_COUNT = 800;

const DUST_POSITIONS = new Float32Array(DUST_COUNT * 3);
const DUST_SIZES = new Float32Array(DUST_COUNT);
for (let _i = 0; _i < DUST_COUNT; _i++) {
  const radius = 1.2 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;
  DUST_POSITIONS[_i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
  DUST_POSITIONS[_i * 3 + 1] = Math.cos(phi) * radius * 0.8 - 0.5;
  DUST_POSITIONS[_i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
  DUST_SIZES[_i] = 0.3 + Math.random() * 2;
}

function GoldDust({ progressRef }: { progressRef: ProgressRef }) {
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    ref.current.rotation.y = t * 0.006 + p * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.008) * 0.02;

    const mat = ref.current.material as THREE.PointsMaterial;
    const arc = Math.sin(Math.min(p, 1) * Math.PI);
    mat.opacity = 0.08 + arc * 0.5;
    mat.size = 0.008 + arc * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[DUST_POSITIONS, 3]} />
        <bufferAttribute attach="attributes-size" args={[DUST_SIZES, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#d4af37"
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -- Phase keyframes -------------------------------------------------------- */
const PHASES = [
  { camAngle: -0.3, camRadius: 5.5, camHeight: 1.8, lookY: -0.2, lookX: 0, spotIntensity: 80, rimIntensity: 5, ambientIntensity: 0.10 },
  { camAngle: 0.8, camRadius: 4.2, camHeight: 0.8, lookY: -0.4, lookX: 0, spotIntensity: 110, rimIntensity: 8, ambientIntensity: 0.12 },
  { camAngle: 2.0, camRadius: 3.8, camHeight: 0.2, lookY: -0.5, lookX: 0, spotIntensity: 150, rimIntensity: 14, ambientIntensity: 0.08 },
  { camAngle: 3.4, camRadius: 3.2, camHeight: 0.6, lookY: -0.3, lookX: 0, spotIntensity: 190, rimIntensity: 16, ambientIntensity: 0.14 },
  { camAngle: 4.3, camRadius: 4.6, camHeight: 1.5, lookY: -0.1, lookX: -1.1, spotIntensity: 120, rimIntensity: 10, ambientIntensity: 0.10 },
  { camAngle: 5.3, camRadius: 3.4, camHeight: 2.4, lookY: 0.0, lookX: 0.9, spotIntensity: 160, rimIntensity: 12, ambientIntensity: 0.09 },
  { camAngle: 2 * Math.PI - 0.3, camRadius: 6.4, camHeight: 1.9, lookY: -0.2, lookX: 0, spotIntensity: 85, rimIntensity: 6, ambientIntensity: 0.08 },
];

function lerpPhase(progress: number, key: keyof (typeof PHASES)[0]): number {
  const totalPhases = PHASES.length - 1;
  const raw = THREE.MathUtils.clamp(progress, 0, 1) * totalPhases;
  const idx = Math.min(Math.floor(raw), totalPhases - 1);
  const t = raw - idx;
  return THREE.MathUtils.lerp(PHASES[idx][key], PHASES[idx + 1][key], t);
}

/* -- Sculpture model (GLB with real scan textures) ------------------------- */
/* NOTE: Place your sculpture-web.glb model at public/models/sculpture-web.glb.
   If the model is missing, the scene will show only the lighting/dust effects.  */
function Sculpture() {
  let scene: THREE.Group;
  try {
    const gltf = useGLTF(MODEL_URL);
    scene = gltf.scene;
  } catch {
    // Model not available - show only atmospheric lighting and dust
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.roughness = Math.min(mat.roughness ?? 1, 0.78);
          mat.metalness = Math.max(mat.metalness ?? 0, 0.03);
          if (mat.map) mat.map.needsUpdate = true;
          if (mat.normalMap) {
            mat.normalMap.needsUpdate = true;
            mat.normalScale.set(1.2, 1.2);
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 3 / maxDim;
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = offset.y + Math.sin(t * 0.25) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={[offset.x, offset.y, offset.z]}
    >
      <primitive object={scene} />
    </group>
  );
}

/* -- Spotlight that follows cursor subtly ---------------------------------- */
function MuseumSpot({ progressRef }: { progressRef: ProgressRef }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!lightRef.current) return;
    const { x, y } = state.pointer;
    const p = progressRef.current ?? 0;

    targetPos.current.set(x * 1.5, y * 1 + 0.5, 0);
    lightRef.current.target.position.lerp(targetPos.current, 0.03);
    lightRef.current.target.updateMatrixWorld();
    lightRef.current.intensity = lerpPhase(p, "spotIntensity");
  });

  return (
    <spotLight
      ref={lightRef}
      position={[3, 5, 4]}
      angle={0.3}
      penumbra={0.9}
      intensity={60}
      color="#f5e6c8"
      distance={15}
      decay={2}
    />
  );
}

/* -- Dynamic ambient & rim lights ------------------------------------------ */
function DynamicLights({ progressRef }: { progressRef: ProgressRef }) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    if (ambientRef.current) {
      ambientRef.current.intensity = lerpPhase(p, "ambientIntensity");
    }
    if (rimRef.current) {
      rimRef.current.intensity = lerpPhase(p, "rimIntensity");
      const angle = lerpPhase(p, "camAngle") + Math.PI;
      rimRef.current.position.x = Math.sin(angle) * 3;
      rimRef.current.position.z = Math.cos(angle) * 3;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.10} color="#d4af37" />
      <hemisphereLight intensity={0.22} color="#f5e6c8" groundColor="#1a1815" />
      <pointLight
        ref={rimRef}
        position={[-2, 2, -3]}
        intensity={3}
        color="#d4af37"
        distance={10}
        decay={2}
      />
    </>
  );
}

/* -- Camera controller ---------------------------------------------------- */
function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const { camera } = useThree();
  const smoothProgress = useRef(0);

  useFrame(() => {
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      progressRef.current ?? 0,
      0.05,
    );
    const p = smoothProgress.current;

    const angle = lerpPhase(p, "camAngle");
    const radius = lerpPhase(p, "camRadius");
    const height = lerpPhase(p, "camHeight");
    const lookY = lerpPhase(p, "lookY");
    const lookX = lerpPhase(p, "lookX");

    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = height;
    camera.lookAt(lookX, lookY, 0);
  });

  return null;
}

/* -- Main exported scene -------------------------------------------------- */
interface SculptureSceneProps {
  progressRef?: ProgressRef;
}

export function SculptureScene({ progressRef }: SculptureSceneProps) {
  const fallbackRef = useRef(0);
  const pRef = progressRef ?? fallbackRef;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [2, 1.8, 5.5], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={() => {
        if (!progressRef) {
          const handleScroll = () => {
            const total =
              document.documentElement.scrollHeight - window.innerHeight;
            if (total <= 0) return;
            fallbackRef.current = Math.min(window.scrollY / total, 1);
          };
          handleScroll();
          window.addEventListener("scroll", handleScroll, { passive: true });
        }
      }}
    >
      <fog attach="fog" args={["#0e0d0b", 8, 22]} />

      <directionalLight
        position={[-3, 4, 2]}
        intensity={0.25}
        color="#ffe8c0"
      />

      <MuseumSpot progressRef={pRef} />
      <DynamicLights progressRef={pRef} />

      <Suspense fallback={null}>
        <Sculpture />
      </Suspense>

      <GoldDust progressRef={pRef} />
      <CameraRig progressRef={pRef} />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
