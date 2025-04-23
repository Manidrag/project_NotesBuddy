'use client';

import { useAuth } from '@/providers/auth-provider';
import { useNotes } from '@/hooks/useNotes';
import { NoteList } from '@/components/notes/note-list';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const {
    notes,
    isLoading: notesLoading,
    deleteNote,
    summarizeNote,
    summarizing,
  } = useNotes(user?.id);
  
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
  
  const handleDelete = async (id: string) => {
    await deleteNote.mutateAsync(id);
  };
  
  const handleSummarize = async (id: string, content: string) => {
    await summarizeNote.mutateAsync({ id, content });
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <NoteList
        notes={notes}
        isLoading={notesLoading}
        onDelete={handleDelete}
        onSummarize={handleSummarize}
        summarizing={summarizing}
      />
    </div>
  );
}