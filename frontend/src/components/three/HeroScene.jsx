import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";

const NODES = [
    { label: "Website", color: "#00F0FF" },
    { label: "Google", color: "#0066FF" },
    { label: "WhatsApp", color: "#25D366" },
    { label: "Mobile App", color: "#8B5CF6" },
    { label: "Online Store", color: "#00F0FF" },
    { label: "Ads", color: "#0066FF" },
    { label: "SEO", color: "#8B5CF6" },
    { label: "Analytics", color: "#00F0FF" },
    { label: "Leads", color: "#25D366" },
    { label: "Customers", color: "#0066FF" },
    { label: "Sales", color: "#8B5CF6" },
];

function nodePosition(i, total, radius = 3.6) {
    const angle = (i / total) * Math.PI * 2;
    const y = Math.sin(angle * 2) * 1.1;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
}

function Storefront() {
    return (
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
            <group>
                <mesh position={[0, -0.5, 0]}>
                    <boxGeometry args={[1.9, 1.3, 1.5]} />
                    <meshStandardMaterial color="#161926" metalness={0.4} roughness={0.35} />
                </mesh>
                <mesh position={[0, 0.28, 0]}>
                    <boxGeometry args={[2.1, 0.28, 1.7]} />
                    <meshStandardMaterial color="#0d3b46" emissive="#00F0FF" emissiveIntensity={0.55} metalness={0.3} roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.75, 0.78]}>
                    <boxGeometry args={[0.5, 0.8, 0.06]} />
                    <meshStandardMaterial color="#0a2430" emissive="#00F0FF" emissiveIntensity={0.9} />
                </mesh>
                <mesh position={[-0.62, -0.4, 0.78]}>
                    <boxGeometry args={[0.42, 0.42, 0.06]} />
                    <meshStandardMaterial color="#141030" emissive="#8B5CF6" emissiveIntensity={0.8} />
                </mesh>
                <mesh position={[0.62, -0.4, 0.78]}>
                    <boxGeometry args={[0.42, 0.42, 0.06]} />
                    <meshStandardMaterial color="#141030" emissive="#8B5CF6" emissiveIntensity={0.8} />
                </mesh>
                <pointLight position={[0, 0.6, 1.4]} intensity={2.4} color="#00F0FF" distance={6} />
            </group>
        </Float>
    );
}

function Node({ index, total, isMobile }) {
    const pos = useMemo(() => nodePosition(index, total), [index, total]);
    const { label, color } = NODES[index];
    return (
        <group position={pos}>
            <Float speed={2.2} rotationIntensity={0} floatIntensity={isMobile ? 0.35 : 0.7}>
                <mesh>
                    <sphereGeometry args={[0.13, 20, 20]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
                </mesh>
                {!isMobile && (
                    <Html center distanceFactor={11} style={{ pointerEvents: "none" }}>
                        <div
                            className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{
                                color,
                                background: "rgba(9,10,15,0.72)",
                                border: `1px solid ${color}55`,
                                backdropFilter: "blur(6px)",
                                transform: "translateY(-30px)",
                            }}
                        >
                            {label}
                        </div>
                    </Html>
                )}
            </Float>
        </group>
    );
}

function Connection({ index, total }) {
    const pulse = useRef();
    const pos = useMemo(() => nodePosition(index, total), [index, total]);
    const start = useMemo(() => new THREE.Vector3(0, -0.3, 0), []);
    const end = useMemo(() => new THREE.Vector3(...pos), [pos]);
    const points = useMemo(() => [start, end], [start, end]);
    const color = NODES[index].color;

    useFrame(({ clock }) => {
        if (!pulse.current) return;
        const t = (clock.elapsedTime * 0.22 + index * 0.13) % 1;
        pulse.current.position.lerpVectors(start, end, t);
        const s = 0.5 + Math.sin(t * Math.PI) * 0.7;
        pulse.current.scale.setScalar(s);
    });

    return (
        <group>
            <Line points={points} color={color} transparent opacity={0.35} lineWidth={1} dashed dashSize={0.12} gapSize={0.08} />
            <mesh ref={pulse}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </group>
    );
}

function Scene({ isMobile }) {
    const group = useRef();
    useFrame((_, delta) => {
        if (group.current) group.current.rotation.y += delta * (isMobile ? 0.05 : 0.09);
    });
    return (
        <group ref={group}>
            <Storefront />
            {NODES.map((_, i) => (
                <React.Fragment key={i}>
                    <Node index={i} total={NODES.length} isMobile={isMobile} />
                    <Connection index={i} total={NODES.length} />
                </React.Fragment>
            ))}
        </group>
    );
}

export function webglAvailable() {
    try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
        return false;
    }
}

export function Fallback2D() {
    return (
        <div className="relative w-full h-full flex items-center justify-center" data-testid="hero-2d-fallback" aria-hidden="true">
            <svg viewBox="0 0 600 460" className="w-full max-w-xl opacity-90">
                <defs>
                    <linearGradient id="ddg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00F0FF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
                {NODES.map((n, i) => {
                    const [x, y] = [300 + Math.cos((i / NODES.length) * Math.PI * 2) * 220, 230 + Math.sin((i / NODES.length) * Math.PI * 2) * 165];
                    return (
                        <g key={i}>
                            <line x1="300" y1="230" x2={x} y2={y} stroke={n.color} strokeOpacity="0.3" strokeWidth="1" className="flow-line" />
                            <circle cx={x} cy={y} r="7" fill={n.color} className="float-slow" style={{ animationDelay: `${i * 0.3}s` }} />
                            <text x={x} y={y - 14} textAnchor="middle" fill={n.color} fontSize="9" fontFamily="JetBrains Mono, monospace" style={{ textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                {n.label.toUpperCase()}
                            </text>
                        </g>
                    );
                })}
                <rect x="252" y="196" width="96" height="68" rx="8" fill="#161926" stroke="url(#ddg)" strokeWidth="1.5" />
                <rect x="288" y="230" width="24" height="34" rx="3" fill="#00F0FF" fillOpacity="0.85" />
                <rect x="258" y="206" width="26" height="18" rx="3" fill="#8B5CF6" fillOpacity="0.7" />
                <rect x="316" y="206" width="26" height="18" rx="3" fill="#8B5CF6" fillOpacity="0.7" />
                <rect x="246" y="188" width="108" height="10" rx="5" fill="#00F0FF" fillOpacity="0.9" />
            </svg>
        </div>
    );
}

export default function HeroScene() {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !webglAvailable()) return <Fallback2D />;

    return (
        <div className="w-full h-full" data-testid="hero-3d-canvas" aria-label="3D visual of a local business connected to digital growth channels" role="img">
            <Canvas dpr={isMobile ? 1 : [1, 1.75]} camera={{ position: [0, 1.4, 8.6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
                <ambientLight intensity={0.55} />
                <directionalLight position={[5, 6, 4]} intensity={0.7} />
                <Suspense fallback={null}>
                    <Scene isMobile={isMobile} />
                </Suspense>
            </Canvas>
        </div>
    );
}
