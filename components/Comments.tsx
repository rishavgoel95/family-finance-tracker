import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function Comments() {
  const { trackerId } = useActiveTracker();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    if (!trackerId) return;

    const res = await fetch(`/api/comments?trackerId=${trackerId}`);
    const data = await res.json();
    if (res.ok) setComments(data);
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [trackerId]);

  const postComment = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!newComment.trim() || !user) return;

    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackerId,
        userId: user.id,
        message: newComment,
      }),
    });

    setNewComment('');
    fetchComments();
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md my-4">
      <h2 className="font-bold mb-2">💬 Comments</h2>
      <div className="h-48 overflow-auto mb-2 bg-white p-2 rounded">
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <strong>{comment.users.display_name}:</strong> {comment.message}
            <small className="block text-gray-400">{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full rounded"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={postComment} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
        Send
      </button>
    </div>
  );
}
