import { Navigation } from "@/components/Navigation";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const { data: jobs, isLoading } = useJobs(search);

  // Filter only active jobs for public view
  const activeJobs = jobs?.filter(job => job.status === 'Active') || [];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <div className="bg-secondary/30 border-b">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold font-display mb-6">Explore Opportunities</h1>
          
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by job title..."
              className="pl-12 h-14 text-lg bg-background shadow-lg border-transparent focus:border-primary rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Showing {activeJobs.length} {activeJobs.length === 1 ? 'job' : 'jobs'}</span>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-xl border bg-card animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
            
            {activeJobs.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
