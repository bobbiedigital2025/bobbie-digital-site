import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Bot, Check, Code, Lock, Menu, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground font-display font-bold text-xl border-2 border-border neo-shadow">
              BD
            </div>
            <div className="hidden md:block">
              <div className="font-display font-bold text-lg leading-none">Bobbie Digital</div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-wider">AUTOMATION_SYSTEMS</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-sm font-medium">
            <a href="#features" className="hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">Features</a>
            <a href="#pricing" className="hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">Pricing</a>
            <a href="#about" className="hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">About</a>
            <a href="#contact" className="hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">Contact</a>
            <Button variant="default" className="font-bold border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
              Sign In
            </Button>
          </nav>

          <button className="md:hidden p-2 border-2 border-border neo-shadow active:shadow-none transition-all" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-border bg-background p-4 absolute w-full shadow-xl">
            <nav className="flex flex-col gap-4 font-mono text-lg">
              <a href="#features" className="hover:text-primary" onClick={toggleMenu}>Features</a>
              <a href="#pricing" className="hover:text-primary" onClick={toggleMenu}>Pricing</a>
              <a href="#about" className="hover:text-primary" onClick={toggleMenu}>About</a>
              <a href="#contact" className="hover:text-primary" onClick={toggleMenu}>Contact</a>
              <Button className="w-full font-bold border-2 border-border neo-shadow">Sign In</Button>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative border-b-2 border-border overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container relative py-20 md:py-32 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-accent text-accent-foreground px-3 py-1 font-mono text-xs font-bold border-2 border-border neo-shadow rotate-[-2deg]">
                v1.0 PRE-LAUNCH // LIMITED SEATS
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter">
                BUILD <span className="text-primary">AUTOMATION</span> THAT ACTUALLY WORKS.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                BoDiGi by Bobbie Digital helps small businesses automate repetitive work, secure integrations with MCP & A2A, and launch AI-powered tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg font-bold border-2 border-border neo-shadow-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground h-14 px-8">
                  Get Started — Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg font-bold border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white h-14 px-8">
                  Request Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="bg-card border-2 border-border p-4 neo-shadow rotate-1 hover:rotate-0 transition-transform">
                  <div className="font-mono text-xs text-muted-foreground mb-1">LEAD MAGNET</div>
                  <div className="font-bold text-sm">Free eBook: 5 Things They Don't Want You to Know About Small Business Automation</div>
                </div>
                <div className="bg-card border-2 border-border p-4 neo-shadow -rotate-1 hover:rotate-0 transition-transform">
                  <div className="font-mono text-xs text-muted-foreground mb-1">INTEGRATION</div>
                  <div className="font-bold text-sm">MCP + A2A ready connectors for seamless data flow</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 border-4 border-border bg-card neo-shadow-lg overflow-hidden">
                <div className="bg-secondary text-secondary-foreground px-4 py-2 border-b-4 border-border flex items-center gap-2 font-mono text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                  <span className="ml-2">dashboard.exe</span>
                </div>
                <img 
                  src="/images/hero-automation-dashboard.png" 
                  alt="BoDiGi Dashboard Interface" 
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent border-4 border-border neo-shadow z-0 hidden md:block"></div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border-4 border-dashed border-muted-foreground/30 -z-10 hidden md:block"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white border-b-2 border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-display font-black mb-4">WHAT YOU GET</h2>
              <p className="text-xl text-muted-foreground">Everything a modern small business needs to automate operations and convert more customers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-2 border-border neo-shadow hover:translate-y-[-4px] transition-transform duration-300">
                <CardHeader className="border-b-2 border-border bg-secondary/5">
                  <div className="w-12 h-12 bg-primary text-primary-foreground border-2 border-border flex items-center justify-center mb-4 neo-shadow">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-display text-xl">Workflow Builder</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <img src="/images/feature-workflow.png" alt="Workflow Builder" className="w-full h-40 object-cover border-2 border-border mb-4 grayscale hover:grayscale-0 transition-all" />
                  <p className="text-muted-foreground">Drag-and-drop automations powered by MCPinky and BoDiGi connectors. Trigger emails, create tasks, and send analytics automatically.</p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-2 border-border neo-shadow hover:translate-y-[-4px] transition-transform duration-300">
                <CardHeader className="border-b-2 border-border bg-secondary/5">
                  <div className="w-12 h-12 bg-accent text-accent-foreground border-2 border-border flex items-center justify-center mb-4 neo-shadow">
                    <Lock className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-display text-xl">Secure Auth (MCP + A2A)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <img src="/images/feature-security.png" alt="Secure Auth" className="w-full h-40 object-cover border-2 border-border mb-4 grayscale hover:grayscale-0 transition-all" />
                  <p className="text-muted-foreground">Built for modern integrations: Google Sign-in, email auth, and developer-ready MCP + A2A flows.</p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-2 border-border neo-shadow hover:translate-y-[-4px] transition-transform duration-300">
                <CardHeader className="border-b-2 border-border bg-secondary/5">
                  <div className="w-12 h-12 bg-secondary text-secondary-foreground border-2 border-border flex items-center justify-center mb-4 neo-shadow">
                    <Bot className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-display text-xl">AI Assistants</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <img src="/images/feature-ai.png" alt="AI Assistants" className="w-full h-40 object-cover border-2 border-border mb-4 grayscale hover:grayscale-0 transition-all" />
                  <p className="text-muted-foreground">AI agents that write copy, build lead magnets, create automations, and power your customer-facing chatbots.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-secondary text-secondary-foreground border-b-2 border-border relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-display font-black mb-4 text-white">PLANS</h2>
              <p className="text-xl text-gray-400">Pre-launch pricing — choose what fits your business.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Starter Plan */}
              <div className="bg-white text-gray-900 border-2 border-white p-8 neo-shadow hover:scale-105 transition-transform">
                <div className="font-mono text-sm font-bold text-gray-500 mb-2">STARTER</div>
                <div className="text-5xl font-black mb-6">$0<span className="text-lg font-medium text-gray-500">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Up to 3 automations</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Basic AI templates</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Email onboarding</li>
                </ul>
                <Button variant="outline" className="w-full border-2 border-gray-900 font-bold hover:bg-gray-100">Start for Free</Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-primary text-white border-2 border-white p-8 neo-shadow-lg scale-110 relative z-10">
                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 border-l-2 border-b-2 border-white">POPULAR</div>
                <div className="font-mono text-sm font-bold text-indigo-200 mb-2">PRO</div>
                <div className="text-5xl font-black mb-6">$49<span className="text-lg font-medium text-indigo-200">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Up to 25 automations</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Advanced AI templates</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> API Access</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-white" /> Priority support</li>
                </ul>
                <Button className="w-full bg-white text-primary font-bold border-2 border-transparent hover:bg-gray-100 hover:border-white">Start Pro</Button>
              </div>

              {/* Unlimited Plan */}
              <div className="bg-white text-gray-900 border-2 border-white p-8 neo-shadow hover:scale-105 transition-transform">
                <div className="font-mono text-sm font-bold text-gray-500 mb-2">UNLIMITED</div>
                <div className="text-5xl font-black mb-6">$99<span className="text-lg font-medium text-gray-500">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Unlimited automations</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Dedicated onboarding</li>
                  <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> SLA & premium integrations</li>
                </ul>
                <Button variant="outline" className="w-full border-2 border-gray-900 font-bold hover:bg-gray-100">Get Unlimited</Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-accent/10 border-b-2 border-border">
          <div className="container">
            <div className="bg-white border-2 border-border p-8 md:p-12 neo-shadow-lg max-w-4xl mx-auto relative">
              <div className="absolute -top-4 -left-4 bg-primary text-white px-4 py-1 font-mono font-bold border-2 border-border neo-shadow rotate-[-2deg]">
                WHO WE ARE
              </div>
              <h2 className="text-3xl font-display font-bold mb-6">About Bobbie Digital</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Bobbie Digital is the creator of <span className="font-bold text-foreground">BoDiGi™</span>, <span className="font-bold text-foreground">AURA™</span>, and <span className="font-bold text-foreground">BOLTZ™</span> — pre-launch platforms designed to help small businesses automate operations, onboard customers faster, and create revenue-generating AI experiences.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Owned by Bobbie Gray. We specialize in MCP-based memory systems, A2A integrations, and workflow automation that reduces manual work and increases revenue.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="font-bold border-2 border-border neo-shadow bg-primary text-white">Contact Marketing</Button>
                <Button variant="outline" className="font-bold border-2 border-border neo-shadow bg-white">Request a Demo</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-4xl font-display font-black mb-6">GET IN TOUCH</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  For partnerships, demos, and press — email <a href="mailto:marketing-support@bobbiedigital.com" className="text-primary font-bold hover:underline">marketing-support@bobbiedigital.com</a>
                </p>

                <div className="space-y-6">
                  <div className="bg-secondary text-secondary-foreground p-6 border-2 border-border neo-shadow">
                    <h4 className="font-bold font-mono mb-2 flex items-center gap-2"><Code className="h-4 w-4" /> OFFICE</h4>
                    <p className="text-gray-300">Bobbie Jo Gray — Founder<br/>Wheeling, WV</p>
                  </div>
                  
                  <div className="bg-accent/20 p-6 border-2 border-border neo-shadow">
                    <h4 className="font-bold font-mono mb-2">QUICK LINKS</h4>
                    <ul className="space-y-2 font-medium">
                      <li><a href="#features" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">→ Product</a></li>
                      <li><a href="#pricing" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">→ Pricing</a></li>
                      <li><a href="#contact" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">→ Contact</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-border p-8 neo-shadow-lg">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Form submitted (placeholder).'); }}>
                  <div className="space-y-2">
                    <label className="font-bold font-mono text-sm uppercase">Name</label>
                    <Input className="border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary bg-gray-50" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold font-mono text-sm uppercase">Email</label>
                    <Input type="email" className="border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary bg-gray-50" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold font-mono text-sm uppercase">Message</label>
                    <Textarea className="border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary bg-gray-50 min-h-[150px]" placeholder="Tell us about your project" />
                  </div>
                  <Button type="submit" className="w-full font-bold text-lg h-12 border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-white">
                    SEND MESSAGE
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-secondary-foreground border-t-4 border-border py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-mono text-gray-400">
          <div>© {new Date().getFullYear()} Bobbie Digital — All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>BoDiGi™</span>
            <span>AURA™</span>
            <span>BOLTZ™</span>
          </div>
          <div>Built with care — marketing-support@bobbiedigital.com</div>
        </div>
      </footer>
    </div>
  );
}
