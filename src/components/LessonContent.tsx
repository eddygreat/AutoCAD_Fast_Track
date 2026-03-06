'use client';

import MuxPlayer from '@mux/mux-player-react';

interface LessonContentProps {
    textContent: string | null;
    muxPlaybackId: string | null;
}

export function LessonContent({ textContent, muxPlaybackId }: LessonContentProps) {
    // Check if it's a Google Drive link
    const isGoogleDrive = muxPlaybackId && muxPlaybackId.includes('drive.google.com');

    // If it's a Google Drive link, extract the file ID to use the preview URL
    let googleDriveUrl = muxPlaybackId;
    if (isGoogleDrive && muxPlaybackId) {
        // usually format is https://drive.google.com/file/d/FILE_ID/view
        const match = muxPlaybackId.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            googleDriveUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
        } else if (muxPlaybackId.includes('/view')) {
            googleDriveUrl = muxPlaybackId.replace('/view', '/preview');
        }
    }

    // If a full Mux URL is pasted, extract just the playback ID
    let finalPlaybackId = muxPlaybackId;
    if (!isGoogleDrive && muxPlaybackId && muxPlaybackId.includes('stream.mux.com/')) {
        const match = muxPlaybackId.match(/stream\.mux\.com\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            finalPlaybackId = match[1];
        }
    }

    // Utility to render links in plain text
    const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1">
                        Click here to access the content
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="space-y-8 mb-12">
            {/* Video Player */}
            {isGoogleDrive ? (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 bg-black aspect-video flex items-center justify-center">
                    <iframe
                        src={googleDriveUrl || ''}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                    />
                </div>
            ) : finalPlaybackId ? (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 bg-black aspect-video flex items-center justify-center">
                    <MuxPlayer
                        streamType="on-demand"
                        playbackId={finalPlaybackId}
                        metadata={{ video_title: 'CAD Fast Track Lesson' }}
                        className="w-full h-full"
                    />
                </div>
            ) : (
                <div className="rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 aspect-video flex items-center justify-center">
                    <p className="text-zinc-500 font-medium">No video provided for this lesson.</p>
                </div>
            )}

            {/* Text Content */}
            {textContent && (
                <div className="prose prose-zinc dark:prose-invert max-w-none bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    {/* We use whitespace-pre-wrap to respect simple line breaks if provided as a raw string */}
                    <p className="whitespace-pre-wrap leading-relaxed text-lg">{renderTextWithLinks(textContent)}</p>
                </div>
            )}
        </div>
    );
}
