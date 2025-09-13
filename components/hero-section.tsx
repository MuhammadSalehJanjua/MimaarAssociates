import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Users, Building } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative py-20 lg:py-32 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Building Dreams,
                <span className="text-secondary"> Creating Futures</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Professional construction, real estate consulting, and architectural design services in Islamabad. Your
                trusted partner for quality building solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Building className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/modern-construction-site-with-cranes-and-buildings.jpg"
                alt="Construction site in Islamabad"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
              <div className="text-sm text-muted-foreground">Located in</div>
              <div className="font-semibold text-primary">DHA II, Islamabad</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
