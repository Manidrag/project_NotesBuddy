'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/lib/supabase';
import { generateSummary } from '@/lib/ai';

type Note = Database['public']['Tables']['notes']['Row'];
type InsertNote = Database['public']['Tables']['notes']['Insert'];
type UpdateNote = Database['public']['Tables']['notes']['Update'];

export function useNotes(userId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [summarizing, setSummarizing] = useState<string | null>(null);

  // Fetch notes
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ['notes', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching notes',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });

  // Create note
  const createNote = useMutation({
    mutationFn: async (newNote: Omit<InsertNote, 'user_id'>) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...newNote,
          user_id: userId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error creating note',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast({
        title: 'Note created',
        description: 'Your note has been created successfully',
      });
    },
  });

  // Update note
  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateNote & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error updating note',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast({
        title: 'Note updated',
        description: 'Your note has been updated successfully',
      });
    },
  });

  // Delete note
  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) {
        toast({
          title: 'Error deleting note',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted successfully',
      });
    },
  });

  // Summarize note
  const summarizeNote = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      setSummarizing(id);
      
      try {
        const summary = await generateSummary(content);
        
        const { data, error } = await supabase
          .from('notes')
          .update({ summary, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          toast({
            title: 'Error summarizing note',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }

        return data;
      } finally {
        setSummarizing(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast({
        title: 'Note summarized',
        description: 'Your note has been summarized successfully',
      });
    },
  });

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    summarizeNote,
    summarizing,
  };
}