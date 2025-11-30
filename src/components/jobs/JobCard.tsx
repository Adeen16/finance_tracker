"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, CheckCircle, Phone, MessageCircle } from "lucide-react";
import { Job } from "@/data/mockJobs";

interface JobCardProps {
    job: Job;
    matchReason?: string;
}

export function JobCard({ job, matchReason }: JobCardProps) {
    return (
        <Card className="overflow-hidden border-l-4 border-l-primary transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {job.type}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    <Briefcase className="h-4 w-4" />
                    {job.salary}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {matchReason && (
                    <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 p-2 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        {matchReason}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-0 pb-4">
                <Button className="flex-1 gap-2" size="sm">
                    <Phone className="h-4 w-4" />
                    Call HR
                </Button>
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    WhatsApp
                </Button>
            </CardFooter>
        </Card>
    );
}
