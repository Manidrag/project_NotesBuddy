'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  if (authLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null;
  }
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const createdAt = user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A';
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.user_metadata?.name || user.email)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 flex-1">
              <h2 className="text-2xl font-bold">
                {user.user_metadata?.name || 'Anonymous User'}
              </h2>
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Member since {createdAt}
              </div>
            </div>
            
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your note-taking experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">Default Summary Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Professional</CardTitle>
                  <CardDescription>
                    Concise, business-oriented summaries
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Technical</CardTitle>
                  <CardDescription>
                    Detailed summaries with technical focus
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Casual</CardTitle>
                  <CardDescription>
                    Friendly, conversational summaries
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Creative</CardTitle>
                  <CardDescription>
                    Engaging, narrative-style summaries
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}