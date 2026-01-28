import { Navigation } from "@/components/Navigation";
import { useSocialLinks, useAboutMe } from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Github, Linkedin, Twitter, Globe } from "lucide-react";
import { motion } from "framer-motion";

function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github className="h-5 w-5" />;
  if (p.includes("linkedin")) return <Linkedin className="h-5 w-5" />;
  if (p.includes("twitter")) return <Twitter className="h-5 w-5" />;
  if (p.includes("email") || p.includes("mail")) return <Mail className="h-5 w-5" />;
  return <Globe className="h-5 w-5" />;
}

export default function Contact() {
  const { data: socialLinks, isLoading: loadingLinks } = useSocialLinks();
  const { data: aboutMe, isLoading: loadingAbout } = useAboutMe();

  const visibleLinks = socialLinks?.filter(link => link.isVisible) || [];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* About Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold font-display mb-8">About Me</h1>
              <Card className="border-none shadow-xl bg-gradient-to-br from-card to-secondary/20">
                <CardContent className="p-8 md:p-12">
                  {loadingAbout ? (
                    <div className="space-y-4">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                    </div>
                  ) : (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {aboutMe?.content || "Welcome! I haven't added my bio yet."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Social Links Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold font-display mb-8">Let's Connect</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {loadingLinks ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
                  ))
                ) : (
                  visibleLinks.map((link) => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="flex items-center justify-between p-6 rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {getIcon(link.platform)}
                          </div>
                          <span className="font-semibold text-lg">{link.platform}</span>
                        </div>
                        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </a>
                  ))
                )}
                
                {visibleLinks.length === 0 && !loadingLinks && (
                  <div className="col-span-full p-8 text-center text-muted-foreground bg-secondary/30 rounded-xl border border-dashed">
                    No social links added yet.
                  </div>
                )}
              </div>
            </motion.div>
          </section>

        </div>
      </div>
    </div>
  );
}
