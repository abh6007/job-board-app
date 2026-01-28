import { Navigation } from "@/components/Navigation";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: jobs, isLoading } = useJobs();
  
  const activeJobs = jobs?.filter(j => j.status === 'Active') || [];
  const latestJobs = activeJobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm mb-8">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Find your dream career today</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight font-display sm:text-6xl lg:text-7xl">
              Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Potential</span>
              <br /> With <span className="text-primary">The Job News</span>.
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Your daily source for career opportunities. Browse our curated list of roles, stay informed, and take the next step in your professional journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  Browse All Jobs
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-background">
                  Contact Me
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold font-display mb-2">Latest Opportunities</h2>
              <p className="text-muted-foreground">Fresh roles just added to our board.</p>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" className="hidden sm:flex group text-primary">
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl border bg-card animate-pulse shadow-sm" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
              
              {latestJobs.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                  No active jobs found. Check back later!
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link href="/jobs">
              <Button className="w-full">View All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
