import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import type { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import { useTrackJobClick } from "@/hooks/use-jobs";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { mutate: trackClick } = useTrackJobClick();

  const handleOpen = () => {
    trackClick(job.id);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">
              {job.type}
            </Badge>
            <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
          </div>
          {job.createdAt && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {job.type}
          </div>
        </div>
        
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {job.description}
        </p>

        <Dialog onOpenChange={(open) => open && handleOpen()}>
          <DialogTrigger asChild>
            <Button className="mt-2 w-full sm:w-auto group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20">
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{job.type}</Badge>
                <Badge variant="outline">{job.status}</Badge>
              </div>
              <DialogTitle className="text-2xl font-display">{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" /> {job.location}
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4" /> Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-6 space-y-4 text-sm leading-relaxed text-foreground/80">
              <h4 className="text-lg font-semibold text-foreground">Job Description</h4>
              <div className="whitespace-pre-wrap">{job.description}</div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-lg py-6 shadow-xl shadow-primary/20">
                  Connect to Learn More
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
