'use client';

import { NoteEditor } from '@/components/notes/note-editor';
import { useAuth } from '@/providers/auth-provider';
import { useNotes } from '@/hooks/useNotes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewNotePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const { createNote } = useNotes(user?.id);
  
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
  
  const handleSave = async (data: { title: string; content: string; summary?: string | null }) => {
    await createNote.mutateAsync(data);
    router.push('/notes');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <NoteEditor 
        onSave={handleSave}
        isLoading={createNote.isPending}
      />
    </div>
  );
}