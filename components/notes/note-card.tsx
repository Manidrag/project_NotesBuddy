'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/supabase';
import { Sparkles, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type Note = Database['public']['Tables']['notes']['Row'];

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onSummarize: (id: string, content: string) => void;
  summarizing: string | null;
}

export function NoteCard({ note, onDelete, onSummarize, summarizing }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(note.id);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSummarize = () => {
    onSummarize(note.id, note.content);
  };
  
  const getFormattedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  };
  
  const isSummarizing = summarizing === note.id;
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{truncate(note.title, 50)}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/notes/${note.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSummarize} disabled={isSummarizing}>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {getFormattedDate(note.updated_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {truncate(note.content, 150)}
        </p>
        
        {(note.summary || isSummarizing) && (
          <div className={cn("mt-4 p-3 rounded-md bg-secondary", 
            isSummarizing ? "animate-pulse" : ""
          )}>
            <h4 className="text-sm font-medium flex items-center mb-1">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Summary
            </h4>
            {isSummarizing ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {note.summary}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" asChild className="text-sm h-8">
          <Link href={`/notes/${note.id}`}>
            View Note
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}