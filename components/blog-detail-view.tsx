'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Heart, Share2, MessageSquare, Send, CheckCircle2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCommentAction, likeBlogAction } from '@/server/actions/blog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const commentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  text: z.string().min(3, 'Comment must be at least 3 characters'),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface BlogDetailViewProps {
  blog: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    summary: string;
    coverImage: string;
    category: string;
    tags: string[];
    views: number;
    likes: number;
    publishedAt: string;
    comments: Array<{
      _id?: string;
      name: string;
      text: string;
      createdAt: string;
    }>;
  };
}

export function BlogDetailView({ blog }: BlogDetailViewProps) {
  const [likesCount, setLikesCount] = React.useState(blog.likes);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [comments, setComments] = React.useState(blog.comments);
  const [shareSuccess, setShareSuccess] = React.useState(false);
  const [commentSuccess, setCommentSuccess] = React.useState<string | null>(null);
  const [commentError, setCommentError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
  });

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikesCount((prev) => prev + 1);
    await likeBlogAction(blog._id);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = blog.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: blog.summary,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Web Share failed:', err);
      }
    } else {
      // Fallback: Copy to Clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const onSubmitComment = async (values: CommentFormValues) => {
    setCommentError(null);
    setCommentSuccess(null);

    const fd = new FormData();
    fd.append('blogId', blog._id);
    fd.append('name', values.name);
    fd.append('text', values.text);

    const result = await addCommentAction(null, fd);

    if (result.error) {
      setCommentError(result.error);
    } else {
      setCommentSuccess(result.success || 'Comment posted successfully!');
      // Append comment locally for optimistic response
      setComments((prev) => [
        ...prev,
        {
          name: values.name,
          text: values.text,
          createdAt: new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
        },
      ]);
      reset();
      setTimeout(() => setCommentSuccess(null), 3000);
    }
  };

  const getTwitterShareUrl = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    const text = encodeURIComponent(`Check out "${blog.title}" by Gbadegesin Mariam Omowumi: `);
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  };

  const getLinkedInShareUrl = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <Link
            href="/#blog"
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-card border border-border/40 hover:bg-secondary text-foreground transition-all flex items-center space-x-1 text-xs font-semibold shadow-sm"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <AnimatePresence>
              {shareSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded"
                >
                  Link Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Article Container */}
        <article className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-xl glass-card">
          {/* Cover image */}
          <div className="h-48 sm:h-72 w-full relative overflow-hidden bg-muted border-b border-border/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full" />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Metadata headers */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {blog.category}
                </span>
                {blog.tags.map((tag) => (
                  <span key={tag} className="text-[9px] text-muted-foreground font-mono bg-secondary/35 px-1.5 py-0.5 rounded border border-border/10">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground pt-1.5 border-t border-border/10">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                  {blog.publishedAt}
                </span>
                <span className="flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                  {blog.views} Reads
                </span>
                <span className="flex items-center">
                  <Heart className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                  {likesCount} Likes
                </span>
              </div>
            </div>

            {/* Article content (rich text or HTML) */}
            <div
              className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans space-y-4 pt-4 border-t border-border/20 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Social Share Toolbar & Like Button */}
            <div className="flex items-center justify-between pt-6 border-t border-border/20">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    hasLiked
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : 'bg-card text-muted-foreground hover:text-foreground border-border/60 hover:scale-102 active:scale-98'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{hasLiked ? 'Liked' : 'Like Post'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60 hidden sm:inline">
                  Share Article:
                </span>
                <a
                  href={getTwitterShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/20 transition-all"
                  title="Share on Twitter"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a
                  href={getLinkedInShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/20 transition-all"
                  title="Share on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/20 transition-all"
                  title="Copy Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comment Section Panel */}
        <section className="bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 glass-card">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border/20 pb-3">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Comments ({comments.length})</span>
          </h3>

          {/* Comments List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4">No comments posted yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-secondary/20 border border-border/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span className="text-foreground font-bold">{comment.name}</span>
                    <span>{comment.createdAt}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-2">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div className="pt-4 border-t border-border/20 space-y-4">
            <h4 className="text-xs font-bold text-foreground">Post a Comment</h4>
            
            {commentError && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{commentError}</div>}
            {commentSuccess && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{commentSuccess}</div>}

            <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Comment</label>
                <textarea
                  rows={3}
                  {...register('text')}
                  placeholder="Share your feedback or questions..."
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.text && <p className="text-[10px] text-red-500">{errors.text.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
