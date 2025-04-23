'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { generateSummary } from '@/lib/ai';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Note = Database['public']['Tables']['notes']['Row'];

const noteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  summary: z.string().nullable().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  note?: Note;
  onSave: (data: NoteFormData) => Promise<void>;
  isLoading: boolean;
}

export function NoteEditor({ note, onSave, isLoading }: NoteEditorProps) {
  const router = useRouter();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState<'professional' | 'casual' | 'technical' | 'creative'>('professional');
  
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      summary: note?.summary || '',
    },
  });
  
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        summary: note.summary,
      });
    }
  }, [note, form]);
  
  const summarizeMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsSummarizing(true);
      try {
        return await generateSummary(content, summaryStyle);
      } finally {
        setIsSummarizing(false);
      }
    },
    onSuccess: (summary) => {
      form.setValue('summary', summary);
    },
  });
  
  const handleSummarize = () => {
    const content = form.getValues('content');
    if (content.trim().length > 10) {
      summarizeMutation.mutate(content);
    }
  };
  
  const onSubmit = async (data: NoteFormData) => {
    await onSave(data);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{note ? 'Edit Note' : 'Create Note'}</CardTitle>
        <CardDescription>
          {note 
            ? 'Make changes to your note below' 
            : 'Fill in the details to create a new note'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a title for your note" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your note here..." 
                      className="min-h-[200px] resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.getValues('content')?.length > 10 && (
              <div className="flex items-center gap-4 justify-end">
                <Select
                  value={summaryStyle}
                  onValueChange={(value: typeof summaryStyle) => setSummaryStyle(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Summary style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Summarize with AI
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {(form.watch('summary') || isSummarizing) && (
              <>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        AI Summary
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={isSummarizing ? "Generating summary..." : "Summary will appear here"}
                          className="resize-y h-24"
                          disabled={isSummarizing}
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/notes')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}