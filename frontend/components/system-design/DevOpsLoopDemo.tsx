'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, Code, TestTube, Package, Rocket, RefreshCw } from 'lucide-react';
import { BounceAvatar, SidebarNav, GameInstructions } from '../ui';
import { Header } from '../ui/Header';

interface Props {
  onShowCode?: () => void;
  onProgress?: (data: { sectionIndex: number; totalSections: number }) => void;
  initialSectionIndex?: number;
}

export const DevOpsLoopDemo: React.FC<Props> = ({ onShowCode, onProgress, initialSectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const [completionProgress, setCompletionProgress] = useState(0);
  const [pipelineStage, setPipelineStage] = useState(0);
  const stages = ['Code', 'Build', 'Test', 'Deploy'];
  const [showPageMadeModal, setShowPageMadeModal] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const sections = [
    { id: 'section-1', label: 'DevOps' },
    { id: 'section-2', label: 'CI/CD' },
    { id: 'section-3', label: 'Pipeline Demo' },
    { id: 'section-4', label: 'Practices' },
    { id: 'section-5', label: 'Tools' },
    { id: 'section-6', label: 'Culture' },
  ];



  useEffect(() => {
    // Handle initial resume scroll
    if (initialSectionIndex !== undefined && !initialScrollDone && sections.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(sections[initialSectionIndex]?.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setInitialScrollDone(true);
        }
      }, 500);
    }

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      const progress = Math.min(100, (scrollTop / totalScroll) * 100);
      setScrollProgress(progress);
      const sectionCount = sections.length;

      let activeSection = 0;
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top < containerRect.top + containerRect.height / 2) {
            activeSection = i;
          } else {
            break;
          }
        }
      }

      setCurrentSection(activeSection);
      setCompletionProgress(Math.max(0, Math.min(1, (progress - 90) / 10)));

      if (onProgress) {
        onProgress({ sectionIndex: activeSection, totalSections: sections.length });
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [onProgress, initialSectionIndex, initialScrollDone]);



  const runPipeline = () => {
    setPipelineStage(0);
    const interval = setInterval(() => {
      setPipelineStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950">


      {/* Header Component */}
      <Header
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        onShowCode={onShowCode || (() => { })}
      />

      <SidebarNav
        sections={sections}
        activeIndex={currentSection}
        onNavigate={(idx) => {
          const element = document.getElementById(sections[idx].id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        progressHeight={scrollProgress}
        accentColor="emerald"
        isVisible={true}
      />

      {/* Page Architecture Modal */}
      {showPageMadeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(52,211,153,0.3)]">
            <div className="sticky top-0 bg-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">How This Page Was Made</h3>
                <p className="text-emerald-400 text-xs font-mono mt-1">L15 — DevOps Loop</p>
              </div>
              <button onClick={() => setShowPageMadeModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><span className="text-xl">🏗️</span> Page Architecture</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">This page covers DevOps with 6 sections including an interactive CI/CD pipeline demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 1: DevOps</p><p className="text-slate-400 text-xs">What is DevOps culture</p></div>
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 2: CI/CD</p><p className="text-slate-400 text-xs">Continuous integration and delivery</p></div>
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 3: Pipeline Demo</p><p className="text-slate-400 text-xs">Interactive pipeline simulation</p></div>
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 4: Practices</p><p className="text-slate-400 text-xs">IaC, monitoring, testing, feature flags</p></div>
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 5: Tools</p><p className="text-slate-400 text-xs">Jenkins, Terraform, Kubernetes</p></div>
                  <div className="bg-slate-800/40 border border-emerald-900/30 rounded-lg p-3"><p className="text-emerald-300 font-mono text-xs font-bold mb-1">Section 6: Culture</p><p className="text-slate-400 text-xs">Collaboration, automation, metrics</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-950/30 to-green-950/30 border border-emerald-900/50 rounded-lg p-4">
                <p className="text-emerald-400 font-semibold mb-2">You Now Know</p>
                <p className="text-slate-300 text-sm">How <span className="text-emerald-400 font-semibold">DevOps practices</span> enable rapid, reliable software delivery.</p>
                <button onClick={() => setShowPageMadeModal(false)} className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors">Ready to Learn</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gear Icon Button */}
      <button
        onClick={() => setShowPageMadeModal(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(52,211,153,0.8)] transition-all animate-bounce"
        title="How this page was made"
      >
        <span className="text-xl sm:text-2xl">⚙️</span>
      </button>



      <div ref={scrollContainerRef} className="pt-32 pb-20 h-screen overflow-y-auto custom-scrollbar">
        <section id="section-1" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-6">What is DevOps?</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                DevOps merges development and operations. It's a culture, practices, and tools that increase an organization's ability to deliver applications rapidly.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Continuous Integration, Continuous Delivery, automation, monitoring—all part of the loop.
              </p>
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-emerald-200">
                  <strong>Mental Model:</strong> DevOps is like an assembly line—each stage automated, fast feedback, continuous improvement.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border-2 border-emerald-500/30 rounded-xl bg-slate-800/50 backdrop-blur">
                  <RefreshCw className="w-24 h-24 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-2" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-8 text-center">The CI/CD Pipeline</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Continuous Integration (CI)</p>
                <p className="text-sm text-slate-300">Merge code frequently. Run tests automatically. Catch bugs early. Faster feedback.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Continuous Delivery (CD)</p>
                <p className="text-sm text-slate-300">Automate deployment to staging. Manual production release. Always ready to ship.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Continuous Deployment (CD)</p>
                <p className="text-sm text-slate-300">Fully automated to production. Every commit goes live if tests pass. Netflix, Facebook use this.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-3" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-8 text-center">Interactive: Pipeline</h3>
            <div className="bg-slate-800/50 backdrop-blur border border-emerald-500/30 rounded-xl p-8">
              <button
                onClick={runPipeline}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors mb-8"
              >
                Run Pipeline
              </button>

              <div className="grid grid-cols-4 gap-3">
                {stages.map((stage, idx) => (
                  <div key={stage} className={`p-4 rounded-lg border text-center ${pipelineStage > idx ? 'bg-green-500/20 border-green-500/50' :
                    pipelineStage === idx ? 'bg-emerald-500/20 border-emerald-500 animate-pulse' :
                      'bg-slate-700/50 border-slate-600'
                    }`}>
                    <div className="flex justify-center mb-2">
                      {stage === 'Code' && <Code className={pipelineStage >= idx ? 'text-emerald-400' : 'text-slate-400'} size={20} />}
                      {stage === 'Build' && <Package className={pipelineStage >= idx ? 'text-emerald-400' : 'text-slate-400'} size={20} />}
                      {stage === 'Test' && <TestTube className={pipelineStage >= idx ? 'text-emerald-400' : 'text-slate-400'} size={20} />}
                      {stage === 'Deploy' && <Rocket className={pipelineStage >= idx ? 'text-emerald-400' : 'text-slate-400'} size={20} />}
                    </div>
                    <p className={`text-xs font-bold ${pipelineStage >= idx ? 'text-emerald-300' : 'text-slate-400'}`}>{stage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="section-4" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-8 text-center">Key Practices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Infrastructure as Code</h4>
                <p className="text-sm text-slate-300">Terraform, CloudFormation. Version-controlled. Reproducible. No manual clicks.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Monitoring & Logging</h4>
                <p className="text-sm text-slate-300">Prometheus, Grafana, ELK. Observability. Alerts. Debug production.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Automated Testing</h4>
                <p className="text-sm text-slate-300">Unit, integration, e2e. Run on every commit. Quality gates. Confidence to deploy.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Feature Flags</h4>
                <p className="text-sm text-slate-300">Toggle features without deploy. A/B testing. Gradual rollouts. Quick rollback.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Blue-Green Deploy</h4>
                <p className="text-sm text-slate-300">Two identical environments. Switch traffic instantly. Zero downtime.</p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-emerald-500/30 rounded-xl">
                <h4 className="font-bold text-emerald-300 mb-2">Canary Releases</h4>
                <p className="text-sm text-slate-300">Deploy to small subset. Monitor metrics. Rollout gradually or rollback.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-5" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-8 text-center">Popular Tools</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">CI/CD: Jenkins, GitHub Actions, GitLab CI, CircleCI</p>
                <p className="text-sm text-slate-300">Automate build, test, deploy pipelines.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">IaC: Terraform, Pulumi, Ansible, CloudFormation</p>
                <p className="text-sm text-slate-300">Provision infrastructure via code.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Orchestration: Kubernetes, Docker Swarm, Nomad</p>
                <p className="text-sm text-slate-300">Manage containerized applications at scale.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Monitoring: Prometheus, Datadog, New Relic, Grafana</p>
                <p className="text-sm text-slate-300">Metrics, dashboards, alerts, APM.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="section-6" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-4xl w-full">
            <h3 className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-8 text-center">DevOps Culture</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Break Down Silos</p>
                <p className="text-sm text-slate-300">Devs and ops collaborate. Shared responsibility. "You build it, you run it."</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Automation First</p>
                <p className="text-sm text-slate-300">Automate repetitive tasks. Reduce human error. Focus on value.</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl">
                <p className="font-bold text-emerald-300 mb-2">Measure Everything</p>
                <p className="text-sm text-slate-300">Metrics drive decisions. DORA metrics: deployment frequency, lead time, MTTR, change fail rate.</p>
              </div>
            </div>
          </div>
        </section>
      </div>



      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out; }`}</style>
    </div>
  );
};
