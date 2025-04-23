'use client';

import { useState } from 'react';
import { Database } from '@/lib/supabase';
import { NoteCard } from '@/components/notes/note-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, SlidersHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

type Note = Database['public']['Tables']['notes']['Row'];

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onSummarize: (id: string, content: string) => Promise<void>;
  summarizing: string | null;
}

export function NoteList({ notes, isLoading, onDelete, onSummarize, summarizing }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.summary && note.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (sortOption === 'oldest') {
      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    }
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
        <Button asChild>
          <Link href="/notes/new">
            <Pencil className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
              <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alphabetical">A-Z</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {sortedNotes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "We couldn't find any notes matching your search."
              : "You haven't created any notes yet."}
          </p>
          <Button asChild>
            <Link href="/notes/new">
              <Pencil className="mr-2 h-4 w-4" />
              Create your first note
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDelete}
              onSummarize={onSummarize}
              summarizing={summarizing}
            />
          ))}
        </div>
      )}
    </div>
  );
}