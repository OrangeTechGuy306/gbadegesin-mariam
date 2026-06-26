'use client';

import * as React from 'react';
import { Mail, MailOpen, Trash2, Calendar, User, Search, Inbox, ShieldAlert } from 'lucide-react';
import { markMessageReadAction, deleteMessageAction } from '@/server/actions/message';

interface AdminMessagesManagerProps {
  initialMessages: any[];
}

export function AdminMessagesManager({ initialMessages }: AdminMessagesManagerProps) {
  const [messages, setMessages] = React.useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = React.useState<any | null>(
    initialMessages.length > 0 ? initialMessages[0] : null
  );
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleToggleRead = async (msg: any) => {
    const newReadState = !msg.read;
    const result = await markMessageReadAction(msg._id, newReadState);
    if (result.error) {
      alert(result.error);
    } else {
      // Update state locally
      const updatedMessages = messages.map((m) =>
        m._id === msg._id ? { ...m, read: newReadState } : m
      );
      setMessages(updatedMessages);
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, read: newReadState });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message? This action is irreversible.')) {
      const result = await deleteMessageAction(id);
      if (result.error) {
        alert(result.error);
      } else {
        const updatedMessages = messages.filter((m) => m._id !== id);
        setMessages(updatedMessages);
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(updatedMessages.length > 0 ? updatedMessages[0] : null);
        }
      }
    }
  };

  // Filter & search logic
  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read);
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Messages List Panel */}
      <div className="lg:col-span-5 bg-card border border-border/40 rounded-2xl flex flex-col overflow-hidden shadow-sm h-full">
        {/* Toolbar & Search */}
        <div className="p-4 border-b border-border/40 space-y-3 bg-secondary/10">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border/60 rounded-xl bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            {(['all', 'unread', 'read'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all duration-200 border ${
                  filter === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Message Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/20">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-2">
              <Inbox className="w-8 h-8 text-muted-foreground/45 mx-auto" />
              <p className="text-xs text-muted-foreground font-medium">No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 cursor-pointer hover:bg-secondary/15 transition-all text-xs flex flex-col space-y-1.5 border-l-2 ${
                  selectedMessage?._id === msg._id
                    ? 'bg-secondary/20 border-primary'
                    : msg.read
                    ? 'border-transparent'
                    : 'border-sky-500 bg-sky-500/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold truncate text-foreground ${!msg.read ? 'font-extrabold' : ''}`}>
                    {msg.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className={`text-[11px] text-foreground truncate ${!msg.read ? 'font-bold' : 'text-muted-foreground'}`}>
                  {msg.subject}
                </div>
                <p className="text-muted-foreground/80 line-clamp-1 text-[11px]">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Reader Detail Panel */}
      <div className="lg:col-span-7 bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
        {selectedMessage ? (
          <div className="flex flex-col h-full justify-between">
            {/* Header / Actions */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between bg-secondary/10">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border border-border/40 bg-card text-foreground hover:bg-secondary/30 transition-all"
                >
                  {selectedMessage.read ? (
                    <>
                      <Mail className="w-3.5 h-3.5 text-sky-500" />
                      <span>Mark Unread</span>
                    </>
                  ) : (
                    <>
                      <MailOpen className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Mark Read</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Meta information */}
              <div className="space-y-4 pb-4 border-b border-border/20">
                <h3 className="font-extrabold text-sm text-foreground tracking-tight leading-snug">
                  {selectedMessage.subject}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{selectedMessage.name}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center">
                        <User className="w-3 h-3 mr-1 text-muted-foreground/60" />
                        <span>{selectedMessage.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 flex items-center self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground/50" />
                    <span>
                      {selectedMessage.createdAt
                        ? new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message text */}
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick reply footer info */}
            <div className="p-4 border-t border-border/20 bg-secondary/5 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground">
                To reply to this message, send an email to{' '}
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-bold text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2">
            <Mail className="w-10 h-10 text-muted-foreground/30" />
            <h3 className="text-sm font-bold text-foreground">No Message Selected</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Choose a message from the column list to read details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
