export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "freelance"
  imageUrl: string
  description: string
  aboutUs: string
  requirements: string[]
  applicationEmail: string
}

export const jobs: Job[] = [
  {
    id: "photographer-event",
    title: "Photographer (F/D/M)",
    department: "for Eventphotography",
    location: "Germany, Europe, Worldwide",
    type: "freelance",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G0ijdf8DUeOPYhBC59u8zf35S3xYP4.png",
    description: "Apply now as a freelance photographer at Sportograf.",
    aboutUs:
      "Sportograf is an expert in shooting athletes at sporting events in Germany, Europe and worldwide for more than 15 years. Work with us on a flexible basis on your free weekends and experience exciting events first hand! With fair daily rates and fast money transfers, we are a reliable partner for hundreds of photographers in your day job or part-time job.",
    requirements: [
      "a high level of motivation and enjoyment in photography.",
      "fun in working outdoors, in all weathers.",
      "the ability to work in a team and if possible experience in sports photography.",
      "an up to date camera equipment with wide angle and telephoto lens and at least 2-3 batteries for your camera.",
    ],
    applicationEmail: "jobs@sportograf.com",
  },
  {
    id: "video-producer",
    title: "Video Producer (F/D/M)",
    department: "for Event Coverage",
    location: "Germany, Europe",
    type: "freelance",
    imageUrl: "/placeholder.svg?height=200&width=300",
    description: "Join our team as a freelance video producer for sporting events.",
    aboutUs:
      "We are looking for talented video producers to capture the excitement and energy of sporting events. You'll work with cutting-edge equipment and be part of a dynamic team that covers major sporting events across Europe.",
    requirements: [
      "experience in video production and editing.",
      "knowledge of professional video equipment.",
      "ability to work under pressure in fast-paced environments.",
      "own professional video equipment preferred.",
    ],
    applicationEmail: "video@sportograf.com",
  },
  {
    id: "social-media-manager",
    title: "Social Media Manager (F/D/M)",
    department: "for Marketing",
    location: "Aachen, Germany",
    type: "full-time",
    imageUrl: "/placeholder.svg?height=200&width=300",
    description: "Manage our social media presence and engage with our community.",
    aboutUs:
      "We're seeking a creative and strategic Social Media Manager to join our marketing team. You'll be responsible for developing and executing social media strategies that showcase our photography work and engage with athletes and sports enthusiasts worldwide.",
    requirements: [
      "proven experience in social media management.",
      "excellent written and verbal communication skills.",
      "knowledge of social media analytics and tools.",
      "passion for sports and photography.",
    ],
    applicationEmail: "marketing@sportograf.com",
  },
]

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id)
}
