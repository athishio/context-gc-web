"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import {
  Terminal,
  Copy,
  Check,
  Github,
  BookOpen,
  Cpu,
  Layers,
  Settings,
  Zap,
  GitBranch,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Play,
  Database,
  HelpCircle,
  Info,
  Lock,
  Menu,
  X,
  FileCode,
  GitCommit,
  GitMerge,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Dynamic canvas drifting background particles that attract to the mouse cursor (Google themed colors with soft low opacities)
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Track mouse coordinates
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const colors = [
      "rgba(66, 133, 244, 0.08)",  // Google Blue
      "rgba(52, 168, 83, 0.08)",   // Google Green
      "rgba(251, 188, 5, 0.08)",   // Google Yellow
      "rgba(234, 67, 53, 0.08)"    // Google Red
    ];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      baseVx: number;
      baseVy: number;
    }> = [];

    // Create 45 drifting particles
    for (let i = 0; i < 45; i++) {
      const vx = (Math.random() - 0.5) * 0.25;
      const vy = (Math.random() - 0.5) * 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: vx,
        vy: vy,
        baseVx: vx,
        baseVy: vy,
        radius: 4 + Math.random() * 8,
        color: colors[i % colors.length]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Apply physics attraction to mouse cursor position
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 350) {
            // Stronger pull when closer, but capped linearly
            const force = (350 - dist) / 350;
            // Add tiny acceleration vector towards the mouse coordinates
            p.vx += (dx / dist) * force * 0.035;
            p.vy += (dy / dist) * force * 0.035;
          } else {
            // Gentle decay back towards base random drift velocity
            p.vx += (p.baseVx - p.vx) * 0.02;
            p.vy += (p.baseVy - p.vy) * 0.02;
          }
        } else {
          // Decay back to base drift if mouse leaves page
          p.vx += (p.baseVx - p.vx) * 0.02;
          p.vy += (p.baseVy - p.vy) * 0.02;
        }

        // Apply friction/damping to prevent compounding speeds
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Apply velocity vector
        p.x += p.vx;
        p.y += p.vy;

        // Bounded wrapper checks
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches) {
      animate();
    } else {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full bg-white"
    />
  );
}

// Scroll intersection reveal wrapper component using Framer Motion
function ScrollReveal({ children, delay = 0, duration = 0.65 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
  }, []);

  if (prefersReduced || !mounted) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // expo-out
      }}
    >
      {children}
    </motion.div>
  );
}

// Client-safe Scroll Parallax Hook with reduced motion bypass
function useScrollParallax(speed: number) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
}

// Quiet flat card with hover translation, pseudo gradient border glow and shadow deepening
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
  }, []);

  if (prefersReduced || !mounted) {
    return (
      <div className={`bg-white border border-border-subtle rounded-lg p-6 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)"
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`relative bg-white border border-border-subtle rounded-lg p-6 overflow-hidden ${className}`}
    >
      {/* Pseudo hover border glow */}
      <div className="absolute inset-0 border border-brand-blue/15 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

// Dotted Constellation card with blue outline dots and spring lift
function DottedConstellationCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
  }, []);

  if (prefersReduced || !mounted) {
    return (
      <div className={`relative p-8 bg-white rounded-xl border border-dashed border-brand-blue/30 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 12px 30px rgba(66, 133, 244, 0.04)"
      }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`relative p-8 bg-white rounded-xl ${className}`}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
        <rect 
          x="2" 
          y="2" 
          width="calc(100% - 4px)" 
          height="calc(100% - 4px)" 
          rx="10" 
          stroke="#4285F4" 
          strokeWidth="2" 
          strokeDasharray="2, 8" 
          strokeLinecap="round" 
          className="opacity-45 animate-shimmer-dot" 
        />
      </svg>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

// Magnetic interactive button component
function MagneticButton({ children, className = "", onClick, ...props }: { children: React.ReactNode; className?: string; onClick?: () => void; [key: string]: any }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.6 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    const distanceX = e.clientX - btnX;
    const distanceY = e.clientY - btnY;
    const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (dist < 70) {
      x.set(distanceX * 0.18);
      y.set(distanceY * 0.18);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: mounted ? springX : 0,
        y: mounted ? springY : 0,
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Custom cursor dot component
function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);
    setMounted(true);

    if (!mediaQuery.matches) return;

    document.body.classList.add("custom-cursor-active");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!mounted || !isFinePointer) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed top-0 left-0 w-2 h-2 bg-brand-blue rounded-full pointer-events-none z-[9999]"
    />
  );
}

// Click-triggered compiler graph problem section component
function ProblemSection() {
  const [isCompiled, setIsCompiled] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
  }, []);

  const problemNodes = [
    { 
      id: "e001", 
      type: "decision", 
      label: "Start config", 
      rot: -8, 
      traceLeft: "12%", 
      traceTop: "35%",
      graphLeft: "12%", 
      graphTop: "27%" 
    },
    { 
      id: "e002", 
      type: "set_var", 
      label: 'key="x", value=10', 
      rot: 14, 
      traceLeft: "25%", 
      traceTop: "70%",
      graphLeft: "25%", 
      graphTop: "70%",
      isPruned: true 
    },
    { 
      id: "e003", 
      type: "set_var", 
      label: 'key="x", value=20', 
      rot: -4, 
      traceLeft: "39%", 
      traceTop: "28%",
      graphLeft: "42%", 
      graphTop: "27%",
      isAccent: true 
    },
    { 
      id: "e004", 
      type: "tool_call", 
      label: "run_calculator", 
      rot: 10, 
      traceLeft: "53%", 
      traceTop: "66%",
      graphLeft: "67%", 
      graphTop: "27%" 
    },
    { 
      id: "e005", 
      type: "tool_result", 
      label: "ans = 42", 
      rot: -6, 
      traceLeft: "67%", 
      traceTop: "30%",
      graphLeft: "53%", 
      graphTop: "70%",
      isPruned: true 
    },
    { 
      id: "e006", 
      type: "abandon", 
      label: 'ref_to=["e007"]', 
      rot: 5, 
      traceLeft: "81%", 
      traceTop: "74%",
      graphLeft: "92%", 
      graphTop: "27%" 
    },
    { 
      id: "e007", 
      type: "set_var", 
      label: 'key="y", value=99', 
      rot: -12, 
      traceLeft: "94%", 
      traceTop: "38%",
      graphLeft: "79%", 
      graphTop: "70%",
      isPruned: true 
    }
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden border-t border-border-subtle ambient-dots">
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">The Scaling Problem</span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight mt-2 mb-4">
            Agent Traces Grow Forever
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed font-sans">
            As LLM agents loop to solve complex tasks, tool outputs, aborted logs, and temporary state mutations accumulate. Prompts hit context limits, prompts trigger high latency, and LLM confusion increases.
          </p>
        </div>
      </ScrollReveal>

      {/* Interactive Compiler Sandbox */}
      <ScrollReveal>
        <div className="bg-white border border-border-subtle p-6 sm:p-10 relative overflow-hidden rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-text-muted uppercase">Interactive Compaction Sandbox</span>
              <h4 className="text-lg font-bold text-[#0A0A0A] mt-1">
                {isCompiled ? "Deterministic Compaction Graph" : "Raw Appended Trace (Chaotic Log)"}
              </h4>
            </div>
            
            <button
              onClick={() => setIsCompiled(!isCompiled)}
              className="text-xs font-mono font-bold text-text-primary bg-[#F1F3F4] hover:bg-slate-200/80 border border-border-subtle px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 uppercase select-none"
            >
              {isCompiled ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Trace
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-brand-blue animate-pulse" />
                  Compile Graph
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <div className="relative min-w-[760px] h-[340px] p-4">
              
              {/* SVG Connecting Lines with transitions */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none">
                {/* 1. Uncompiled Chaotic Trace Lines */}
                <line 
                  x1="12%" y1="35%" x2="25%" y2="70%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />
                <line 
                  x1="25%" y1="70%" x2="39%" y2="28%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />
                <line 
                  x1="39%" y1="28%" x2="53%" y2="66%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />
                <line 
                  x1="53%" y1="66%" x2="67%" y2="30%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />
                <line 
                  x1="67%" y1="30%" x2="81%" y2="74%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />
                <line 
                  x1="81%" y1="74%" x2="94%" y2="38%" 
                  stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0 : 1 }}
                />

                {/* 2. Compiled Graph Active Main Branch Lines */}
                <line 
                  x1="12%" y1="27%" x2="42%" y2="27%" 
                  stroke="#4285F4" strokeWidth="2.5"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 1 : 0 }}
                />
                <line 
                  x1="42%" y1="27%" x2="67%" y2="27%" 
                  stroke="#4285F4" strokeWidth="2.5"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 1 : 0 }}
                />
                <line 
                  x1="67%" y1="27%" x2="92%" y2="27%" 
                  stroke="#4285F4" strokeWidth="2.5"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 1 : 0 }}
                />

                {/* 3. Compiled Graph Pruned Branches (Dashed swept paths) */}
                <line 
                  x1="12%" y1="27%" x2="25%" y2="70%" 
                  stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0.7 : 0 }}
                />
                <line 
                  x1="42%" y1="27%" x2="53%" y2="70%" 
                  stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0.7 : 0 }}
                />
                <line 
                  x1="92%" y1="27%" x2="79%" y2="70%" 
                  stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3"
                  className="transition-all duration-700 ease-in-out"
                  style={{ opacity: isCompiled ? 0.7 : 0 }}
                />
              </svg>

              {/* Graphic Card Nodes */}
              {problemNodes.map((n) => {
                const currentRot = prefersReduced ? 0 : isCompiled ? 0 : n.rot;
                const leftPos = isCompiled ? n.graphLeft : n.traceLeft;
                const topPos = isCompiled ? n.graphTop : n.traceTop;
                
                let cardClass = "bg-white border-border-subtle text-[#0A0A0A] shadow-sm";
                if (isCompiled) {
                  if (n.isPruned) {
                    cardClass = "bg-[#F8F9FA] border-slate-200 text-[#80868B] line-through";
                  } else if (n.isAccent) {
                    cardClass = "bg-[#E8F0FE] border-brand-blue/40 text-brand-blue font-bold";
                  } else {
                    cardClass = "bg-white border-border-subtle text-text-primary shadow-sm";
                  }
                }

                return (
                  <div 
                    key={n.id}
                    style={{
                      position: "absolute",
                      left: leftPos,
                      top: topPos,
                      transform: `translate3d(-50%, -50%, 0) rotate(${currentRot}deg)`,
                      transition: prefersReduced ? "none" : "left 0.75s cubic-bezier(0.16, 1, 0.3, 1), top 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease, border-color 0.5s ease, opacity 0.5s ease"
                    }}
                    className={`p-4 rounded border font-mono text-[10px] sm:text-xs w-[140px] sm:w-[160px] z-10 select-none ${cardClass}`}
                  >
                    <span className="block text-[9px] text-text-muted mb-1 font-mono">{n.id} [{n.type}]</span>
                    <span>{n.label}</span>
                    {isCompiled && n.isPruned && (
                      <span className="block text-[8px] text-text-muted mt-1 uppercase tracking-wider font-mono">[RECEIPT]</span>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          <div className="mt-8 text-center text-xs text-text-muted font-mono h-4">
            {isCompiled 
              ? "Pruning Engine marks obsolete state overrides and abandoned pathways for clean receipts."
              : "Raw linear event lists are unsorted, causing redundant prompt processing overhead."
            }
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// Documentation categories and pages mapped from the README (updated to light theme)
const DOCS_DATA = [
  {
    id: "description",
    title: "Description",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Core Concept</h3>
        <p className="text-[#5F6368] leading-relaxed mb-4 font-sans">
          Context-GC is a framework-agnostic, installable library combining deterministic graph-based pruning with recoverable receipts. While existing tools (such as Self-GC, ClawVM, Cognee, ContextNest, Headroom, and MemGPT/Letta) split these approaches across research papers, hosted SaaS products, client-side compressors, or LLM-based summarization routines, Context-GC ships as a simple, drop-in, zero-dependency Python library designed for developers building stateful agent workflows.
        </p>
        <p className="text-[#5F6368] leading-relaxed mb-4 font-sans">
          By modeling the agent's interaction history (execution traces) as a directed multigraph, Context-GC identifies and removes obsolete or superseded steps, dead execution branches, and cycles. When elements are pruned, Context-GC leaves behind lightweight, deterministic <em>receipt stubs</em> inline, allowing agents to preserve awareness of their history. Furthermore, the complete original content of any pruned step remains fully recoverable on-demand.
        </p>
      </div>
    )
  },
  {
    id: "architecture",
    title: "Architecture",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Pipeline Architecture</h3>
        <p className="text-[#5F6368] leading-relaxed mb-4 font-sans">
          Context-GC processes execution traces through a linear compilation pipeline, transforming a raw timeline of structured events into a clean, compacted prompt prefix.
        </p>
        <div className="bg-[#F1F3F4] p-4 rounded-lg border border-border-subtle font-mono text-xs text-brand-blue mb-4 overflow-x-auto whitespace-nowrap">
          Trace &rarr; Graph &rarr; Override Engine + Dead-Branch Sweeper &rarr; Topo Sampler &rarr; Compacted Prompt + Receipt Store
        </div>
        <h4 className="text-md font-bold text-[#0A0A0A] mb-2">Key Core Entries:</h4>
        <ul className="list-disc pl-5 text-[#5F6368] space-y-2 font-sans">
          <li><strong>ContextGC Wrapper</strong>: Recommended for agent loops. Allows incremental event appends (<code className="text-brand-blue font-mono">add_event()</code>) and on-demand compaction (<code className="text-brand-blue font-mono">compact()</code>).</li>
          <li><strong>compact_events()</strong>: Low-level single-shot function for static log lists.</li>
          <li><strong>Receipt Recovery Model</strong>: Non-destructive memory design storing stubs like <code className="text-brand-blue font-mono">[RECEIPT node_id]</code>.</li>
        </ul>
      </div>
    )
  },
  {
    id: "installation",
    title: "Installation",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Get Started</h3>
        <p className="text-[#5F6368] mb-4 font-sans">You can set up Context-GC either locally for development or from PyPI:</p>
        
        <h4 className="text-[#0A0A0A] font-bold mb-2">From Source (Local Dev)</h4>
        <pre className="bg-[#F8F9FA] p-3 rounded-lg border border-border-subtle text-sm text-brand-blue font-mono mb-4">
          git clone https://github.com/athishio/context-gc.git{"\n"}
          cd context-gc{"\n"}
          pip install -e .
        </pre>

        <h4 className="text-[#0A0A0A] font-bold mb-2">From PyPI</h4>
        <pre className="bg-[#F8F9FA] p-3 rounded-lg border border-border-subtle text-sm text-brand-blue font-mono">
          pip install context-gc
        </pre>
      </div>
    )
  },
  {
    id: "incremental-api",
    title: "Quick Start (Incremental API)",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Incremental Client</h3>
        <p className="text-[#5F6368] mb-4 font-sans">The main wrapper for live agent execution loops:</p>
        <pre className="bg-[#F8F9FA] p-4 rounded-lg border border-border-subtle text-xs text-[#0A0A0A] font-mono mb-4 overflow-x-auto">
{`from context_gc import ContextGC

client = ContextGC()

# Add event step-by-step
client.add_event({
    "id": "e001",
    "type": "decision",
    "timestamp": 1000,
    "parent_id": None,
    "content": "Start config"
})

# Compact history
result = client.compact()
print(result["prompt"])`}
        </pre>
      </div>
    )
  },
  {
    id: "single-shot-api",
    title: "Low-Level API (Single-Shot)",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Batch Compaction</h3>
        <p className="text-[#5F6368] mb-4 font-sans">If you already have a full, pre-collected list of events upfront, you can use the lower-level single-shot function:</p>
        <pre className="bg-[#F8F9FA] p-4 rounded-lg border border-border-subtle text-xs text-[#0A0A0A] font-mono overflow-x-auto">
{`from context_gc import compact_events

events = [
    {"id": "e001", "type": "decision", "timestamp": 1000, "parent_id": None, "content": "Hello"},
    # ... other events ...
]
result = compact_events(events)`}
        </pre>
      </div>
    )
  },
  {
    id: "middleware",
    title: "LLM Middleware Adapters",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Provider Integrations</h3>
        <p className="text-[#5F6368] mb-4 font-sans">
          Context-GC provides concrete integration helper functions for popular LLM provider libraries. These helper functions are optional (lazy-loaded inside), keeping the core package completely dependency-free.
        </p>
        <pre className="bg-[#F8F9FA] p-4 rounded-lg border border-border-subtle text-xs text-[#0A0A0A] font-mono mb-4 overflow-x-auto">
{`from context_gc import ContextGC
from context_gc.middleware import call_openai_with_compaction

client = ContextGC()
# Add your events...

res = call_openai_with_compaction(
    context_gc=client,
    model="gpt-4o-mini",
    user_message="Explain what value x holds."
)`}
        </pre>
      </div>
    )
  },
  {
    id: "stages",
    title: "Pruning Stages",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Pruning Logic</h3>
        <ul className="space-y-4 text-[#5F6368] text-sm font-sans">
          <li>
            <strong className="text-[#0A0A0A] block">1. Dead-Branch Sweeper (DFS)</strong>
            Traverses sequence edges from explicit <code className="text-brand-blue font-mono">abandon</code> events and prunes aborted workflows.
          </li>
          <li>
            <strong className="text-[#0A0A0A] block">2. Override Engine</strong>
            Tracks <code className="text-brand-blue font-mono">supersedes</code> relations and retains only the latest <code className="text-brand-blue font-mono">set_var</code> per key.
          </li>
          <li>
            <strong className="text-[#0A0A0A] block">3. Deduplication Engine</strong>
            Prunes repeated identical <code className="text-brand-blue font-mono">tool_call</code> &amp; <code className="text-brand-blue font-mono">tool_result</code> nodes.
          </li>
          <li>
            <strong className="text-[#0A0A0A] block">4. Topological Sampler (Cycle Collapse)</strong>
            Collapses cycles and SCCs via Tarjan's algorithm to enforce a clean DAG.
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "receipts",
    title: "Receipts & Event Recovery",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Zero Memory Loss</h3>
        <p className="text-[#5F6368] mb-3 font-sans">
          Pruned events are never deleted permanently from memory. Instead, they are represented in the prompt by <code className="text-brand-blue font-mono">[RECEIPT &lt;node_id&gt;]</code>.
        </p>
        <pre className="bg-[#F8F9FA] p-4 rounded-lg border border-border-subtle text-xs text-[#0A0A0A] font-mono overflow-x-auto">
{`# Recover the full original payload anytime:
print(client.get_receipt("e002"))
# Returns:
# {'id': 'e002', 'type': 'set_var', 'timestamp': 1010, 'key': 'x', 'value': 10, 'pruned': True}`}
        </pre>
      </div>
    )
  },
  {
    id: "schema",
    title: "Event Schema",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Structured Schema Validation</h3>
        <p className="text-[#5F6368] mb-4 font-sans">All events are validated using types defined in <code className="text-brand-blue font-mono">context_gc/events.py</code>:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-[#5F6368]">
                <th className="py-2 pr-4 font-bold font-mono">Event Type</th>
                <th className="py-2 pr-4 font-bold font-mono">Required Fields</th>
                <th className="py-2 font-bold font-mono">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-[#5F6368]">
              <tr>
                <td className="py-2 font-mono text-brand-blue pr-4">set_var</td>
                <td className="py-2 font-mono text-[#5F6368] pr-4">id, type, timestamp, key, value</td>
                <td className="py-2">State update variable tracking.</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-brand-blue pr-4">tool_call</td>
                <td className="py-2 font-mono text-[#5F6368] pr-4">id, type, timestamp, tool_name, arguments</td>
                <td className="py-2">Represents tool invoke request.</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-brand-blue pr-4">tool_result</td>
                <td className="py-2 font-mono text-[#5F6368] pr-4">id, type, timestamp, call_id, result</td>
                <td className="py-2">Result of a tool execution.</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-brand-blue pr-4">abandon</td>
                <td className="py-2 font-mono text-[#5F6368] pr-4">id, type, timestamp, ref_to</td>
                <td className="py-2">Prunes aborted branch logs recursively.</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-brand-blue pr-4">decision</td>
                <td className="py-2 font-mono text-[#5F6368] pr-4">id, type, timestamp, content</td>
                <td className="py-2">Decision logic checkpoint.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: "prior-art",
    title: "Prior Art / Related Work",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Context Reduction Niche</h3>
        <p className="text-[#5F6368] mb-4 font-sans">
          How does Context-GC compare directly with alternative paradigms like Headroom or AI Summarization?
        </p>
        <p className="text-[#5F6368] mb-4 font-sans">
          <strong>Headroom</strong> compresses the <em>content</em> of individual messages/tool-outputs as they arrive—routing JSON/code/logs/text to per-type compressors, and explicitly leaves prior conversation history untouched to preserve provider KV-cache hits.
        </p>
        <p className="text-[#5F6368] font-sans">
          <strong>Context-GC</strong> solves a different layer: given an agent's already-accumulated structured event history, it identifies which parts are now dead (superseded, abandoned, or cyclical) and structurally removes them.
        </p>
      </div>
    )
  },
  {
    id: "benchmarks",
    title: "Benchmark Results",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Verifiably Correct Compaction</h3>
        <p className="text-[#5F6368] mb-3 font-sans">
          Across coding, research, and support traces, Context-GC maintains 100% correct probe recovery while reducing token bloat.
        </p>
        <p className="text-[#5F6368] font-sans">
          Read the full tables under the Benchmarks section of the site, comparing single-shot summarizations, naive truncations, and our pipeline.
        </p>
      </div>
    )
  },
  {
    id: "limitations",
    title: "Limitations",
    content: (
      <div>
        <h3 className="text-xl font-bold font-display text-[#0A0A0A] mb-3">Operational Limits</h3>
        <ul className="list-disc pl-5 text-[#5F6368] space-y-2 text-sm font-sans">
          <li><strong>Structured Inputs Only</strong>: Only operates on structured events. No parsing of unstructured raw natural language transcripts.</li>
          <li><strong>DAG Assumption</strong>: Compilation requires that the graph form a DAG post-Tarjan cycle collapsing.</li>
          <li><strong>Pipeline Overhead</strong>: Compaction re-runs all stages from scratch each call instead of compiling changes incrementally.</li>
        </ul>
      </div>
    )
  }
];

const REPL_STEPS = [
  { text: ">>> from context_gc import ContextGC", delay: 800 },
  { text: ">>> client = ContextGC()", delay: 600 },
  { text: ">>> client.add_event({ 'id': 'e1', 'type': 'set_var', 'key': 'x', 'value': 10 })", delay: 900 },
  { text: ">>> client.add_event({ 'id': 'e2', 'type': 'set_var', 'key': 'x', 'value': 20 })", delay: 800 },
  { text: ">>> result = client.compact()", delay: 700 },
  { text: ">>> print(result['prompt'])", delay: 700 },
  { text: "[RECEIPT e1]\nx = 20", delay: 250, isOutput: true }
];

// Worked Case Studies data matching antigravity.google's carousel style
const CASE_STUDIES = [
  {
    title: "Conversational Reasoning Loop",
    metric: "42% context reduction",
    description: "During multi-step reasoning, agents accumulate deep tree loops and trial runs. Context-GC sweeps aborted paths and redundant thoughts automatically, preserving the final clean sequence.",
    stats: ["Accumulated loops: 4,200 tokens", "Post-compaction: 2,436 tokens", "Correctness: 100% decision probe recall"]
  },
  {
    title: "Multi-File Code Assistant",
    metric: "3.2x KV-cache hits",
    description: "Code generation loops generate repetitive logs, linter results, and duplicate compiler diagnostics. Context-GC collapses these identical steps, maximizing KV-cache reuse.",
    stats: ["Linter errors: collapsed", "Superseded outputs: receipted", "KV-cache hit rate: 84%"]
  },
  {
    title: "Structured Research Web-Scraper",
    metric: "0.00$ extra API latency",
    description: "Scrapers scrape pages in parallel, hitting redirect loops and circular logs. Context-GC resolves cycles defensively via Tarjan's algorithm and strips abandoned paths locally.",
    stats: ["Cycles: collapsed via Tarjan", "Abandoned pages: swept", "Execution cost: fully local (0.0ms)"]
  }
];

// Visual presentation text for each solution pruning stage before/after trace diffs in light mode
const PIPELINE_STAGE_DETAILS = [
  {
    title: "1. Dead-Branch Sweeper",
    description: "DFS sweep deletes unsuccessful sub-branches. When an abandon marker is added, Context-GC removes all preceding path components of that branch.",
    before: `# raw events
e001 [decision] "Try search"
e002 [tool_call] "google_search"
e003 [abandon] ref_to=["e002"]`,
    after: `# pruned output
[RECEIPT e002] # Swept dead branch`
  },
  {
    title: "2. Override Engine",
    description: "Keeps only the most recent set_var per key, converting overridden values into receipts.",
    before: `# raw events
e001 [set_var] key="x", value=10
e002 [set_var] key="x", value=20`,
    after: `# pruned output
[RECEIPT e001] # Overridden
x = 20`
  },
  {
    title: "3. Deduplication Engine",
    description: "Collapses identical sequential tool results, leaving a single receipt.",
    before: `# raw events
e001 [tool_call] "calc" args={x:2}
e002 [tool_result] res=4
e003 [tool_call] "calc" args={x:2}`,
    after: `# pruned output
e001 [tool_call] "calc" args={x:2} -> res=4
[RECEIPT e003] # Duplicate collapsed`
  },
  {
    title: "4. Topological Sampler",
    description: "Defensively collapses loops and cycles via Tarjan's cycle collapse.",
    before: `# raw events
e001 [decision] A -> parent B
e002 [decision] B -> parent A`,
    after: `# pruned output
[RECEIPT e001, e002] # Loop collapsed`
  }
];

export default function ContextGcWebsite() {
  const [stars, setStars] = useState<number | string>("...");
  const [forks, setForks] = useState<number | string>("...");
  const [heroCopied, setHeroCopied] = useState(false);
  const [ctaCopied, setCtaCopied] = useState(false);
  const [codeTab, setCodeTab] = useState<"incremental" | "single-shot">("incremental");
  const [codeCopied, setCodeCopied] = useState(false);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [activeDocTab, setActiveDocTab] = useState("description");
  const [menuOpen, setMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroX = useMotionValue(-1000);
  const heroY = useMotionValue(-1000);
  const springHeroX = useSpring(heroX, { stiffness: 80, damping: 20 });
  const springHeroY = useSpring(heroY, { stiffness: 80, damping: 20 });

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroX.set(e.clientX - rect.left);
    heroY.set(e.clientY - rect.top);
  };

  const handleCtaCopy = () => {
    navigator.clipboard.writeText("pip install context-gc");
    setCtaCopied(true);
    setTimeout(() => setCtaCopied(false), 1500);
  };
  
  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Solution pruning stages tabs
  const [activeStageTab, setActiveStageTab] = useState(0);
  
  // Accordion active indexes for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Expandable benchmarks caveat drawer
  const [caveatOpen, setCaveatOpen] = useState(false);

  // Interactive typewriter terminal REPL states
  const [typedLines, setTypedLines] = useState<Array<{ text: string; isOutput?: boolean }>>([]);
  const [terminalStep, setTerminalStep] = useState(0);

  const [prefersReduced, setPrefersReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check user preferences for motion
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Fetch live star and fork counts from Athish M's context-gc repo, polling every 2 minutes for real-time updates with caching and rate limit safety
  useEffect(() => {
    if (typeof window === "undefined") return;

    const CACHE_KEY = "context_gc_stats";
    const POLLING_INTERVAL_MS = 120000; // 2 minutes

    // Read cache helper
    const getCachedStats = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed.stars === "number" && typeof parsed.forks === "number" && typeof parsed.fetchedAt === "number") {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Failed to read from localStorage:", e);
      }
      return null;
    };

    // Load initial values from cache if possible
    const cachedStats = getCachedStats();
    if (cachedStats) {
      setStars(cachedStats.stars);
      setForks(cachedStats.forks);
    }

    const fetchStats = async () => {
      // Check if cache is still fresh
      const currentCache = getCachedStats();
      if (currentCache) {
        const age = Date.now() - currentCache.fetchedAt;
        if (age < POLLING_INTERVAL_MS) {
          // Cache is fresh, skip fetch
          return;
        }
      }

      try {
        const response = await fetch("https://api.github.com/repos/athishio/context-gc");
        
        // Handle rate limit checks via headers
        const remaining = response.headers.get("X-RateLimit-Remaining");
        if (remaining !== null && parseInt(remaining, 10) === 0) {
          console.warn("GitHub API rate limit exceeded. Skipping this fetch attempt.");
          return;
        }

        if (!response.ok) {
          throw new Error(`GitHub API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (data && typeof data.stargazers_count === "number" && typeof data.forks_count === "number") {
          const newStars = data.stargazers_count;
          const newForks = data.forks_count;
          
          setStars(newStars);
          setForks(newForks);

          // Write to cache
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              stars: newStars,
              forks: newForks,
              fetchedAt: Date.now()
            }));
          } catch (e) {
            console.warn("Failed to write to localStorage:", e);
          }
        }
      } catch (err) {
        console.warn("Error fetching GitHub stats:", err);
        // Fallback: if state is still "...", use cached stats (even if stale) or set fallback 0
        setStars((prev) => {
          if (prev === "...") {
            return cachedStats ? cachedStats.stars : 0;
          }
          return prev;
        });
        setForks((prev) => {
          if (prev === "...") {
            return cachedStats ? cachedStats.forks : 0;
          }
          return prev;
        });
      }
    };

    // If cache is missing or stale, fetch immediately. Otherwise wait for interval.
    const shouldFetchImmediately = !cachedStats || (Date.now() - cachedStats.fetchedAt >= POLLING_INTERVAL_MS);
    if (shouldFetchImmediately) {
      fetchStats();
    }

    const interval = setInterval(fetchStats, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Typewriter automation effect triggered on mount/reset
  useEffect(() => {
    if (terminalStep < REPL_STEPS.length) {
      const step = REPL_STEPS[terminalStep];
      const timer = setTimeout(() => {
        setTypedLines((prev) => [...prev, step]);
        setTerminalStep((prev) => prev + 1);
      }, step.delay);
      return () => clearTimeout(timer);
    }
  }, [terminalStep]);

  const resetTerminalREPL = () => {
    setTypedLines([]);
    setTerminalStep(0);
  };

  const handleHeroCopy = () => {
    navigator.clipboard.writeText("pip install context-gc");
    setHeroCopied(true);
    setTimeout(() => setHeroCopied(false), 1500);
  };

  const handleCodeCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? CASE_STUDIES.length - 1 : prev - 1));
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev === CASE_STUDIES.length - 1 ? 0 : prev + 1));
  };

  const incrementalCode = `from context_gc import ContextGC

# 1. Initialize the client
client = ContextGC()

# 2. Append events incrementally as they occur
client.add_event({
    "id": "e001",
    "type": "decision",
    "timestamp": 1000,
    "parent_id": None,
    "content": "Start config"
})
client.add_event({
    "id": "e002",
    "type": "set_var",
    "timestamp": 1010,
    "parent_id": "e001",
    "key": "x",
    "value": 10
})
client.add_event({
    "id": "e003",
    "type": "set_var",
    "timestamp": 1020,
    "parent_id": "e002",
    "key": "x",
    "value": 20  # Supersedes x=10
})

# 3. Compact the context history on-demand
result = client.compact()
print(result["prompt"])
# Output: [RECEIPT e002]\nx = 20\ndecision: Start config`;

  const singleShotCode = `from context_gc import compact_events

# Low-level single-shot list compaction
events = [
    {
        "id": "e001", 
        "type": "decision", 
        "timestamp": 1000, 
        "parent_id": None, 
        "content": "Initialize workspace"
    },
    {
        "id": "e002", 
        "type": "set_var", 
        "timestamp": 1010, 
        "parent_id": "e001", 
        "key": "mode", 
        "value": "debug"
    }
]

result = compact_events(events)
print(result["prompt"])`;

  return (
    <div className="relative min-h-screen font-sans selection:bg-brand-blue/20 selection:text-brand-blue">
      
      {/* Custom Cursor Ring Follower */}
      <CustomCursor />

      {/* Dynamic drifting background particles */}
      <FloatingParticles />

      {/* 1. STICKY GLASS NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border-subtle transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
            {/* Branded Logo Image */}
            <Image 
              src="/logo.png" 
              alt="Context-GC Logo" 
              width={376} 
              height={418} 
              className="h-7 w-auto sm:h-9 object-contain" 
              priority
            />
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-text-primary hover:text-brand-blue transition-colors duration-300 flex items-center gap-1">
              Context-GC
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav 
            onMouseLeave={() => setHoveredNavIndex(null)}
            className="relative hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted font-sans"
          >
            {/* Docs Dropdown Mega-Menu */}
            <div 
              className="relative px-3 py-1.5 rounded-full"
              onMouseEnter={() => { setDocsDropdownOpen(true); setHoveredNavIndex(0); }}
              onMouseLeave={() => setDocsDropdownOpen(false)}
            >
              <button className="relative z-10 flex items-center gap-1 hover:text-text-primary transition-colors duration-200 cursor-pointer uppercase text-xs font-semibold">
                Docs <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {hoveredNavIndex === 0 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {docsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white border border-border-subtle rounded-lg shadow-xl p-4 grid grid-cols-1 gap-2 z-50 animate-reveal">
                  <button onClick={() => { scrollToSection("docs-preview"); setActiveDocTab("description"); }} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 text-left transition-colors cursor-pointer w-full">
                    <div className="p-1.5 rounded bg-brand-blue/10 text-brand-blue mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-primary">Getting Started</span>
                      <span className="block text-[10px] text-text-muted">Installation, APIs, and schemas</span>
                    </div>
                  </button>
                  <button onClick={() => { scrollToSection("docs-preview"); setActiveDocTab("stages"); }} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 text-left transition-colors cursor-pointer w-full">
                    <div className="p-1.5 rounded bg-brand-green/10 text-brand-green mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-primary">Pruning Stages</span>
                      <span className="block text-[10px] text-text-muted">Override Engine, Sweeper details</span>
                    </div>
                  </button>
                  <button onClick={() => { scrollToSection("docs-preview"); setActiveDocTab("benchmarks"); }} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 text-left transition-colors cursor-pointer w-full">
                    <div className="p-1.5 rounded bg-brand-yellow/10 text-brand-yellow mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-primary">Benchmarks</span>
                      <span className="block text-[10px] text-text-muted">Recall correctness vs summarization</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button 
              onMouseEnter={() => setHoveredNavIndex(1)}
              onClick={() => scrollToSection("pipeline-stages")} 
              className="relative px-3 py-1.5 rounded-full hover:text-text-primary transition-colors duration-200 cursor-pointer text-xs font-semibold"
            >
              <span className="relative z-10">Pipeline</span>
              {hoveredNavIndex === 1 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button 
              onMouseEnter={() => setHoveredNavIndex(2)}
              onClick={() => scrollToSection("benchmarks")} 
              className="relative px-3 py-1.5 rounded-full hover:text-text-primary transition-colors duration-200 cursor-pointer text-xs font-semibold"
            >
              <span className="relative z-10">Benchmarks</span>
              {hoveredNavIndex === 2 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button 
              onMouseEnter={() => setHoveredNavIndex(3)}
              onClick={() => scrollToSection("code-sandbox")} 
              className="relative px-3 py-1.5 rounded-full hover:text-text-primary transition-colors duration-200 cursor-pointer text-xs font-semibold"
            >
              <span className="relative z-10">Examples</span>
              {hoveredNavIndex === 3 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button 
              onMouseEnter={() => setHoveredNavIndex(4)}
              onClick={() => scrollToSection("maintainers")} 
              className="relative px-3 py-1.5 rounded-full hover:text-text-primary transition-colors duration-200 cursor-pointer text-xs font-semibold"
            >
              <span className="relative z-10">Maintainers</span>
              {hoveredNavIndex === 4 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <a 
              onMouseEnter={() => setHoveredNavIndex(5)}
              href="https://github.com/athishio/context-gc" 
              target="_blank" 
              rel="noreferrer" 
              className="relative px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:text-text-primary transition-colors duration-200 font-sans text-xs font-semibold"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </span>
              {hoveredNavIndex === 5 && (
                <motion.div 
                  layoutId="hovered-nav-pill" 
                  className="absolute inset-0 bg-[#F1F3F4] rounded-full z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          </nav>

          {/* Nav CTA - Solid black pill */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("code-sandbox")}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-[#0A0A0A] hover:bg-slate-800 rounded-full transition-all duration-300 cursor-pointer"
            >
              Get Started
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 border-b border-border-subtle backdrop-blur-lg px-4 py-6 flex flex-col gap-4 text-text-muted font-sans text-sm">
            <button onClick={() => scrollToSection("docs-preview")} className="text-left py-2 hover:text-text-primary border-b border-border-subtle">Docs</button>
            <button onClick={() => scrollToSection("pipeline-stages")} className="text-left py-2 hover:text-text-primary border-b border-border-subtle">Pipeline</button>
            <button onClick={() => scrollToSection("benchmarks")} className="text-left py-2 hover:text-text-primary border-b border-border-subtle">Benchmarks</button>
            <button onClick={() => scrollToSection("code-sandbox")} className="text-left py-2 hover:text-text-primary border-b border-border-subtle">Examples</button>
            <button onClick={() => scrollToSection("maintainers")} className="text-left py-2 hover:text-text-primary border-b border-border-subtle">Maintainers</button>
            <a href="https://github.com/athishio/context-gc" target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 hover:text-text-primary border-b border-border-subtle">
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <button
              onClick={() => scrollToSection("code-sandbox")}
              className="w-full mt-4 py-3 text-center text-sm font-semibold text-white bg-[#0A0A0A] rounded-full"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section 
        id="hero" 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center overflow-hidden"
      >
        
        {/* Cursor Halo Glow (Lagging spring radial spotlight) */}
        {mounted && !prefersReduced && (
          <motion.div
            style={{
              x: springHeroX,
              y: springHeroY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="absolute top-0 left-0 pointer-events-none w-[350px] h-[350px] bg-gradient-to-tr from-brand-blue/12 via-brand-green/12 to-brand-yellow/12 rounded-full filter blur-[70px] z-0 pointer-events-none"
          />
        )}

        {/* Colorful Confetti Particle Burst behind the title */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          {mounted && !prefersReduced && [...Array(40)].map((_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            const distance = 100 + Math.random() * 240;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#C582FF"];
            const color = colors[i % colors.length];
            const size = 3 + Math.random() * 6;
            return (
              <div
                key={i}
                style={{
                  "--tw-x": `${tx}px`,
                  "--tw-y": `${ty}px`,
                  backgroundColor: color,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `particle-burst-out 2s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                } as React.CSSProperties}
                className="absolute rounded-full"
              />
            );
          })}
        </div>

        {/* Eyebrow */}
        <motion.div
          animate={mounted && !prefersReduced ? { y: [0, -4, 0] } : undefined}
          transition={mounted && !prefersReduced ? { repeat: Infinity, duration: 4.5, ease: "easeInOut" } : undefined}
          className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F3F4] text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mb-6 sm:mb-8 shadow-sm group/eyebrow relative cursor-help"
        >
          <span className="w-1.5 h-1.5 bg-[#34A853] rounded-full" />
          <span>OPEN SOURCE • Apache 2.0 • ZERO DEPENDENCIES</span>
          {/* Eyebrow Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/eyebrow:block w-64 p-3 bg-[#0A0A0A] text-white text-[10px] sm:text-xs rounded shadow-lg z-50 text-center leading-relaxed font-sans normal-case">
            Licensed under Apache 2.0 starting with version 0.4.0. Prior versions (0.1.0 through 0.3.0) remain permanently licensed under MIT.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A0A0A]" />
          </div>
        </motion.div>

        {/* Headline - Solid black text only */}
        <h1 className="relative z-10 text-[5vw] sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#0A0A0A] mb-6 leading-[1.08] animate-reveal whitespace-nowrap">
          Compress Everything, Forget Nothing
        </h1>

        {/* Description */}
        <p className="relative z-10 max-w-2xl text-[#5F6368] text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 px-2 animate-reveal [animation-delay:150ms] font-sans">
          Context-GC prunes obsolete updates, aborted pipelines, and duplicate
          tool logs from your agent's execution history — deterministically,
          locally, with zero extra LLM calls. Original steps remain recoverable.
        </p>

        {/* Install Pill - Solid light-gray style */}
        <motion.div 
          animate={mounted && !prefersReduced ? { y: [0, -5, 0] } : undefined}
          transition={mounted && !prefersReduced ? { repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.35 } : undefined}
          className="relative z-10 w-full max-w-md mb-8 sm:mb-10 px-2 animate-reveal [animation-delay:300ms]"
        >
          <div 
            onClick={handleHeroCopy}
            className="group relative flex items-center justify-between px-5 py-3.5 bg-[#F1F3F4] hover:bg-slate-200/70 border border-border-subtle rounded-full font-mono text-xs sm:text-sm cursor-pointer transition-all duration-300 select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-text-muted font-bold select-none">$</span>
              <span className="text-text-primary font-medium">pip install context-gc</span>
            </div>
            
            <button className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-brand-blue hover:text-text-primary transition-colors duration-200">
              {heroCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="text-brand-blue font-bold">Copied</span>
                </>
              ) : (
                <span>[ Copy ]</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 animate-reveal [animation-delay:450ms]">
          <MagneticButton 
            onClick={() => scrollToSection("code-sandbox")}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0A0A0A] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton
            onClick={() => window.open("https://github.com/athishio/context-gc", "_blank")}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#F1F3F4] text-text-primary font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer transition-colors duration-250 hover:bg-slate-200/70"
          >
            <Github className="w-4.5 h-4.5" />
            View on GitHub
          </MagneticButton>
        </div>
      </section>

      {/* 3. QUICK STATS & CLAIMS (Plain strip directly below hero) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 border-t border-border-subtle">
        
        {/* Stat strip row - No cards or backgrounds */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-16 text-center">
          <div className="p-2 flex flex-col items-center justify-center">
            <span className="block text-4xl sm:text-6xl font-display font-extrabold text-[#0A0A0A] tracking-tight min-h-[40px] sm:min-h-[60px] flex items-center justify-center">
              <motion.span
                key={stars}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [1.2, 1], opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {stars}
              </motion.span>
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mt-2 font-mono">
              GitHub Stars
            </span>
          </div>

          <div className="p-2 flex flex-col items-center justify-center">
            <span className="block text-4xl sm:text-6xl font-display font-extrabold text-[#0A0A0A] tracking-tight min-h-[40px] sm:min-h-[60px] flex items-center justify-center">
              <motion.span
                key={forks}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [1.2, 1], opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {forks}
              </motion.span>
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mt-2 font-mono">
              GitHub Forks
            </span>
          </div>

          <div className="p-2 flex flex-col items-center justify-center relative group/license cursor-help">
            <span className="block text-3xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight min-h-[40px] sm:min-h-[60px] flex items-center justify-center whitespace-nowrap">
              Apache 2.0
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mt-2 font-mono flex items-center gap-1">
              License
              <Info className="w-3 h-3 text-[#5F6368] opacity-70" />
            </span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover/license:block w-64 p-3 bg-[#0A0A0A] text-white text-[10px] sm:text-xs rounded shadow-lg z-50 text-center leading-relaxed font-sans normal-case">
              Licensed under Apache 2.0 starting with version 0.4.0. Prior versions (0.1.0 through 0.3.0) remain permanently licensed under MIT.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A0A0A]" />
            </div>
          </div>

          <div className="p-2 flex flex-col items-center justify-center">
            <span className="block text-4xl sm:text-6xl font-display font-extrabold text-[#0A0A0A] tracking-tight min-h-[40px] sm:min-h-[60px] flex items-center justify-center">
              Python
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mt-2 font-mono">
              3.9+ Compatible
            </span>
          </div>

          <div className="p-2 flex flex-col items-center justify-center">
            <span className="block text-4xl sm:text-6xl font-display font-extrabold text-[#0A0A0A] tracking-tight min-h-[40px] sm:min-h-[60px] flex items-center justify-center">
              Zero
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5F6368] mt-2 font-mono">
              External Packages
            </span>
          </div>
        </div>

        {/* Claim columns - clean white cards with hairline borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ScrollReveal delay={0}>
            <Card className="shadow-sm border-border-subtle bg-white h-full">
              <div>
                <div className="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-display text-text-primary mb-2">Clean Dependency Profile</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-sans">
                  The core library requires no external third-party imports. Drop it cleanly into any stateful Python workflow layout.
                </p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <Card className="shadow-sm border-border-subtle bg-white h-full">
              <div>
                <div className="w-8 h-8 rounded bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-display text-text-primary mb-2">Strict Determinism</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-sans">
                  Compaction executes locally without stochastic loops. The same input trace always compiles to the exact same prompt prefix.
                </p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Card className="shadow-sm border-border-subtle bg-white h-full">
              <div>
                <div className="w-8 h-8 rounded bg-brand-red/10 flex items-center justify-center text-brand-red mb-4">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-display text-text-primary mb-2">Full Trace Integrity</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-sans">
                  Obsolete events scale down into receipt stubs inline. Retain original parameters inside a lightweight local data store.
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <ProblemSection />

      {/* 5. SOLUTION & PIPELINE STAGES (Clickable Diff Mockups with Pastel Halos - Light Theme) */}
      <section id="pipeline-stages" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Core Engine</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              One Compaction Pass<br />Nothing Lost
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base font-sans">
              Context-GC executes 4 deterministic stages locally, transforming execution graphs into clean, compacted prompt output.
            </p>
          </div>
        </ScrollReveal>

        {/* Clicking tab reveals stage diff */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Stages selector */}
            <div className="flex flex-col gap-3">
              {PIPELINE_STAGE_DETAILS.map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStageTab(idx)}
                  className={`p-4 rounded-lg text-left transition-all duration-300 border hover:scale-[1.01] cursor-pointer ${
                    activeStageTab === idx 
                      ? "bg-white border-brand-blue/60 shadow-sm font-bold" 
                      : "bg-white/60 border-border-subtle hover:bg-white text-text-muted"
                  }`}
                >
                  <div className="font-bold text-sm text-[#0A0A0A] flex items-center justify-between">
                    <span>{stage.title}</span>
                    {activeStageTab === idx && <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" />}
                  </div>
                  <p className="text-[#5F6368] text-xs mt-2 leading-relaxed font-sans">
                    {stage.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Right before/after side-by-side card with blurred gradient halo behind */}
            <div className="lg:col-span-2 relative p-1">
              
              {/* Soft low-saturation pastel gradient spotlight halo */}
              <div className="gradient-halo w-72 h-72 bg-gradient-to-tr from-brand-blue via-brand-green to-brand-yellow -top-10 -right-10" />

              <div className="screenshot-container relative z-10 bg-white border border-border-subtle rounded-xl p-6 sm:p-8 flex flex-col justify-between min-h-[400px]">
                <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-6">
                  <span className="text-xs font-mono text-[#5F6368] uppercase font-bold">Stage Trace Diff</span>
                  <span className="text-xs font-mono text-brand-blue bg-brand-blue/5 border border-brand-blue/20 px-2.5 py-1 rounded-full">
                    Stage {activeStageTab + 1}
                  </span>
                </div>

                {/* Diff Viewer Grid in light theme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-[#EA4335] uppercase font-bold mb-2">Before Compaction</span>
                    <pre className="bg-[#F8F9FA] border border-border-subtle text-[#0A0A0A] p-4 rounded-lg font-mono text-xs overflow-x-auto min-h-[160px]">
                      {PIPELINE_STAGE_DETAILS[activeStageTab].before}
                    </pre>
                  </div>

                  {/* After */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-[#137333] uppercase font-bold mb-2">After Compaction</span>
                    <pre className="bg-[#F8F9FA] border border-border-subtle text-[#137333] p-4 rounded-lg font-mono text-xs overflow-x-auto min-h-[160px]">
                      {PIPELINE_STAGE_DETAILS[activeStageTab].after}
                    </pre>
                  </div>
                </div>

                <div className="mt-8 text-xs text-[#5F6368] font-mono border-t border-border-subtle pt-4 text-center">
                  Stage operations execute locally with a correctness guarantee.
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 6. FEATURE GRID SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Capabilities</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Engineered for Precision
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              Context-GC bypasses lossy summaries. Every pruned byte remains retrievable.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1: Receipt-Based Recovery */}
            <Card className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between group bg-white border-border-subtle shadow-sm">
              <div>
                <span className="text-xs font-mono text-brand-blue font-bold uppercase">Dynamic receipts</span>
                <h3 className="text-lg font-bold font-display text-text-primary mt-2 mb-3">
                  Receipt-Based Recovery
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6 font-sans">
                  Pruned execution logs scale down inline into lightweight token placeholders (<code className="text-xs text-brand-blue bg-slate-100 px-1.5 py-0.5 rounded font-mono">[RECEIPT ID]</code>). Hover over the stubs below to simulate recovery calls:
                </p>

                {/* Recovery simulation hover deck */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div className="relative p-4 rounded bg-slate-50 border border-border-subtle hover:border-brand-blue/30 transition-all duration-300 cursor-pointer group/stub">
                    <span className="text-xs font-mono text-brand-blue font-bold">[RECEIPT e002]</span>
                    <div className="absolute inset-0 bg-slate-100 p-4 rounded opacity-0 group-hover/stub:opacity-100 transition-opacity duration-300 font-mono text-[10px] text-text-primary flex flex-col justify-center border border-brand-blue/30 shadow-sm">
                      <span className="text-brand-blue font-bold">client.get_receipt("e002")</span>
                      <span className="text-text-muted">{"{"}"id": "e002", "type": "set_var", "key": "x", "value": 10, "pruned": true{"}"}</span>
                    </div>
                    <span className="block text-[10px] text-text-muted mt-1 font-mono">&rarr; Hover to expand get_receipt()</span>
                  </div>

                  <div className="relative p-4 rounded bg-slate-50 border border-border-subtle hover:border-brand-blue/30 transition-all duration-300 cursor-pointer group/stub">
                    <span className="text-xs font-mono text-brand-blue font-bold">[RECEIPT e009]</span>
                    <div className="absolute inset-0 bg-slate-100 p-4 rounded opacity-0 group-hover/stub:opacity-100 transition-opacity duration-300 font-mono text-[10px] text-text-primary flex flex-col justify-center border border-brand-blue/30 shadow-sm">
                      <span className="text-brand-blue font-bold">client.get_receipt("e009")</span>
                      <span className="text-text-muted">{"{"}"id": "e009", "type": "set_var", "key": "y", "value": 100, "pruned": true{"}"}</span>
                    </div>
                    <span className="block text-[10px] text-text-muted mt-1 font-mono">&rarr; Hover to expand get_receipt()</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Feature 2: Zero LLM Cost */}
            <Card className="p-6 sm:p-8 flex flex-col justify-between bg-white border-border-subtle shadow-sm">
              <div>
                <span className="text-xs font-mono text-brand-green font-bold uppercase">Zero cost overhead</span>
                <h3 className="text-lg font-bold font-display text-text-primary mt-2 mb-3">
                  No Extra LLM Calls
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-sans">
                  Unlike LLM-based recaps that cost tokens and add latency, compaction logic executes fully locally. Free up LLM workloads and save prompt budgets.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded">Local Dev</span>
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded">Offline</span>
              </div>
            </Card>

            {/* Feature 3: Incremental or Single-Shot */}
            <Card className="p-6 sm:p-8 flex flex-col justify-between bg-white border-border-subtle shadow-sm">
              <div>
                <span className="text-xs font-mono text-brand-yellow font-bold uppercase">API entry points</span>
                <h3 className="text-lg font-bold font-display text-text-primary mt-2 mb-3">
                  Incremental or Single-Shot
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-sans">
                  Initialize the <code className="text-brand-blue text-xs font-mono">ContextGC</code> client wrapper to append logs step-by-step during live agent execution loops, or compile list payloads in batch calls.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded font-mono">ContextGC()</span>
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded font-mono">compact_events()</span>
              </div>
            </Card>

            {/* Feature 4: OpenAI & Anthropic Middlewares */}
            <Card className="p-6 sm:p-8 flex flex-col justify-between bg-white border-border-subtle shadow-sm">
              <div>
                <span className="text-xs font-mono text-brand-red font-bold uppercase">Provider integrations</span>
                <h3 className="text-lg font-bold font-display text-text-primary mt-2 mb-3">
                  Lazy-Loaded Middlewares
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-sans">
                  Connect context compaction easily. Import optional OpenAI and Anthropic adapters (<code className="text-xs text-brand-blue font-mono">call_openai_with_compaction</code>) that load dependencies on-demand.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded">openai</span>
                <span className="text-[10px] bg-slate-100 border border-border-subtle text-text-muted font-mono px-2 py-1 rounded">anthropic</span>
              </div>
            </Card>

            {/* Feature 5: Typed Event Schemas */}
            <Card className="p-6 sm:p-8 flex flex-col justify-between bg-white border-border-subtle shadow-sm">
              <div>
                <span className="text-xs font-mono text-brand-blue font-bold uppercase">Data validation</span>
                <h3 className="text-lg font-bold font-display text-text-primary mt-2 mb-3">
                  Typed Event Schema
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-sans">
                  Robust validation for five basic structured event schemas: <code className="text-xs text-brand-blue font-mono">set_var</code>, <code className="text-xs text-brand-blue font-mono">tool_call</code>, <code className="text-xs text-brand-blue font-mono">tool_result</code>, <code className="text-xs text-brand-blue font-mono">abandon</code>, and <code className="text-xs text-brand-blue font-mono">decision</code>.
                </p>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-text-muted font-mono uppercase">Validated on append</span>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. INTERACTIVE CODE SANDBOX (Light Theme) */}
      <section id="code-sandbox" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Usage</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Zero Complexity Integration
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              Drop context compaction directly into python loops. Code is 100% Python.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="screenshot-container border border-border-subtle overflow-hidden rounded-xl bg-[#F8F9FA] shadow-sm">
            
            {/* Tab switches in light mode */}
            <div className="bg-[#F1F3F4] px-6 py-4 flex items-center justify-between border-b border-border-subtle">
              <div className="flex gap-4">
                <button
                  onClick={() => setCodeTab("incremental")}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${
                    codeTab === "incremental" 
                      ? "bg-white border border-border-subtle text-brand-blue shadow-sm" 
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  client.py (Incremental)
                </button>
                <button
                  onClick={() => setCodeTab("single-shot")}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${
                    codeTab === "single-shot" 
                      ? "bg-white border border-border-subtle text-brand-blue shadow-sm" 
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  single_shot.py (Batch)
                </button>
              </div>
              
              <button
                onClick={() => handleCodeCopy(codeTab === "incremental" ? incrementalCode : singleShotCode)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-4 h-4 text-brand-blue" />
                    <span className="text-brand-blue font-bold">Copied</span>
                  </>
                ) : (
                  <span>[ Copy code ]</span>
                )}
              </button>
            </div>

            {/* Sandbox code viewer container in light mode */}
            <div className="p-6 sm:p-8 bg-[#F8F9FA] overflow-x-auto">
              <pre className="text-xs sm:text-sm text-[#0A0A0A] font-mono leading-relaxed whitespace-pre select-text">
                {codeTab === "incremental" ? incrementalCode : singleShotCode}
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. ARCHITECTURE PIPELINE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Pipeline Workflow</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              A Linear, Deterministic Pipeline
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              Hover over each element below to inspect the stages of compilation.
            </p>
          </div>
        </ScrollReveal>

        {/* SVG Pipeline inside a screenshot frame with gradient halo */}
        <ScrollReveal>
          <div className="relative p-1">
            <div className="gradient-halo w-80 h-80 bg-gradient-to-tr from-brand-blue via-brand-green to-brand-red top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            <div className="screenshot-container relative z-10 bg-white border border-border-subtle p-6 sm:p-10 rounded-xl">
              <div className="relative">
                {/* SVG responsive layout container */}
                <div className="w-full overflow-x-auto pb-4">
                  <svg className="w-full min-w-[700px] h-32 text-slate-400" viewBox="0 0 900 120">
                    {/* Connection lines with flow dash animations */}
                    <g stroke="currentColor" strokeWidth="2">
                      <path 
                        d="M 120,60 L 210,60" 
                        className={`transition-all duration-300 ${
                          hoveredStage === "graph" ? "text-brand-blue stroke-[2.5px]" : "text-slate-350"
                        }`} 
                      />
                      <path 
                        d="M 330,60 L 420,60" 
                        className={`transition-all duration-300 ${
                          hoveredStage === "prune" ? "text-brand-blue stroke-[2.5px]" : "text-slate-350"
                        }`} 
                      />
                      <path 
                        d="M 570,60 L 660,60" 
                        className={`transition-all duration-300 ${
                          hoveredStage === "topo" ? "text-brand-blue stroke-[2.5px]" : "text-slate-350"
                        }`} 
                      />
                      <path d="M 780,60 L 830,60" strokeDasharray="4" />
                    </g>

                    {/* Nodes */}
                    
                    {/* Trace */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage("trace")}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <rect x="10" y="30" width="110" height="60" rx="8" fill="#FFFFFF" stroke={hoveredStage === "trace" ? "#4285F4" : "rgba(0,0,0,0.08)"} strokeWidth="2" className="transition-all duration-300" />
                      <text x="65" y="65" fill={hoveredStage === "trace" ? "#4285F4" : "#0A0A0A"} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Trace (Raw)</text>
                    </g>

                    {/* Graph */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage("graph")}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <rect x="210" y="30" width="120" height="60" rx="8" fill="#FFFFFF" stroke={hoveredStage === "graph" ? "#4285F4" : "rgba(0,0,0,0.08)"} strokeWidth="2" className="transition-all duration-300" />
                      <text x="270" y="65" fill={hoveredStage === "graph" ? "#4285F4" : "#0A0A0A"} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">State Graph</text>
                    </g>

                    {/* Pruning Engines */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage("prune")}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <rect x="420" y="30" width="150" height="60" rx="8" fill="#FFFFFF" stroke={hoveredStage === "prune" ? "#4285F4" : "rgba(0,0,0,0.08)"} strokeWidth="2" className="transition-all duration-300" />
                      <text x="495" y="58" fill={hoveredStage === "prune" ? "#4285F4" : "#0A0A0A"} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Override Engine</text>
                      <text x="495" y="74" fill={hoveredStage === "prune" ? "#4285F4" : "#5F6368"} fontSize="10" fontFamily="monospace" textAnchor="middle">+ Dead-Branch DFS</text>
                    </g>

                    {/* Topo Sampler */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage("topo")}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <rect x="660" y="30" width="120" height="60" rx="8" fill="#FFFFFF" stroke={hoveredStage === "topo" ? "#4285F4" : "rgba(0,0,0,0.08)"} strokeWidth="2" className="transition-all duration-300" />
                      <text x="720" y="65" fill={hoveredStage === "topo" ? "#4285F4" : "#0A0A0A"} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Topo Sampler</text>
                    </g>

                    {/* Outputs */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage("output")}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <rect x="830" y="30" width="60" height="60" rx="8" fill="#FFFFFF" stroke={hoveredStage === "output" ? "#4285F4" : "rgba(0,0,0,0.08)"} strokeWidth="2" className="transition-all duration-300" />
                      <text x="860" y="65" fill="#4285F4" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">DAG</text>
                    </g>
                  </svg>
                </div>

                {/* Description display box */}
                <div className="mt-8 p-6 bg-slate-50 border border-border-subtle rounded-lg min-h-[100px] flex items-center justify-center text-center shadow-inner">
                  {hoveredStage === null && (
                    <span className="text-[#5F6368] font-mono text-xs uppercase tracking-wider">&larr; Hover over pipeline blocks above for detail &rarr;</span>
                  )}
                  {hoveredStage === "trace" && (
                    <div className="text-left w-full">
                      <h5 className="text-brand-blue font-bold font-mono text-sm mb-1">[Stage 01: Chronological Raw Trace]</h5>
                      <p className="text-text-muted text-xs sm:text-sm font-sans">The timeline of structured agent execution logs in append-order. Maps exact historical flow sequences.</p>
                    </div>
                  )}
                  {hoveredStage === "graph" && (
                    <div className="text-left w-full">
                      <h5 className="text-brand-blue font-bold font-mono text-sm mb-1">[Stage 02: Directed Multigraph Compiler]</h5>
                      <p className="text-text-muted text-xs sm:text-sm font-sans">Parses chronological parent dependencies into a directed multigraph structure to understand step overrides and branches.</p>
                    </div>
                  )}
                  {hoveredStage === "prune" && (
                    <div className="text-left w-full">
                      <h5 className="text-brand-blue font-bold font-mono text-sm mb-1">[Stage 03: Pruning Engines (Override &amp; Dead-Branch)]</h5>
                      <p className="text-text-muted text-xs sm:text-sm font-sans">Identifies state mutations that were superseded by subsequent updates and sweeps dead-end branches from parent markers.</p>
                    </div>
                  )}
                  {hoveredStage === "topo" && (
                    <div className="text-left w-full">
                      <h5 className="text-brand-blue font-bold font-mono text-sm mb-1">[Stage 04: Topological cycle sampler]</h5>
                      <p className="text-text-muted text-xs sm:text-sm font-sans">Defensively collapses cycles and strongly connected components (SCCs) via Tarjan's algorithm to enforce correct DAG sequencing.</p>
                    </div>
                  )}
                  {hoveredStage === "output" && (
                    <div className="text-left w-full">
                      <h5 className="text-brand-blue font-bold font-mono text-sm mb-1">[Compacted Prompt &amp; Receipt Database]</h5>
                      <p className="text-text-muted text-xs sm:text-sm font-sans">Compiles the surviving active nodes into a clean prompt string with receipt placeholders representing pruned events.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 9. BENCHMARK SECTION ("Real Data, No Hype") */}
      <section id="benchmarks" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Performance</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Real Data, No Hype
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base leading-relaxed">
              Context-GC does not compete with hosted vector DBs or lose content. Below are literal benchmark statistics across different trace sizes.
            </p>
          </div>
        </ScrollReveal>

        {/* Results table */}
        <ScrollReveal>
          <div className="screenshot-container overflow-hidden mb-8 bg-white border border-border-subtle rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle text-text-muted uppercase font-mono text-[10px] sm:text-xs">
                    <th className="p-4">Trace Size</th>
                    <th className="p-4">Compaction Method</th>
                    <th className="p-4">Tokens</th>
                    <th className="p-4">Recall</th>
                    <th className="p-4">Artifact</th>
                    <th className="p-4">Continuation</th>
                    <th className="p-4">Decision</th>
                    <th className="p-4">Deterministic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-muted">
                  {/* Short */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-primary font-display">Short</td>
                    <td className="p-4 font-mono text-xs">full_history</td>
                    <td className="p-4 font-mono text-xs">121.0</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-text-muted font-mono text-xs">n/a</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-muted font-display">Short</td>
                    <td className="p-4 font-mono text-xs">ai_summarize_single</td>
                    <td className="p-4 font-mono text-xs">90.7</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-[#5F6368] font-bold">33.3%</td>
                    <td className="p-4 text-[#5F6368] font-bold">55.6%</td>
                    <td className="p-4 text-red-500 font-bold">0.0%</td>
                    <td className="p-4 text-red-500 font-mono text-xs font-bold">No</td>
                  </tr>
                  <tr className="bg-brand-blue/5 hover:bg-brand-blue/10 transition-colors">
                    <td className="p-4 font-bold text-brand-blue font-display">Short</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">context_gc_pipeline</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">75.3</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-mono text-xs font-bold">Yes</td>
                  </tr>

                  {/* Medium */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-muted font-display">Medium</td>
                    <td className="p-4 font-mono text-xs">truncate_by_event_count</td>
                    <td className="p-4 font-mono text-xs">133.3</td>
                    <td className="p-4 text-red-500 font-bold">0.0%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-red-500 font-bold">0.0%</td>
                    <td className="p-4 text-red-500 font-bold">0.0%</td>
                    <td className="p-4 text-text-muted font-mono text-xs">n/a</td>
                  </tr>
                  <tr className="bg-brand-blue/5 hover:bg-brand-blue/10 transition-colors">
                    <td className="p-4 font-bold text-brand-blue font-display">Medium</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">context_gc_pipeline</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">299.0</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-mono text-xs font-bold">Yes</td>
                  </tr>

                  {/* Long */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-muted font-display">Long</td>
                    <td className="p-4 font-mono text-xs">ai_summarize_recursive</td>
                    <td className="p-4 font-mono text-xs">219.2</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-red-500 font-bold">0.0%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-text-primary font-bold">100%</td>
                    <td className="p-4 text-red-500 font-mono text-xs font-bold">No</td>
                  </tr>
                  <tr className="bg-brand-blue/5 hover:bg-brand-blue/10 transition-colors">
                    <td className="p-4 font-bold text-brand-blue font-display">Long</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">context_gc_pipeline</td>
                    <td className="p-4 font-mono text-brand-blue font-bold text-xs">1028.3</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-bold">100%</td>
                    <td className="p-4 text-brand-blue font-mono text-xs font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Honestly framed Callout */}
        <ScrollReveal>
          <div className="bg-white border border-border-subtle rounded-lg p-6 mb-6 shadow-sm">
            <blockquote className="text-[#5F6368] text-xs sm:text-sm leading-relaxed italic">
              "Context-GC's token reduction is more conservative than truncation or AI summarization. The tradeoff is deliberate — nothing is ever discarded, and every pruned event is recoverable via <code className="text-xs text-brand-blue font-mono bg-slate-50 border border-border-subtle px-1.5 py-0.5 rounded font-mono">get_receipt()</code>. It is the only method in this benchmark that scored 100% on all four correctness probes at every trace length."
            </blockquote>
          </div>
        </ScrollReveal>

        {/* Expandable Methodology Caveats Drawer */}
        <ScrollReveal>
          <div className="bg-white border border-border-subtle overflow-hidden rounded-lg shadow-sm">
            <button 
              onClick={() => setCaveatOpen(!caveatOpen)}
              className="w-full px-6 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#5F6368] bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer font-mono"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-blue" />
                Methodology Notes &amp; Benchmark Caveats
              </span>
              {caveatOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {caveatOpen && (
              <div className="p-6 bg-[#FAFAFA] border-t border-border-subtle text-xs sm:text-sm text-[#5F6368] space-y-4 leading-relaxed select-text font-sans">
                <p>
                  <strong>1. Exact Substring matching bias</strong>: The decision probe checks for exact substring survival against the original event text. This structurally favors methods that preserve verbatim text (<code className="text-brand-blue font-mono text-xs">context_gc_pipeline</code>, truncation) over methods that paraphrase (<code className="text-brand-blue font-mono text-xs">ai_summarize_single/recursive</code>) — a correctly-summarized, semantically accurate paraphrase can score 0% on this probe even when it retains the right information in different words. We report probe scores as-is because they're deterministic and reproducible, but this benchmark measures literal information survival, not downstream answer correctness.
                </p>
                <p>
                  <strong>2. Model limitations</strong>: Gemini Pro was unavailable due to quota restrictions. All AI-summarization figures were tested on the Flash-tier only.
                </p>
                <p>
                  <strong>3. Sample size limits</strong>: Evaluated using 3 runs per combination fixture, representing specific trace structures rather than broad statistical distribution curves.
                </p>
                <p>
                  <strong>4. Unresolved anomalies</strong>: <code className="text-brand-blue font-mono text-xs">ai_summarize_recursive</code> scored 0% recall on medium traces but recovered to 100% on long traces. This data is reported directly from test runs as-is.
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* 10. WORKED EXAMPLES CAROUSEL (Antigravity-style layout - Light Theme) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Worked Examples</span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 flex items-center gap-1.5">
                Real Case Studies
                <span className="rainbow-cursor" />
              </h2>
            </div>
            
            {/* Carousel navigation controls */}
            <div className="flex gap-2">
              <button 
                onClick={prevCarousel}
                className="p-2 border border-border-subtle hover:border-[#0A0A0A] rounded-full bg-white text-[#5F6368] hover:text-[#0A0A0A] transition-all cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextCarousel}
                className="p-2 border border-border-subtle hover:border-[#0A0A0A] rounded-full bg-white text-[#5F6368] hover:text-[#0A0A0A] transition-all cursor-pointer"
                title="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel container - Light background layout */}
        <ScrollReveal>
          <div className="screenshot-container relative bg-[#F8F9FA] border border-border-subtle rounded-xl p-6 sm:p-10 transition-all duration-500 overflow-hidden min-h-[420px]">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center h-full">
              
              {/* Info panel in light theme */}
              <div className="lg:col-span-2 text-[#0A0A0A]">
                <div className="inline-flex px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-xs font-mono font-semibold text-brand-blue mb-4">
                  {CASE_STUDIES[carouselIndex].metric}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#0A0A0A] mb-4">
                  {CASE_STUDIES[carouselIndex].title}
                </h3>
                <p className="text-[#5F6368] text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  {CASE_STUDIES[carouselIndex].description}
                </p>
                <button 
                  onClick={() => scrollToSection("benchmarks")}
                  className="px-6 py-3 bg-[#0A0A0A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  View Example Metrics
                </button>
              </div>

              {/* Stats panel in light theme */}
              <div className="bg-white border border-border-subtle p-6 rounded-lg font-mono text-xs text-[#0A0A0A] space-y-3 shadow-sm">
                <span className="block text-[10px] text-brand-blue uppercase font-bold tracking-wider mb-2 font-mono">Compacted Log</span>
                {CASE_STUDIES[carouselIndex].stats.map((stat, idx) => (
                  <p key={idx} className="flex items-center gap-2 font-mono text-[#5F6368]">
                    <span className="w-1.5 h-1.5 bg-[#34A853] rounded-full" />
                    {stat}
                  </p>
                ))}
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 11. COMPARISON SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Comparison Matrix</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              How Context-GC Compares
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              Detailed, honest comparisons with alternate agentic memory architectures.
            </p>
          </div>
        </ScrollReveal>

        {/* Project Comparison Table */}
        <ScrollReveal>
          <div className="screenshot-container bg-white border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-subtle text-text-muted uppercase font-mono text-[10px] sm:text-xs">
                    <th className="p-4">Project Paradigm</th>
                    <th className="p-4">Focus</th>
                    <th className="p-4">Strength</th>
                    <th className="p-4">Limitation vs. Context-GC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-muted">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-primary font-display">MemGPT / Letta</td>
                    <td className="p-4 text-text-muted">OS-style virtual context memory paging to disk</td>
                    <td className="p-4 text-text-muted">Broad framework tooling, mature agent systems</td>
                    <td className="p-4 text-brand-blue">Heavier architecture. Not a zero-dependency local utility library.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-primary font-display">Vector DB / RAG Memory</td>
                    <td className="p-4 text-text-muted">Semantic text search query over raw memories</td>
                    <td className="p-4 text-text-muted">Excellent semantic recall accuracy at scale</td>
                    <td className="p-4 text-brand-blue">Requires hosted databases. Non-deterministic and lack receipts.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-primary font-display">AI Summarization</td>
                    <td className="p-4 text-text-muted">LLM recaps that summarize linear logs periodically</td>
                    <td className="p-4 text-text-muted">Flexible summaries for natural language prose</td>
                    <td className="p-4 text-brand-blue">Stochastic, adds API cost/latency, zero decision-probe score.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-text-primary font-display">Knowledge Graph systems</td>
                    <td className="p-4 text-text-muted">Structuring experience as entity-relation networks</td>
                    <td className="p-4 text-text-muted">Extremely rich semantic database indexing</td>
                    <td className="p-4 text-brand-blue">Typically requires LLM parsing. Heavy runtime compared to local events.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 12. DEVELOPER EXPERIENCE / TERMINAL (Light Theme Mock REPL) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Developer Experience</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Simple Execution Loop
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              No complex setup scripts. Just pip install and import client modules inside Python.
            </p>
          </div>
        </ScrollReveal>

        {/* macOS Style Mock terminal with halo backdrop (Light Mode) */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto relative p-1">
            
            <div className="gradient-halo w-60 h-60 bg-gradient-to-tr from-brand-blue via-brand-yellow to-brand-red top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="screenshot-container relative z-10 bg-[#F8F9FA] border border-border-subtle overflow-hidden rounded-xl shadow-sm">
              {/* Header chrome */}
              <div className="bg-[#F1F3F4] px-4 py-3 flex items-center justify-between border-b border-border-subtle font-mono">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/85 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/85 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/85 inline-block" />
                </div>
                <span className="text-[10px] font-mono text-text-muted">python3 - REPL terminal</span>
                <button 
                  onClick={resetTerminalREPL}
                  className="text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
                  title="Restart typewriter simulation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scripted code typewriter timeline output in light mode */}
              <div className="p-6 bg-[#F8F9FA] font-mono text-xs sm:text-sm text-[#0A0A0A] min-h-[320px] select-text">
                <div className="mb-4">
                  <span className="text-text-muted font-mono">$</span> <span className="text-[#0A0A0A] font-bold">pip install context-gc</span>
                  <p className="text-[#5F6368] text-xs mt-1 leading-relaxed">
                    Downloading context_gc-0.3.0-py3-none-any.whl (24 kB){"\n"}
                    Installing collected packages: context-gc{"\n"}
                    Successfully installed context-gc-0.3.0
                  </p>
                </div>

                <div className="space-y-1.5 font-mono text-[#0A0A0A]">
                  <span className="text-[#5F6368] font-mono">$</span> <span className="text-[#0A0A0A] font-bold">python3</span>
                  
                  {/* Dynamically typed REPL lines */}
                  {typedLines.map((line, idx) => (
                    <p 
                      key={idx} 
                      className={`leading-relaxed font-mono ${
                        line.isOutput ? "text-brand-blue mt-2 font-bold" : "text-[#5F6368]"
                      }`}
                    >
                      {line.text}
                    </p>
                  ))}

                  {/* Cursor blink */}
                  {terminalStep < REPL_STEPS.length && (
                    <div className="inline-block align-middle w-1.5 h-4 bg-brand-blue animate-cursor-blink ml-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 13. DOCUMENTATION PREVIEW */}
      <section id="docs-preview" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Knowledgebase</span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Reference Documentation
            </h2>
            <p className="text-[#5F6368] text-sm sm:text-base">
              Get instant answers regarding schemas, validation rules, and configuration parameters.
            </p>
          </div>
        </ScrollReveal>

        {/* Documentation split-screen layout */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Menu */}
            <div className="lg:col-span-1 flex flex-col gap-1 border-r border-border-subtle pr-4 max-h-[450px] overflow-y-auto font-mono">
              {DOCS_DATA.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocTab(doc.id)}
                  className={`w-full px-4 py-2.5 rounded-full text-left text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    activeDocTab === doc.id
                      ? "bg-slate-100 border-l-2 border-brand-blue text-brand-blue"
                      : "text-text-muted hover:text-text-primary hover:bg-slate-150"
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-3 p-6 sm:p-8 bg-white border border-border-subtle rounded-xl min-h-[350px] select-text shadow-sm">
              {DOCS_DATA.find((doc) => doc.id === activeDocTab)?.content}
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 14. FAQ SECTION */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0A0A0A] tracking-tight mt-2 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        {/* Accordions */}
        <ScrollReveal>
          <div className="space-y-4">
            {[
              {
                q: "What is Context-GC?",
                a: "Context-GC is a framework-agnostic Python library that compacts an AI agent's execution traces (tool outputs, state variables, and decision pathways) so they fit inside small LLM prompt boundaries. It runs 100% locally and deterministically, with zero external dependencies."
              },
              {
                q: "How is this different from AI summarization?",
                a: "AI summarization uses stochastic language models to write conversational summaries. Summaries are slow, non-deterministic, cost api fees, and score 0% on decision probes. Context-GC uses precise graph algorithms to delete superseded values and abandoned branches while leaving recoverable receipt placeholders."
              },
              {
                q: "What does 'receipt-preserving' mean?",
                a: "When Context-GC prunes an event from prompt context, it converts the event into an inline receipt stub: `[RECEIPT node_id]`. The caller can retrieve the original parameters (such as execution parameters or logs) using the `get_receipt(graph, node_id)` function at any time."
              },
              {
                q: "Does Context-GC call an LLM to compact context?",
                a: "No. The entire compaction pipeline executes locally inside the Python script. No models are queried, eliminating api latencies, usage pricing, and data residency risks."
              },
              {
                q: "What event types does it support?",
                a: "It supports five core validated schemas: `set_var` (state updates), `tool_call` (tool invokes), `tool_result` (returns), `abandon` (sweeps failed paths), and `decision` (agent reasoning)."
              },
              {
                q: "Is the incremental .compact() call actually incremental?",
                a: "No. Compacting runs the complete pipeline stages from scratch across all graph events. It represents a linear runtime compiler that compiles final prompts on-demand rather than maintaining an incremental buffer."
              },
              {
                q: "What are Context-GC's limitations?",
                a: "It handles structured event traces only (no natural language parsing), assumes traces resolve into a DAG post cycle-collapsing, and doesn't deduplicate file/test updates because historical logs are needed for testing records."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-border-subtle rounded-lg overflow-hidden duration-300 hover:border-black/16 shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm sm:text-base font-bold text-text-primary hover:text-brand-blue transition-colors duration-200 cursor-pointer font-display"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-brand-blue" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border-subtle pt-4 select-text animate-reveal font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 15. CREATOR/MAINTAINER SECTION (Clean grid, modest scale) */}
      <section id="maintainers" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border-subtle bg-bg-band">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">Maintainers</span>
            <h2 className="text-3xl font-display font-extrabold text-text-primary tracking-tight mt-2">
              Built in the Open
            </h2>
            <p className="text-[#5F6368] text-xs sm:text-sm mt-2 font-sans max-w-md mx-auto">
              Context-GC is maintained on GitHub by the developers below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            
            {/* Athish M */}
            <div className="p-6 rounded-lg bg-white border border-border-subtle hover:border-black/16 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center shadow-sm">
              <div className="relative w-16 h-16 rounded-full border border-border-subtle overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://github.com/athishio.png"
                  alt="Athish M GitHub Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display font-bold text-base text-[#0A0A0A] mb-1">Athish M</h3>
              <p className="text-text-muted text-[10px] font-mono mb-3">@athishio • Main Maintainer</p>
              <a
                href="https://github.com/athishio"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2.5 bg-[#0A0A0A] hover:bg-slate-800 font-semibold text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-white"
              >
                View GitHub Profile &rarr;
              </a>
            </div>

            {/* Kamalesh T */}
            <div className="p-6 rounded-lg bg-white border border-border-subtle hover:border-black/16 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center shadow-sm">
              <div className="relative w-16 h-16 rounded-full border border-border-subtle overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://github.com/kamaleshio.png"
                  alt="Kamalesh T GitHub Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://github.com/identicons/kamaleshio.png";
                  }}
                />
              </div>
              <h3 className="font-display font-bold text-base text-[#0A0A0A] mb-1">Kamalesh T</h3>
              <p className="text-text-muted text-[10px] font-mono mb-3">@kamaleshio • Maintainer</p>
              <a
                href="https://github.com/kamaleshio"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2.5 bg-[#0A0A0A] hover:bg-slate-800 font-semibold text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-white"
              >
                View GitHub Profile &rarr;
              </a>
            </div>

            {/* Rohinth K V */}
            <div className="p-6 rounded-lg bg-white border border-border-subtle hover:border-black/16 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center shadow-sm">
              <div className="relative w-16 h-16 rounded-full border border-border-subtle overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://github.com/Rohinth-hq.png"
                  alt="Rohinth K V GitHub Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://github.com/identicons/Rohinth-hq.png";
                  }}
                />
              </div>
              <h3 className="font-display font-bold text-base text-[#0A0A0A] mb-1">Rohinth K V</h3>
              <p className="text-text-muted text-[10px] font-mono mb-3">@Rohinth-hq • Maintainer</p>
              <a
                href="https://github.com/Rohinth-hq"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2.5 bg-[#0A0A0A] hover:bg-slate-800 font-semibold text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-white"
              >
                View GitHub Profile &rarr;
              </a>
            </div>

            {/* Bavithiran V */}
            <div className="p-6 rounded-lg bg-white border border-border-subtle hover:border-black/16 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center shadow-sm">
              <div className="relative w-16 h-16 rounded-full border border-border-subtle overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
                <img
                  src="https://github.com/bavithiranv.png"
                  alt="Bavithiran V GitHub Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://github.com/identicons/bavithiranv.png";
                  }}
                />
              </div>
              <h3 className="font-display font-bold text-base text-[#0A0A0A] mb-1">Bavithiran V</h3>
              <p className="text-text-muted text-[10px] font-mono mb-3">@bavithiranv • Maintainer</p>
              <a
                href="https://github.com/bavithiranv"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2.5 bg-[#0A0A0A] hover:bg-slate-800 font-semibold text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-white"
              >
                View GitHub Profile &rarr;
              </a>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 16. FINAL CALL TO ACTION (CTA) (Dotted outlines constellation card device) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border-subtle text-center font-sans overflow-hidden">
        
        {/* Ambient background dots */}
        <div className="absolute inset-0 pointer-events-none z-0 ambient-dots" />

        <ScrollReveal>
          <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Get Started */}
            <DottedConstellationCard className="flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-blue block mb-2">Available at no charge</span>
                <h3 className="text-2xl font-bold font-display text-[#0A0A0A] mb-4">Integrate Context-GC</h3>
                <p className="text-[#5F6368] text-xs sm:text-sm leading-relaxed mb-6">
                  Compact event timelines deterministically. Save LLM window space and costs.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 items-center">
                <div 
                  onClick={handleCtaCopy}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 border border-border-subtle p-3 rounded-full font-mono text-[11px] text-[#0A0A0A] flex justify-between items-center px-4 cursor-pointer transition-all duration-200 select-none"
                >
                  <span>pip install context-gc</span>
                  {ctaCopied ? (
                    <span className="text-[10px] text-brand-blue font-bold uppercase flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-brand-blue font-bold uppercase">
                      [ Copy ]
                    </span>
                  )}
                </div>
                <motion.button 
                  onClick={() => scrollToSection("code-sandbox")}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full py-3 bg-[#0A0A0A] text-white font-bold text-xs uppercase tracking-wider rounded-full cursor-pointer"
                >
                  Get Started &rarr;
                </motion.button>
              </div>
            </DottedConstellationCard>

            {/* Card 2: View GitHub */}
            <DottedConstellationCard className="flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-green block mb-2">Open Source</span>
                <h3 className="text-2xl font-bold font-display text-[#0A0A0A] mb-4">Contribute on GitHub</h3>
                <p className="text-[#5F6368] text-xs sm:text-sm leading-relaxed mb-6">
                  Read codebase sources, check test coverages, and download benchmarks.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 items-center">
                <motion.a
                  href="https://github.com/athishio/context-gc"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full py-3 bg-[#F1F3F4] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200/70"
                >
                  <Github className="w-4 h-4" />
                  View GitHub
                </motion.a>
                <motion.button 
                  onClick={() => scrollToSection("docs-preview")}
                  whileHover={{ y: -2, backgroundColor: "#F8F9FA" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full py-3 bg-white border border-border-subtle text-[#0A0A0A] font-bold text-xs uppercase tracking-wider rounded-full cursor-pointer"
                >
                  Read Documentation
                </motion.button>
              </div>
            </DottedConstellationCard>

          </div>
        </ScrollReveal>
      </section>

      {/* 17. FOOTER */}
      <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border-subtle bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          
          {/* Logo & Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image 
                src="/logo.png" 
                alt="Context-GC Logo" 
                width={376} 
                height={418} 
                className="h-8 w-auto object-contain" 
              />
              <span className="font-display font-extrabold text-lg tracking-tight text-[#0A0A0A]">Context-GC</span>
            </div>
            <p className="text-[#5F6368] text-xs sm:text-sm leading-relaxed max-w-sm">
              Deterministic, receipt-preserving context compaction middleware for AI agents. Keep history compact without risking information loss.
            </p>
          </div>

          {/* Links col 1 */}
          <div>
            <h5 className="font-mono text-[10px] uppercase font-bold text-[#5F6368] mb-4 tracking-wider">Resources</h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5F6368]">
              <li><button onClick={() => scrollToSection("docs-preview")} className="hover:text-[#0A0A0A] transition-colors duration-200 cursor-pointer">Documentation</button></li>
              <li><button onClick={() => scrollToSection("code-sandbox")} className="hover:text-[#0A0A0A] transition-colors duration-200 cursor-pointer">Quick Start</button></li>
              <li><button onClick={() => scrollToSection("benchmarks")} className="hover:text-[#0A0A0A] transition-colors duration-200 cursor-pointer">Benchmark Report</button></li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h5 className="font-mono text-[10px] uppercase font-bold text-[#5F6368] mb-4 tracking-wider font-mono">Open Source</h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5F6368]">
              <li><a href="https://github.com/athishio/context-gc" target="_blank" rel="noreferrer" className="hover:text-[#0A0A0A] transition-colors duration-200">GitHub Repository</a></li>
              <li className="relative group/footer-license">
                <a 
                  href="https://www.apache.org/licenses/LICENSE-2.0" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#0A0A0A] transition-colors duration-200 cursor-help"
                >
                  Apache 2.0 License
                </a>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/footer-license:block w-64 p-3 bg-[#0A0A0A] text-white text-[10px] sm:text-xs rounded shadow-lg z-50 text-center leading-relaxed">
                  Licensed under Apache 2.0 starting with version 0.4.0. Prior versions (0.1.0 through 0.3.0) remain permanently licensed under MIT.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A0A0A]" />
                </div>
              </li>
              <li><a href="https://github.com/athishio/context-gc/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer" className="hover:text-[#0A0A0A] transition-colors duration-200">CHANGELOG</a></li>
            </ul>
          </div>
        </div>

        {/* Massive 200px+ black footer wordmark graphic */}
        <div className="w-full text-center border-t border-border-subtle pt-12 pb-6 overflow-hidden select-none pointer-events-none">
          <span className="block text-[14vw] sm:text-[9vw] font-display font-extrabold text-[#0A0A0A] tracking-tighter leading-none opacity-[0.04]">
            CONTEXT-GC
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-[11px] sm:text-xs text-[#5F6368] font-mono">
          <span>© 2026 Context-GC. Built in the open.</span>
          <span className="relative group/footer-bottom-license cursor-help">
            github.com/athishio/context-gc · Apache 2.0 License
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/footer-bottom-license:block w-64 p-3 bg-[#0A0A0A] text-white text-[10px] sm:text-xs rounded shadow-lg z-50 text-center leading-relaxed font-sans normal-case">
              Licensed under Apache 2.0 starting with version 0.4.0. Prior versions (0.1.0 through 0.3.0) remain permanently licensed under MIT.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A0A0A]" />
            </div>
          </span>
        </div>
      </footer>

    </div>
  );
}
