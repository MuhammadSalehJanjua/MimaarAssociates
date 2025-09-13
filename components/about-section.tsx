import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

const features = [
  "Licensed and insured professionals",
  "Quality materials and craftsmanship",
  "Timely project completion",
  "Competitive pricing",
  "Customer satisfaction guarantee",
  "Local expertise in Islamabad market",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">Why Choose Mimaar Associates?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience in the construction and real estate industry, we have established ourselves as
                a trusted name in Islamabad. Our commitment to excellence and customer satisfaction sets us apart.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button size="lg">Learn More About Us</Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/professional-construction-team-working-on-a-modern.jpg"
                alt="Professional construction team"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm opacity-90">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
