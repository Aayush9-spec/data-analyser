
"use client";

import type { FormEvent, ChangeEvent } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2, Paperclip, FileText, UploadCloud } from 'lucide-react';
import { useDropzone, type Accept } from 'react-dropzone';
import { askChatbot } from '@/app/actions/chat';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface OtherFilePreview {
  name: string;
  type: string;
}

const acceptedFileTypes: Accept = {
  'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/csv': ['.csv'],
  'text/plain': ['.txt'],
};


export default function ChatInterface({ initialMessages }: { initialMessages?: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [otherFilePreviews, setOtherFilePreviews] = useState<OtherFilePreview[]>([]);

  const processFiles = useCallback((files: File[]) => {
    const newImagePreviews: string[] = [];
    const newOtherFilePreviews: OtherFilePreview[] = [];
    let processedFileCount = 0;

    if (files && files.length > 0) {
      // Clear previous previews when new files are selected/dropped
      setImagePreviews([]);
      setOtherFilePreviews([]);

      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImagePreviews.push(reader.result as string);
            processedFileCount++;
            if (processedFileCount === files.length) {
              setImagePreviews(prev => [...prev, ...newImagePreviews].slice(0, 5)); // Limit previews
              setOtherFilePreviews(prev => [...prev, ...newOtherFilePreviews].slice(0, 5));
            }
          };
          reader.readAsDataURL(file);
        } else {
          newOtherFilePreviews.push({ name: file.name, type: file.type });
          processedFileCount++;
          if (processedFileCount === files.length) {
            setImagePreviews(prev => [...prev, ...newImagePreviews].slice(0, 5));
            setOtherFilePreviews(prev => [...prev, ...newOtherFilePreviews].slice(0, 5));
          }
        }
      });
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles);
  }, [processFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: acceptedFileTypes,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() && imagePreviews.length === 0 && otherFilePreviews.length === 0) return;

    const userMessageText = inputValue.trim();

    if (userMessageText) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: userMessageText,
        sender: 'user',
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }

    setInputValue('');
    setImagePreviews([]);
    setOtherFilePreviews([]);
    setIsLoading(true);

    try {
      const attachmentsInfo = [];
      if (imagePreviews.length > 0) {
        attachmentsInfo.push(`[${imagePreviews.length} image(s) attached]`);
      }
      if (otherFilePreviews.length > 0) {
         attachmentsInfo.push(`[${otherFilePreviews.length} other file(s) attached: ${otherFilePreviews.map(f => f.name).join(', ')}]`);
      }

      const messageToSendToAI = userMessageText + (attachmentsInfo.length > 0 ? ` ${attachmentsInfo.join(' ')}` : "");

      if (messageToSendToAI.trim()) {
        const aiResponseText = await askChatbot(messageToSendToAI.trim());
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else if (!userMessageText && (imagePreviews.length > 0 || otherFilePreviews.length > 0)) {
         // If only files were attached, prompt for action
         const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I've received the file(s). What would you like to do with them?",
          sender: 'ai',
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background"> {/* Changed height to h-full */}
      <div {...getRootProps()} className="flex-grow relative min-h-0">
        <input {...getInputProps()} />
        <ScrollArea className="h-full p-4 sm:p-6 space-y-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3 mb-4',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[75%] rounded-xl px-4 py-3 text-sm shadow-md',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border'
                )}
              >
                {message.text.split('\\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < message.text.split('\\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length -1]?.sender === 'user' && (
            <div className="flex items-start gap-3 mb-4 justify-start">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarFallback>
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card text-card-foreground border rounded-xl px-4 py-3 text-sm shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </ScrollArea>
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-primary z-10">
            <UploadCloud className="h-12 w-12 text-primary mb-2" />
            <p className="text-lg font-medium text-primary">Drop files here to attach</p>
          </div>
        )}
      </div>

      {(imagePreviews.length > 0 || otherFilePreviews.length > 0) && (
        <div className="p-2 border-t bg-muted/30 flex-shrink-0">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 p-2">
              {imagePreviews.map((src, index) => (
                <div key={`img-${index}`} className="relative h-16 w-16 flex-shrink-0 rounded border bg-background overflow-hidden">
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                  />
                </div>
              ))}
              {otherFilePreviews.map((file, index) => (
                <div key={`file-${index}`} className="h-16 w-auto max-w-xs flex-shrink-0 rounded border bg-background p-2 flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <FileText className="h-6 w-6 mb-1" />
                  <span className="truncate block w-full text-center" title={file.name}>{file.name}</span>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <div className="border-t p-4 bg-muted/30 flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="flex-grow bg-background hover:border-primary focus-visible:ring-primary focus-visible:border-primary"
            disabled={isLoading}
            data-cursor-interactive="true"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={open}
            disabled={isLoading}
            data-cursor-interactive="true"
            aria-label="Attach files"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach files</span>
          </Button>
          <Button type="submit" disabled={isLoading || (!inputValue.trim() && imagePreviews.length === 0 && otherFilePreviews.length === 0)} size="icon" data-cursor-interactive="true">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

