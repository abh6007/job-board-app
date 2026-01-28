import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStats } from "@/hooks/use-admin";
import { useJobs, useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import { useSocialLinks, useCreateSocialLink, useDeleteSocialLink, useAutomationLinks, useCreateAutomationLink, useDeleteAutomationLink, useAboutMe, useUpdateAboutMe } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Briefcase, Eye, MousePointerClick, Activity, Plus, Trash2, Edit, Save, Link as LinkIcon, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { insertJobSchema, insertSocialLinkSchema, insertAutomationLinkSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      setLocation("/login");
      toast({
        title: "Access Denied",
        description: "You need admin privileges to view this page.",
        variant: "destructive"
      });
    }
  }, [user, authLoading, setLocation, toast]);

  if (authLoading || !user?.isAdmin) {
    return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="stats" className="space-y-8">
          <TabsList className="bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Jobs</TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Content & Config</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function DashboardStats() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <div className="animate-pulse h-96 bg-secondary/30 rounded-xl" />;
  if (!stats) return <div>Failed to load stats</div>;

  const cards = [
    { label: "Jobs Posted", value: stats.jobsPosted, icon: Briefcase, color: "text-blue-500" },
    { label: "Active Jobs", value: stats.jobsActive, icon: Activity, color: "text-green-500" },
    { label: "Inactive Jobs", value: stats.jobsInactive, icon: Eye, color: "text-gray-500" },
  ];

  const clickData = stats.mostClickedJobs.map(j => ({ name: j.title.substring(0, 15) + '...', value: j.clickCount }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Most Clicked Jobs</CardTitle>
            <CardDescription>Top performing listings by user engagement</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clickData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {clickData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.5 + (index / clickData.length) * 0.5})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Most Searched</CardTitle>
            <CardDescription>Popular job queries (View counts)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.mostSearchedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-xs text-muted-foreground">{job.location}</span>
                  </div>
                  <Badge variant="secondary">{job.searchCount || 0} views</Badge>
                </div>
              ))}
              {stats.mostSearchedJobs.length === 0 && <div className="text-muted-foreground text-center py-8">No search data yet</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JobsManager() {
  const { data: jobs, isLoading } = useJobs();
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "Full-time",
      status: "Active",
    }
  });

  const onSubmit = (data: any) => {
    if (editingJob) {
      updateJob({ id: editingJob.id, ...data }, {
        onSuccess: () => {
          toast({ title: "Success", description: "Job updated successfully" });
          setOpen(false);
          setEditingJob(null);
          form.reset();
        }
      });
    } else {
      createJob({ ...data, status: "Active" }, {
        onSuccess: () => {
          toast({ title: "Success", description: "Job created successfully" });
          setOpen(false);
          form.reset();
        }
      });
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    form.reset({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      status: job.status,
    });
    setOpen(true);
  };

  const handleCreate = () => {
    setEditingJob(null);
    form.reset({
      title: "",
      description: "",
      location: "",
      type: "Full-time",
      status: "Active",
    });
    setOpen(true);
  };

  const handleToggleStatus = (job: any) => {
    const newStatus = job.status === "Active" ? "Inactive" : "Active";
    updateJob({ id: job.id, status: newStatus }, {
      onSuccess: () => {
        toast({ title: "Status Updated", description: `Job is now ${newStatus}` });
      }
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>Manage your job posts here</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2 shadow-md">
              <Plus className="h-4 w-4" /> Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Create New Job"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {editingJob && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea className="h-32" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-xs text-muted-foreground">New jobs are created as 'Active' by default.</FormLabel>
                  </div>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating ? "Saving..." : "Save Job"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-secondary/30 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {jobs?.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Select 
                      defaultValue={job.status} 
                      onValueChange={(value) => updateJob({ id: job.id, status: value })}
                    >
                      <SelectTrigger className="w-[110px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Hidden">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </div>
              </div>
            ))}
            {jobs?.length === 0 && <div className="text-center py-8 text-muted-foreground">No jobs created yet.</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContentManager() {
  const { data: aboutMe } = useAboutMe();
  const { mutate: updateAboutMe, isPending: updatingAbout } = useUpdateAboutMe();
  const { data: socialLinks } = useSocialLinks();
  const { mutate: createSocialLink } = useCreateSocialLink();
  const { mutate: deleteSocialLink } = useDeleteSocialLink();
  const { data: autoLinks } = useAutomationLinks();
  const { mutate: createAutoLink } = useCreateAutomationLink();
  const { mutate: deleteAutoLink } = useDeleteAutomationLink();
  
  const [aboutContent, setAboutContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (aboutMe) setAboutContent(aboutMe.content);
  }, [aboutMe]);

  const handleSaveAbout = () => {
    updateAboutMe({ content: aboutContent }, {
      onSuccess: () => toast({ title: "Saved", description: "About Me updated." })
    });
  };

  const socialForm = useForm({
    resolver: zodResolver(insertSocialLinkSchema),
    defaultValues: { platform: "", url: "", isVisible: true }
  });

  const autoForm = useForm({
    resolver: zodResolver(insertAutomationLinkSchema),
    defaultValues: { name: "", url: "", isVisible: true }
  });

  return (
    <div className="space-y-8">
      {/* About Me Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
          <CardDescription>Edit the content displayed on the Contact page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={aboutContent} 
            onChange={(e) => setAboutContent(e.target.value)} 
            className="min-h-[200px]"
            placeholder="Write something about yourself..."
          />
          <Button onClick={handleSaveAbout} disabled={updatingAbout} className="gap-2">
            <Save className="h-4 w-4" /> Save Content
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Publicly visible links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...socialForm}>
              <form onSubmit={socialForm.handleSubmit(data => {
                createSocialLink(data, { onSuccess: () => socialForm.reset() });
              })} className="flex gap-2">
                <Input placeholder="Platform (e.g. LinkedIn)" {...socialForm.register("platform")} />
                <Input placeholder="URL" {...socialForm.register("url")} />
                <Button type="submit" size="icon"><Plus className="h-4 w-4" /></Button>
              </form>
            </Form>

            <div className="space-y-2">
              {socialLinks?.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <LinkIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium truncate">{link.platform}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{link.url}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteSocialLink(link.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {socialLinks?.length === 0 && <p className="text-sm text-muted-foreground text-center">No links added.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Automation Links (Admin Only) */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle>Automation Websites</CardTitle>
            <CardDescription>Private admin resources & tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...autoForm}>
              <form onSubmit={autoForm.handleSubmit(data => {
                createAutoLink(data, { onSuccess: () => autoForm.reset() });
              })} className="flex gap-2">
                <Input placeholder="Tool Name" {...autoForm.register("name")} />
                <Input placeholder="URL" {...autoForm.register("url")} />
                <Button type="submit" size="icon" variant="secondary"><Plus className="h-4 w-4" /></Button>
              </form>
            </Form>

            <div className="space-y-2">
              {autoLinks?.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Settings className="h-4 w-4 flex-shrink-0 text-purple-500" />
                    <span className="font-medium truncate">{link.name}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[150px]">{link.url}</a>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAutoLink(link.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {autoLinks?.length === 0 && <p className="text-sm text-muted-foreground text-center">No automation tools added.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
