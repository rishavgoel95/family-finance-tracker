import { useState, useEffect, useRef } from 'react';
import { useActiveTracker } from '../lib/useActiveTracker';
import { supabase } from '../lib/supabase';

export default function Comments() {
  const { trackerId } = useActiveTracker();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackerId) return;

    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('id, message, user_id, created_at')
        .eq('profile_id', trackerId)
        .order('created_at', { ascending: true });

      setComments(data || []);
    };

    fetchComments();
  }, [trackerId]);

  const handleSend = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId || !message.trim()) return;

    const { error } = await supabase.from('comments').insert({
      profile_id: trackerId,
      user_id: user.id,
      message,
    });

    if (!error) {
      setMessage('');
      const updated = await supabase
        .from('comments')
        .select('id, message, user_id, created_at')
        .eq('profile_id', trackerId)
        .order('created_at', { ascending: true });
      setComments(updated.data || []);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
      <h3>💬 Team Notes</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        {comments.map((c) => (
          <div key={c.id} style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#888' }}>{new Date(c.created_at).toLocaleString()}</div>
            <div>{c.message}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={message}
          placeholder="Write a comment..."
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '0.5rem', width: '80%' }}
        />
        <button onClick={handleSend} style={{ marginLeft: '0.5rem' }}>
          Send
        </button>
      </div>
    </div>
  );
}
