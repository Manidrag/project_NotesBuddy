'use client';

import { useAuth } from '@/providers/auth-provider';
import { useNotes } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/note-editor';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function EditNotePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string;
  
  const {
    notes,
    isLoading: notesLoading,
    updateNote,
  } = useNotes(user?.id);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const currentNote = useMemo(() => {
    return notes.find((note) => note.id === noteId);
  }, [notes, noteId]);
  
  useEffect(() => {
    if (!notesLoading && !currentNote && !authLoading && user) {
      router.push('/notes');
    }
  }, [currentNote, notesLoading, authLoading, user, router]);
  
  if (authLoading || notesLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !currentNote) {
    return null;
  }
  
  const handleSave = async (data: { title: string; content: string; summary?: string | null }) => {
    await updateNote.mutateAsync({
      id: noteId,
      ...data,
    });
    router.push('/notes');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <NoteEditor 
        note={currentNote}
        onSave={handleSave}
        isLoading={updateNote.isPending}
      />
    </div>
  );
}