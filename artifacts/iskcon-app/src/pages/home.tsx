import { Link } from "wouter";
import { BookOpen, Users, Heart, Lightbulb, Sun, BookMarked, Home as HomeIcon } from "lucide-react";

const staticPurposes = [
  { id: 1, icon: BookOpen, title: "Propagate spiritual knowledge", shortDescription: "Systematically propagate spiritual knowledge to society at large and educate all people in the techniques of spiritual life." },
  { id: 2, icon: Sun, title: "Propagate the consciousness of Krishna", shortDescription: "Propagate a consciousness of Krishna as revealed in the Bhagavad-gita and Srimad Bhagavatam." },
  { id: 3, icon: Heart, title: "Bring members closer to Krishna", shortDescription: "Bring the members of the Society together with each other and nearer to Krishna, the prime entity." },
  { id: 4, icon: Lightbulb, title: "Teach the system of Bhagavad-gita", shortDescription: "Teach and encourage the Sankirtana movement, congregational chanting of the holy name of God." },
  { id: 5, icon: Users, title: "Bring members together", shortDescription: "Erect for the members, and for society at large, a holy place of transcendental pastimes." },
  { id: 6, icon: BookMarked, title: "Publish and distribute spiritual books", shortDescription: "Bring the members closer together for the purpose of teaching a simpler and more natural way of life." },
  { id: 7, icon: HomeIcon, title: "Build communities", shortDescription: "With a view towards achieving the aforementioned purposes, to publish and distribute periodicals, magazines, and books." }
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background pb-12 overflow-x-hidden">
      <div className="bg-primary/10 rounded-b-[2.5rem] px-6 pt-16 pb-14 mb-8 shadow-sm">
        <h1 className="font-serif text-4xl font-bold text-foreground text-center mb-2 tracking-tight">ISKCON</h1>
        <p className="text-center text-primary/80 font-bold text-xs tracking-widest uppercase">The 7 Purposes</p>
      </div>
      
      <div className="px-5 max-w-md mx-auto space-y-4">
        {staticPurposes.map((purpose, i) => {
          const Icon = purpose.icon;
          return (
            <Link 
              key={purpose.id} 
              href={`/purpose/${purpose.id}`}
              className="block bg-card rounded-[1.25rem] p-5 shadow-sm border border-border hover-elevate transition-transform active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/15 p-3.5 rounded-full text-primary shrink-0 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground leading-tight mb-2">
                    <span className="text-primary/70 font-bold mr-1.5">{purpose.id}.</span> 
                    {purpose.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {purpose.shortDescription}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
