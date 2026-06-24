import { useEffect, useRef, useState } from "react";

interface FeatureItem {
    icon: React.ReactNode;
    tag: string;
    title: string;
    desc: string;
    bullets: string[];
    accent: string;
    accentSoft: string;
    side: "left" | "right";
}

interface StatItem {
    value: string;
    label: string;
}

interface StepItem {
    step: string;
    title: string;
    desc: string;
    color: string;
}

export default function Intro() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.8 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.2 - 0.15;
                this.opacity = Math.random() * 0.25 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = height;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "#a78bfa";
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }

        const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            for (const p of particles) {
                p.update();
                p.draw();
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLoginSelect = (role: "Patient" | "Doctor") => {
        setIsExiting(true);
        setTimeout(() => {
            window.location.href = `/login?role=${role}`;
        }, 550);
    };

    const features: FeatureItem[] = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.75rem", height: "1.75rem" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            tag: "Smart Docs",
            title: "PDF Report Simplifier",
            desc: "Upload any medical report, lab result, or discharge summary. Our AI breaks down complex clinical language into plain, easy-to-understand summaries — so patients always know what their results actually mean.",
            bullets: ["Lab result interpretation", "Medication dosage explained", "Diagnosis plain-language summary"],
            accent: "#a78bfa",
            accentSoft: "rgba(167, 139, 250, 0.08)",
            side: "left",
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.75rem", height: "1.75rem" }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            tag: "Secure Messaging",
            title: "Doctor–Patient Chat",
            desc: "End-to-end encrypted real-time messaging between patients and their care team. Share files, ask follow-up questions, and receive clinical guidance — all within a HIPAA-compliant channel.",
            bullets: ["End-to-end encrypted", "File & image sharing", "Read receipts & status"],
            accent: "#c084fc",
            accentSoft: "rgba(192, 132, 252, 0.08)",
            side: "right",
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.75rem", height: "1.75rem" }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    <path d="M9 10h.01M15 10h.01" />
                </svg>
            ),
            tag: "AI Assistant",
            title: "Clinical AI Copilot",
            desc: "An intelligent assistant trained on medical knowledge that helps patients understand symptoms, suggests when to seek care, and assists clinicians with differential diagnoses and documentation drafts.",
            bullets: ["Symptom checker & triage", "Differential diagnosis hints", "Clinical note drafting"],
            accent: "#818cf8",
            accentSoft: "rgba(129, 140, 248, 0.08)",
            side: "left",
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.75rem", height: "1.75rem" }}>
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            tag: "Health Records",
            title: "Unified Patient Dashboard",
            desc: "A single timeline view of every visit, prescription, test, and referral. Patients and doctors both get contextual access to the full medical history — structured, searchable, and always up to date.",
            bullets: ["Full visit history timeline", "Prescription tracking", "Referral & follow-up alerts"],
            accent: "#e879f9",
            accentSoft: "rgba(232, 121, 249, 0.08)",
            side: "right",
        },
    ];

    const stats: StatItem[] = [
        { value: "2+", label: "Reports simplified" },
        { value: "98%", label: "Patient satisfaction" },
        { value: "1", label: "Clinics onboarded" },
        { value: "<2s", label: "AI response time" },
    ];

    const steps: StepItem[] = [
        { step: "01", title: "Create account", desc: "Sign up as a patient or clinician in under 60 seconds.", color: "#7c3aed" },
        { step: "02", title: "Connect records", desc: "Upload past reports or link your existing EMR system.", color: "#a78bfa" },
        { step: "03", title: "AI processing", desc: "Instant summaries, smart suggestions, and proactive alerts.", color: "#c084fc" },
        { step: "04", title: "Collaborate", desc: "Message your care team, share results, track progress.", color: "#818cf8" },
    ];

    return (
        <>
            <nav 
                className="nav-pill" 
                style={{ 
                    position: "fixed",
                    top: "1.5rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "9999px",
                    background: "rgba(10, 10, 15, 0.75)",
                    border: "1px solid rgba(167, 139, 250, 0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: 100,
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: scrollY > 60 ? 1 : 0, 
                    pointerEvents: scrollY > 60 ? "all" : "none",
                    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
            >
                <span style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>MedBrief</span>
                <div style={{ width: "1px", height: "1rem", background: "rgba(255,255,255,0.15)" }} />
                <button className="nav-link" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</button>
                <button className="nav-link" onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}>Impact</button>
                <button className="nav-link" onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>Get Started</button>
            </nav>

            <div 
                className="intro-wrapper-root" 
                style={{ 
                    backgroundColor: "#050508", 
                    width: "100%", 
                    minHeight: "100vh", 
                    color: "#ffffff", 
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    overflowX: "hidden",
                    boxSizing: "border-box",
                    transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)", 
                    opacity: isExiting ? 0 : 1, 
                    transform: isExiting ? "scale(0.96) translateY(-8px)" : "scale(1) translateY(0)" 
                }}
            >
                <section style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "4rem 1.5rem 2rem", boxSizing: "border-box" }}>
                    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />
                    
                    <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: "40rem", height: "40rem", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

                    <div />

                    <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", }}>
                    
                        <div style={{ position: "relative", width: "7.5rem", height: "7.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5rem" }}>
                            <div className="mb-intro-pr" style={{ border: "1px solid rgba(124,58,237,0.5)", animationDelay: "0s" }} />
                            <div className="mb-intro-pr" style={{ border: "1px solid rgba(167,139,250,0.3)", animationDelay: "0.6s" }} />
                            <div className="mb-intro-pr" style={{ border: "1px solid rgba(124,58,237,0.2)", animationDelay: "1.2s" }} />
                            <div style={{ width: "3.75rem", height: "3.75rem", borderRadius: "50%", backgroundColor: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, boxShadow: "0 0 30px rgba(124,58,237,0.6)" }}>
                                <svg className="mb-heart" style={{ width: "1.75rem", height: "1.75rem" }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12h3l2-7 4 14 2-7h7" />
                                </svg>
                            </div>
                        </div>

                        <h1 style={{ fontSize: "clamp(3.2rem, 8vw, 4.8rem)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 1rem 0", background: "linear-gradient(135deg, #ffffff 30%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "flex", gap: "1px" }}>
                            {"MedBrief".split("").map((char, i) => (
                                <span key={i} className="mb-letter" style={{ animationDelay: `${0.4 + i * 0.06}s` }}>{char}</span>
                            ))}
                        </h1>

                        <p className="mb-sub" style={{ fontSize: "clamp(1rem, 2.5vw, 1.15rem)", color: "#9ca3af", fontWeight: 400, letterSpacing: "0.01em", textAlign: "center", maxWidth: "30rem", margin: "0 auto 3rem", padding: "0 1rem", lineHeight: 1.5 }}>
                            Your intelligent, AI-guided clinical health engine.
                        </p>

                        <div className="mb-ctas" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1.25rem", width: "100%", maxWidth: "32rem", padding: "0 1rem", justifyContent: "center", boxSizing: "border-box" }}>
                            <button onClick={() => handleLoginSelect("Patient")} className="shimmer-btn btn-p" style={{ flex: "1 1 160px", padding: "1rem 1.75rem", fontSize: "0.9rem", fontWeight: 600, color: "#fff", backgroundColor: "#7c3aed", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer", transition: "all 0.2s" }}>
                                Patient Portal
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button onClick={() => handleLoginSelect("Doctor")} className="shimmer-btn btn-o" style={{ flex: "1 1 160px", padding: "1rem 1.75rem", fontSize: "0.9rem", fontWeight: 600, color: "#e5e7eb", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                                Clinician Portal
                            </button>
                        </div>

                        <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                            <span>Scroll to explore</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "float 2s ease-in-out infinite" }}><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                        </div>
                    </div>

                    <div className="mb-foot" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: "0.75rem", userSelect: "none", zIndex: 10, marginTop: "2rem" }}>
                        <span>SECURE MEDICAL CHANNELS</span><span>•</span><span>HIPAA COMPLIANT INFRASTRUCTURE</span>
                    </div>
                </section>

                <section id="features" style={{ maxWidth: "900px", margin: "0 auto", padding: "8rem 1.5rem", boxSizing: "border-box" }}>
                    <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                        <div className="section-tag" style={{ display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: "2rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(124,58,237,0.12)", color: "#a78bfa", marginBottom: "1rem" }}>System Core Capabilities</div>
                        <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 1.25rem 0" }}>
                            Everything your healthcare<br />
                            <span style={{ background: "linear-gradient(90deg, #a78bfa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>journey requires</span>
                        </h2>
                        <p style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
                            One platform connecting patients, clinicians, and tailored AI models so context is never lost.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {features.map((f, i) => (
                            <FeatureCard key={i} feature={f} index={i} />
                        ))}
                    </div>
                </section>

                <section id="stats" style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.4) 0%, rgba(5,5,8,0.8) 100%)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "6rem 1.5rem", boxSizing: "border-box" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                            <div className="section-tag" style={{ display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: "2rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(192,132,252,0.12)", color: "#c084fc", marginBottom: "1rem" }}>System Performance</div>
                            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Engine Validation Metrics</h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
                            {stats.map((s, i) => (
                                <StatCard key={i} stat={s} delay={i * 0.1} />
                            ))}
                        </div>
                    </div>
                </section>

                <section style={{ maxWidth: "900px", margin: "0 auto", padding: "8rem 1.5rem", boxSizing: "border-box" }}>
                    <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                        <div className="section-tag" style={{ display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: "2rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(129,140,248,0.12)", color: "#818cf8", marginBottom: "1rem" }}>Integration Process</div>
                        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Onboarded in minutes</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                        {steps.map((s, i) => (
                            <HowItWorksCard key={i} s={s} delay={i * 0.1} />
                        ))}
                    </div>
                </section>

                <section id="cta" style={{ padding: "4rem 1.5rem 8rem", boxSizing: "border-box", display: "flex", justifyContent: "center" }}>
                    <CtaSection onPatient={() => handleLoginSelect("Patient")} onDoctor={() => handleLoginSelect("Doctor")} />
                </section>
            </div>
        </>
    );
}

function FeatureCard({ feature: f, index }: { feature: FeatureItem; index: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold: 0.12 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const isRight = f.side === "right";

    return (
        <div 
            ref={ref} 
            className={`feat-card${visible ? " visible" : ""}`}
            style={{ 
                display: "flex",
                flexDirection: isRight ? "row-reverse" : "row",
                gap: "2.5rem",
                padding: "2.5rem",
                background: "rgba(255, 255, 255, 0.01)",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                borderRadius: "1.5rem",
                alignItems: "center",
                flexWrap: "wrap",
                boxSizing: "border-box",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${index * 0.05}s`
            }}
        >
            <div 
                className="feat-icon-wrap" 
                style={{ 
                    background: f.accentSoft, 
                    color: f.accent, 
                    width: "4.5rem",
                    height: "4.5rem",
                    borderRadius: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 30px -10px ${f.accentSoft}`,
                    border: `1px solid rgba(255,255,255,0.02)`
                }}
            >
                {f.icon}
            </div>
            
            <div style={{ flex: "1 1 300px" }}>
                <div style={{ display: "inline-block", padding: "0.25rem 0.65rem", borderRadius: "2rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: f.accentSoft, color: f.accent, marginBottom: "0.75rem" }}>
                    {f.tag}
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.75rem 0", color: "#ffffff" }}>{f.title}</h3>
                <p style={{ fontSize: "0.925rem", color: "#9ca3af", lineHeight: 1.65, margin: "0 0 1.25rem 0" }}>{f.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {f.bullets.map((b: string, i: number) => (
                        <div key={i} className="bullet-item" style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                            <div className="bullet-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.accent, boxShadow: `0 0 8px ${f.accent}` }} />
                            {b}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            style={{ 
                padding: "2rem 1.5rem",
                background: "rgba(255,255,255,0.01)",
                border: "1px solid rgba(255,255,255,0.03)",
                borderRadius: "1.25rem",
                textAlign: "center",
                boxSizing: "border-box",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.92)",
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${delay}s`
            }}
        >
            <div style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.5rem", fontWeight: 500, letterSpacing: "0.02em" }}>
                {stat.label}
            </div>
        </div>
    );
}

function HowItWorksCard({ s, delay }: { s: StepItem; delay: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            style={{ 
                padding: "2rem",
                background: "rgba(10, 10, 15, 0.5)",
                border: "1px solid rgba(255,255,255,0.02)",
                borderRadius: "1.25rem",
                boxSizing: "border-box",
                opacity: visible ? 1 : 0, 
                transform: visible ? "translateY(0)" : "translateY(25px)", 
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${delay}s`
            }}
        >
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: s.color, opacity: 0.4, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                {s.step}
            </div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#ffffff" }}>{s.title}</h4>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
        </div>
    );
}

function CtaSection({ onPatient, onDoctor }: { onPatient: () => void; onDoctor: () => void }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            style={{ 
                width: "100%",
                maxWidth: "720px", 
                textAlign: "center", 
                padding: "4rem 2rem", 
                background: "radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, rgba(5,5,8,0) 70%)", 
                border: "1px solid rgba(167,139,250,0.15)", 
                borderRadius: "2rem",
                boxSizing: "border-box",
                boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.96)",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
        >
            <div style={{ width: "3.25rem", height: "3.25rem", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem", boxShadow: "0 0 25px rgba(124,58,237,0.4)" }}>
                <svg style={{ width: "1.5rem", height: "1.5rem" }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h3l2-7 4 14 2-7h7" />
                </svg>
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 1rem 0", lineHeight: 1.2 }}>
                Transform your digital<br />healthcare experience
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
                Join thousands of patients and clinicians optimizing medical tracking timelines, secure channels, and simplified document intelligence.
            </p>
            <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={onPatient} className="shimmer-btn btn-p" style={{ padding: "0.95rem 2.25rem", fontSize: "0.9rem", fontWeight: 600, color: "#fff", backgroundColor: "#7c3aed", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}>
                    Start as Patient
                </button>
                <button onClick={onDoctor} className="shimmer-btn btn-o" style={{ padding: "0.95rem 2.25rem", fontSize: "0.9rem", fontWeight: 600, color: "#e5e7eb", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}>
                    Join as Clinician
                </button>
            </div>
        </div>
    );
}