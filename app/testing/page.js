'use client';

import { useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reasoningEnabled, setReasoningEnabled] = useState(true); // toggle on/off

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          reasoningEnabled: reasoningEnabled
        }),
      });

      const data = await res.json();

      if (data.choices && data.choices[0]) {
        const assistantMsg = data.choices[0].message;
        
        // Important: reasoning_details preserve karo (docs wala logic)
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: assistantMsg.content,
            reasoning_details: assistantMsg.reasoning_details || null
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Qwen3.6 Plus (free) - Next.js Chat</h1>
      <p>Max tokens: 20,000 | Context: 1M</p>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={reasoningEnabled}
            onChange={(e) => setReasoningEnabled(e.target.checked)}
          />
          Reasoning Mode (Step-by-step thinking)
        </label>
      </div>

      <div style={{
        border: '1px solid #ccc',
        height: '60vh',
        overflowY: 'auto',
        padding: '15px',
        marginBottom: '15px',
        background: '#f9f9f9',
        whiteSpace: 'pre-wrap'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Qwen3.6'}:</strong>
            <div>{msg.content}</div>
            
            {/* Reasoning details show karo (agar ho to) */}
            {msg.reasoning_details && msg.reasoning_details.length > 0 && (
              <details style={{ marginTop: '10px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                <summary>🔍 Model ka internal reasoning ({msg.reasoning_details.length} steps)</summary>
                <pre style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(msg.reasoning_details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
        {loading && <p><em>Thinking...</em></p>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '12px', fontSize: '16px' }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <small style={{ display: 'block', marginTop: '20px', color: '#666' }}>
        Docs ke mutabiq reasoning continuation perfectly supported hai.
      </small>
    </div>
  );
}