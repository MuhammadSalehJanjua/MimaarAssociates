import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Luxury Residential Complex",
    category: "Residential Development",
    image: "/luxury-residential-complex-with-modern-architectur.jpg",
    description: "Modern residential complex with premium amenities in DHA Phase II",
  },
  {
    title: "Commercial Plaza",
    category: "Commercial Construction",
    image: "/modern-commercial-plaza-building-with-glass-facade.jpg",
    description: "State-of-the-art commercial plaza with retail and office spaces",
  },
  {
    title: "Villa Renovation",
    category: "Renovation Project",
    image: "/renovated-luxury-villa-with-modern-interior-design.jpg",
    description: "Complete renovation of luxury villa with contemporary design",
  },
  {
    title: "Office Interior Design",
    category: "Interior Design",
    image: "/modern-office-interior-with-elegant-furniture-and-.jpg",
    description: "Professional office space design with modern furnishing",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Our Recent Projects</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Showcasing our expertise through successful construction and design projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="text-sm text-secondary font-medium">{project.category}</div>
                  <h3 className="text-xl font-semibold text-balance">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  <Button variant="ghost" className="group/btn p-0 h-auto">
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
