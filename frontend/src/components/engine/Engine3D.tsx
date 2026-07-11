import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import type { FC } from 'react';

interface Engine3DProps {
  compressorHealth: number;
  combustorHealth: number;
  turbineHealth: number;
  overallHealth: number;
}

interface HealthState {
  compressor: number;
  combustor: number;
  turbine: number;
  overall: number;
}

function getHealthColor(value: number): THREE.Color {
  const v = Math.max(0, Math.min(1, value));
  let hue: number;
  if (v > 0.8) {
    hue = 0.33;
  } else if (v > 0.6) {
    hue = 0.1 + ((v - 0.6) / 0.2) * 0.23;
  } else if (v > 0.4) {
    hue = 0.05 + ((v - 0.4) / 0.2) * 0.05;
  } else {
    hue = (v / 0.4) * 0.05;
  }
  return new THREE.Color().setHSL(Math.max(0, Math.min(0.33, hue)), 1, 0.3 + v * 0.2);
}

function createBladeRing(
  radius: number,
  count: number,
  bladeWidth: number,
  bladeDepth: number,
  bladeHeight: number,
  color: number,
  xOffset: number,
): THREE.Group {
  const group = new THREE.Group();
  const bladeGeo = new THREE.BoxGeometry(bladeHeight, bladeWidth, bladeDepth);
  const bladeMat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.7,
    roughness: 0.3,
  });
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(xOffset, Math.cos(angle) * radius, Math.sin(angle) * radius);
    blade.rotation.x = angle;
    group.add(blade);
  }
  return group;
}

const Engine3DInner: FC<Engine3DProps> = ({
  compressorHealth,
  combustorHealth,
  turbineHealth,
  overallHealth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentHealthRef = useRef<HealthState>({
    compressor: 1,
    combustor: 1,
    turbine: 1,
    overall: 1,
  });
  const targetHealthRef = useRef<HealthState>({
    compressor: 1,
    combustor: 1,
    turbine: 1,
    overall: 1,
  });

  useEffect(() => {
    targetHealthRef.current = {
      compressor: compressorHealth,
      combustor: combustorHealth,
      turbine: turbineHealth,
      overall: overallHealth,
    };
  }, [compressorHealth, combustorHealth, turbineHealth, overallHealth]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 50);
    camera.position.set(5, 2.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ─── Lights ─── */
    const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    fillLight.position.set(-3, 0, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
    rimLight.position.set(-2, -1, 5);
    scene.add(rimLight);

    /* ─── Engine Model ─── */
    const engine = new THREE.Group();
    engine.rotation.x = 0.15;
    scene.add(engine);

    const sectionMeshes: Array<{
      mesh: THREE.Mesh;
      material: THREE.MeshStandardMaterial;
      getHealth: () => number;
      emissiveIntensityBase: number;
    }> = [];

    /* Body casing */
    const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 4.5, 24, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f1524,
      metalness: 0.85,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = -Math.PI / 2;
    engine.add(body);

    /* Body ends */
    const capGeo = new THREE.CircleGeometry(1.2, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0f1524,
      metalness: 0.85,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const frontCap = new THREE.Mesh(capGeo, capMat);
    frontCap.rotation.y = Math.PI / 2;
    frontCap.position.x = -2.25;
    engine.add(frontCap);

    const rearCap = new THREE.Mesh(capGeo.clone(), capMat);
    rearCap.rotation.y = -Math.PI / 2;
    rearCap.position.x = 2.25;
    engine.add(rearCap);

    /* Intake ring */
    const intakeRingGeo = new THREE.TorusGeometry(1.3, 0.06, 8, 32);
    const intakeRingMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2,
    });
    const intakeRing = new THREE.Mesh(intakeRingGeo, intakeRingMat);
    intakeRing.position.x = -2.15;
    engine.add(intakeRing);

    /* Intake cone */
    const coneGeo = new THREE.ConeGeometry(0.6, 1.2, 16);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x1a2540,
      metalness: 0.6,
      roughness: 0.4,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.rotation.z = -Math.PI / 2;
    cone.position.x = -2.6;
    engine.add(cone);

    /* Compressor section */
    const compColor = getHealthColor(compressorHealth);
    const compMat = new THREE.MeshStandardMaterial({
      color: compColor,
      emissive: compColor,
      emissiveIntensity: 0.1,
      metalness: 0.6,
      roughness: 0.4,
    });
    const compGeo = new THREE.CylinderGeometry(1.35, 1.25, 1.4, 24);
    const compMesh = new THREE.Mesh(compGeo, compMat);
    compMesh.rotation.z = -Math.PI / 2;
    compMesh.position.x = -1.3;
    engine.add(compMesh);
    sectionMeshes.push({
      mesh: compMesh,
      material: compMat,
      getHealth: () => currentHealthRef.current.compressor,
      emissiveIntensityBase: 0.1,
    });

    /* Compressor blade rings */
    engine.add(createBladeRing(1.2, 10, 0.05, 0.3, 0.4, 0x1a2a4a, -1.6));
    engine.add(createBladeRing(1.2, 10, 0.05, 0.3, 0.4, 0x1a2a4a, -1.0));

    /* Combustor section */
    const combColor = getHealthColor(combustorHealth);
    const combMat = new THREE.MeshStandardMaterial({
      color: combColor,
      emissive: combColor,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.6,
    });
    const combGeo = new THREE.CylinderGeometry(1.55, 1.55, 1.0, 24);
    const combMesh = new THREE.Mesh(combGeo, combMat);
    combMesh.rotation.z = -Math.PI / 2;
    combMesh.position.x = 0;
    engine.add(combMesh);
    sectionMeshes.push({
      mesh: combMesh,
      material: combMat,
      getHealth: () => currentHealthRef.current.combustor,
      emissiveIntensityBase: 0.2,
    });

    /* Combustor inner glow */
    const innerGlowGeo = new THREE.SphereGeometry(1.1, 16, 16);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff6a00,
      transparent: true,
      opacity: 0.08,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    innerGlow.position.x = 0;
    innerGlow.scale.set(1, 1, 0.6);
    engine.add(innerGlow);

    /* Turbine section */
    const turbColor = getHealthColor(turbineHealth);
    const turbMat = new THREE.MeshStandardMaterial({
      color: turbColor,
      emissive: turbColor,
      emissiveIntensity: 0.1,
      metalness: 0.6,
      roughness: 0.4,
    });
    const turbGeo = new THREE.CylinderGeometry(1.25, 1.35, 1.4, 24);
    const turbMesh = new THREE.Mesh(turbGeo, turbMat);
    turbMesh.rotation.z = -Math.PI / 2;
    turbMesh.position.x = 1.3;
    engine.add(turbMesh);
    sectionMeshes.push({
      mesh: turbMesh,
      material: turbMat,
      getHealth: () => currentHealthRef.current.turbine,
      emissiveIntensityBase: 0.1,
    });

    /* Turbine blade rings */
    engine.add(createBladeRing(1.2, 10, 0.04, 0.25, 0.4, 0x3a2a1a, 1.0));
    engine.add(createBladeRing(1.2, 10, 0.04, 0.25, 0.4, 0x3a2a1a, 1.6));

    /* Exhaust ring */
    const exhaustRingGeo = new THREE.TorusGeometry(1.3, 0.06, 8, 32);
    const exhaustRingMat = new THREE.MeshStandardMaterial({
      color: 0xff6a00,
      emissive: 0xff6a00,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2,
    });
    const exhaustRing = new THREE.Mesh(exhaustRingGeo, exhaustRingMat);
    exhaustRing.position.x = 2.15;
    engine.add(exhaustRing);

    /* Shaft */
    const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 5, 8);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x333344,
      metalness: 0.9,
      roughness: 0.2,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.z = -Math.PI / 2;
    engine.add(shaft);

    /* ─── Exhaust Particles ─── */
    const particleCount = 40;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleDrifts = new Float32Array(particleCount * 2);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 2 + Math.random() * 0.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      particleSpeeds[i] = 0.008 + Math.random() * 0.015;
      particleDrifts[i * 2] = (Math.random() - 0.5) * 0.004;
      particleDrifts[i * 2 + 1] = (Math.random() - 0.5) * 0.004;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff6a00,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    engine.add(particles);

    /* ─── Mouse Follow ─── */
    let mouseY = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragRotationY = dragStartY + dx * 0.005;
        dragRotationX = dragStartX + dy * 0.005;
      } else {
        mouseY = y;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    /* ─── Resize ─── */
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    /* ─── Animation ─── */
    let animationId: number;
    const time = { value: 0 };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time.value += 0.016;

      /* Auto-rotation */
      if (!isDragging) {
        engine.rotation.y += 0.003;
      }

      /* Mouse parallax */
      if (!isDragging) {
        targetRotationX += (mouseY * 0.2 - targetRotationX) * 0.03;
        engine.rotation.x = 0.15 + targetRotationX;
      } else {
        engine.rotation.y = dragRotationY;
        engine.rotation.x = 0.15 + dragRotationX;
      }

      /* Lerp health */
      const cur = currentHealthRef.current;
      const tgt = targetHealthRef.current;
      cur.compressor += (tgt.compressor - cur.compressor) * 0.02;
      cur.combustor += (tgt.combustor - cur.combustor) * 0.02;
      cur.turbine += (tgt.turbine - cur.turbine) * 0.02;
      cur.overall += (tgt.overall - cur.overall) * 0.02;

      /* Update section colors */
      for (const s of sectionMeshes) {
        const h = s.getHealth();
        const color = getHealthColor(h);
        s.material.color.copy(color);
        s.material.emissive.copy(color);
        s.material.emissiveIntensity = s.emissiveIntensityBase + (1 - h) * 0.4;
      }

      /* Combustor glow pulse */
      const pulse = 0.06 + 0.06 * Math.sin(time.value * 2);
      innerGlow.material.opacity = pulse * (0.5 + 0.5 * currentHealthRef.current.combustor);

      /* Exhaust particles */
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += particleSpeeds[i];
        pos[i * 3 + 1] += particleDrifts[i * 2];
        pos[i * 3 + 2] += particleDrifts[i * 2 + 1];
        if (pos[i * 3] > 3.8) {
          pos[i * 3] = 2.1 + Math.random() * 0.3;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.material.opacity = 0.2 + 0.4 * currentHealthRef.current.combustor;

      /* Intake/exhaust ring pulse */
      const ringPulse = 0.15 + 0.1 * Math.sin(time.value * 1.5);
      intakeRingMat.emissiveIntensity = ringPulse * (0.5 + 0.5 * currentHealthRef.current.overall);
      exhaustRingMat.emissiveIntensity = ringPulse * (0.5 + 0.5 * currentHealthRef.current.overall);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: 260, cursor: 'grab' }}
      aria-label="3D turbojet engine visualization"
    />
  );
};

export default memo(Engine3DInner);
