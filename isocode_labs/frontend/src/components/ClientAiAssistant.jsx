// ClientAiAssistant.jsx - Production-Ready Conversational AI Assistant (Aria)
// Features: Floating circular launcher, expandable spacious chat window, live backend grounding, DPDP Act 2023 masking.
import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  RefreshCw,
  ShieldCheck,
  Bot,
  User,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  MessageSquare
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'Show all my shortlisted candidates',
  'Give me the names of shortlisted candidates',
  'Show the top 5 candidates for my requisition',
  'Find candidates with a matching score above 80%',
  'Compare my shortlisted candidates',
  'Which candidates are awaiting my decision?',
  'Show the candidates shortlisted this week'
];

/**
 * Lightweight, robust Markdown block renderer for Chat messages
 * Handles Markdown tables, bold, italics, inline code, and bullet lists
 */
function RenderMarkdownContent({ content, onSelectCandidate }) {
  if (!content) return null;

  // Split into paragraphs / blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="ai-markdown-container">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Markdown Table Check (lines starting and ending with |)
        const lines = trimmed.split('\n').map(l => l.trim());
        const isTable = lines.length >= 2 && lines.every(l => l.startsWith('|') && l.endsWith('|'));

        if (isTable) {
          const headerCells = lines[0].slice(1, -1).split('|').map(c => c.trim());
          // Line 1 is the delimiter | :--- | :--- |
          const dataRows = lines.slice(2).map(row => row.slice(1, -1).split('|').map(c => c.trim()));

          return (
            <div key={idx} className="ai-table-responsive-wrapper">
              <div className="table-scroll-hint">← Swipe table horizontally to see all columns →</div>
              <table className="ai-response-table">
                <thead>
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx}>{renderInlineMarkdown(h, onSelectCandidate)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{renderInlineMarkdown(cell, onSelectCandidate)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 2. Heading 3 / 4 Check
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="ai-msg-heading">
              {renderInlineMarkdown(trimmed.replace(/^###\s+/, ''), onSelectCandidate)}
            </h4>
          );
        }

        // 3. Blockquote Check
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="ai-msg-quote">
              {renderInlineMarkdown(trimmed.replace(/^>\s+/, ''), onSelectCandidate)}
            </blockquote>
          );
        }

        // 4. Bullet List Check
        const bulletLines = lines.filter(l => l.startsWith('• ') || l.startsWith('* ') || l.startsWith('- '));
        if (bulletLines.length > 0 && bulletLines.length === lines.length) {
          return (
            <ul key={idx} className="ai-msg-list">
              {bulletLines.map((li, lIdx) => (
                <li key={lIdx}>
                  {renderInlineMarkdown(li.replace(/^[•*-]\s+/, ''), onSelectCandidate)}
                </li>
              ))}
            </ul>
          );
        }

        // 5. Regular Paragraph
        return (
          <p key={idx} className="ai-msg-paragraph">
            {renderInlineMarkdown(trimmed, onSelectCandidate)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses inline formatting: **bold**, `code`, *italic*, and candidate ID pills
 */
function renderInlineMarkdown(text, onSelectCandidate) {
  if (!text) return text;

  // Regex matching **bold**, `code`, *italic*
  const regex = /(\*\*(.*?)\*\*)|(`(.*?)`)|(\*(.*?)\*)/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      tokens.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      // Code
      const codeVal = match[4];
      const isCandId = codeVal.startsWith('CND-');
      tokens.push(
        <code 
          key={match.index} 
          className={`ai-code-pill ${isCandId ? 'cand-id-pill' : ''}`}
          onClick={() => {
            if (isCandId && onSelectCandidate) {
              onSelectCandidate(codeVal);
            }
          }}
          title={isCandId ? 'Click to inspect candidate dossier' : ''}
        >
          {codeVal}
        </code>
      );
    } else if (match[5]) {
      // Italic
      tokens.push(<em key={match.index}>{match[6]}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

export default function ClientAiAssistant({
  currentReq,
  currentUser,
  onSelectCandidate,
  isOpen,
  onToggle,
  onClose,
  isPhoneSimulator = false,
  isMobile = false
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isChatOpen = isOpen !== undefined ? isOpen : internalOpen;

  const toggleChat = () => {
    if (onToggle) onToggle();
    else setInternalOpen(!internalOpen);
  };

  const closeChat = () => {
    if (onClose) onClose();
    else if (onToggle) onToggle();
    else setInternalOpen(false);
  };

  const [isExpanded, setIsExpanded] = useState(false); // Expanded Long-Space mode
  const [showWelcomeBadge, setShowWelcomeBadge] = useState(true);

  const [messages, setMessages] = useState(() => {
    const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'there';
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        text: `👋 **Hi ${firstName}, I'm Aria!**\n\n` +
          `I am your **TalentPulse Client AI Copilot**, connected live to your **${currentUser?.organization || 'Enterprise Partner'}** candidate records.\n\n` +
          `You can ask me questions about shortlisted profiles, match scores against **${currentReq?.title || 'your open roles'}**, candidate comparisons, or interview progress.\n\n` +
          `*All queries are strictly grounded in live backend database records with DPDP Act 2023 PII masking.*`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        engine: 'Live Database Connected'
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [errorBanner, setErrorBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isChatOpen, isExpanded]);

  // Set initial sync time
  useEffect(() => {
    setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // When chat opens, focus the input
  useEffect(() => {
    if (isChatOpen) {
      setShowWelcomeBadge(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatOpen]);

  const handleSendMessage = async (textToSend = inputValue) => {
    const q = (textToSend || '').trim();
    if (!q || isLoading) return;

    setErrorBanner(null);
    const userMsgId = `msg-user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const clientSession = {
        role: currentUser?.role || 'client',
        email: currentUser?.email || 'client@clientcorp.in',
        name: currentUser?.name || 'Client Hiring Partner',
        organization: currentUser?.organization || 'Tata Consultancy Services / Global Banking Client',
        id: currentUser?.id || 'USR-CLI-205',
        badgeText: currentUser?.badgeText || 'Client Hiring Partner',
        ip: currentUser?.ip || '14.141.112.5 (Client Corporate Gateway)'
      };

      const res = await fetch('/api/client-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          clientSession,
          currentReqId: currentReq?.id || 'REQ-2026-891',
          conversationHistory: messages.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        const assistantMsg = {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          retrievedAt: data.retrievedAt,
          engine: data.engine
        };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.retrievedAt) {
          setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        }
      } else {
        const errorMsg = {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: data.answer || data.error || 'Unable to retrieve records. Please verify client authorization.',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          error: true
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorBanner('Backend connection interrupted. Please ensure server is running.');
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Connection Error**: Could not reach Aria Backend API at \`/api/client-ai/chat\`.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          error: true
        }
      ]);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared. Ask a new question regarding your candidates or requisitions.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorBanner(null);
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. FLOATING CIRCULAR LAUNCHER (Small circle at bottom right) */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`aria-launcher-container ${isPhoneSimulator ? 'in-phone-launcher' : ''}`}
      >
        {/* Welcome Pill Tooltip */}
        {!isChatOpen && showWelcomeBadge && (
          <div 
            className="aria-launcher-pill"
            onClick={toggleChat}
            title="Click to ask Aria about your candidates"
          >
            <Sparkles size={13} className="aria-sparkle-spin" />
            <span>Ask <strong>Aria</strong></span>
            <button 
              className="pill-dismiss" 
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeBadge(false);
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Small Glowing Circle */}
        <button
          id="aria-floating-circle-btn"
          type="button"
          className={`aria-circle-btn ${isChatOpen ? 'is-active' : ''}`}
          onClick={toggleChat}
          title={isChatOpen ? 'Close Aria' : 'Ask Aria – Client AI Assistant'}
          aria-label="Toggle Aria AI Assistant"
        >
          {/* Pulsing online status indicator */}
          <span className="aria-online-dot"></span>

          {/* Animated Icon: Sparkles when closed, Close (X) when open */}
          <div className="aria-circle-icon-wrap">
            {isChatOpen ? (
              <X size={22} className="aria-close-icon" />
            ) : (
              <Sparkles size={24} className="aria-open-icon" />
            )}
          </div>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. EXPANDABLE FLOATING CHAT WINDOW (Spacious Official Panel)  */}
      {/* ------------------------------------------------------------- */}
      {isChatOpen && (
        <div 
          className={`aria-floating-window ${isExpanded ? 'is-expanded-long' : ''} ${isPhoneSimulator ? 'in-phone-window' : ''}`}
        >
          {/* Header */}
          <div className="aria-window-header">
            <div className="aria-header-left">
              <div className="aria-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="aria-title-row">
                  <span className="aria-title-name">Aria</span>
                  <span className="aria-badge-role">Client AI Copilot</span>
                  <span className="aria-live-badge">
                    <span className="pulse-dot"></span>
                    <span className="badge-text-full">Live Connected</span>
                    <span className="badge-text-short">Live</span>
                  </span>
                </div>
                <p className="aria-subtitle">
                  <span className="subtitle-full">Grounded in {currentReq?.clientName || 'Authorized Client'} • DPDP Blinded</span>
                  <span className="subtitle-short">Live Backend • DPDP Blinded</span>
                </p>
              </div>
            </div>

            <div className="aria-header-actions">
              {lastSyncTime && (
                <span className="aria-sync-pill" title="Last backend data sync">
                  <Clock size={11} />
                  <span className="sync-text-full">{lastSyncTime}</span>
                </span>
              )}

              {/* Clear Chat */}
              <button
                type="button"
                className="aria-icon-btn"
                onClick={handleClearChat}
                title="Clear Conversation"
              >
                <Trash2 size={14} />
              </button>

              {/* Expand to Long Space / Restore (Disabled inside phone simulator) */}
              {!isPhoneSimulator && (
                <button
                  type="button"
                  className="aria-icon-btn aria-expand-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore Normal Window' : 'Expand to Long Spacious Panel'}
                >
                  {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                className="aria-icon-btn aria-close-btn"
                onClick={closeChat}
                title="Minimize Aria into circle"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Suggested Question Chips */}
          <div className="aria-chips-scroller">
            <span className="chips-label">Suggested:</span>
            <div className="chips-list">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="aria-question-chip"
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream (Scrollable Conversational Area) */}
          <div className="aria-chat-stream">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`aria-bubble-row ${msg.sender === 'user' ? 'row-user' : 'row-assistant'} ${msg.error ? 'row-error' : ''}`}
              >
                <div className="aria-bubble-avatar">
                  {msg.sender === 'user' ? <User size={13} /> : <Sparkles size={13} />}
                </div>

                <div className="aria-bubble-content">
                  <div className="aria-bubble-header">
                    <span className="aria-sender-name">
                      {msg.sender === 'user' ? (currentUser?.name || 'You') : 'Aria'}
                    </span>
                    <span className="aria-msg-time">{msg.timestamp}</span>
                  </div>

                  <div className="aria-bubble-body">
                    <RenderMarkdownContent 
                      content={msg.text} 
                      onSelectCandidate={onSelectCandidate}
                    />
                  </div>

                  {msg.engine && (
                    <div className="aria-msg-meta">
                      <ShieldCheck size={11} className="meta-shield" />
                      <span>Retrieved via {msg.engine} • DPDP Act 2023 Compliant</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="aria-bubble-row row-assistant row-loading">
                <div className="aria-bubble-avatar">
                  <Sparkles size={13} />
                </div>
                <div className="aria-bubble-content">
                  <div className="ai-typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-label">Aria is querying live backend records...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="ai-chat-error-banner">
              <AlertCircle size={14} />
              <span>{errorBanner}</span>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="aria-chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="aria-chat-input"
              placeholder="Ask Aria about candidates, match scores, comparisons, or interview progress..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              className="aria-send-btn"
              disabled={isLoading || !inputValue.trim()}
              title="Send to Aria"
            >
              <span className="send-btn-full">Ask Aria</span>
              <span className="send-btn-medium">Ask</span>
              <Send size={14} className="send-btn-icon" />
            </button>
          </form>

          {/* Security & Confidentiality Hint */}
          <div className="aria-input-hint">
            <span className="hint-full">🔒 Confidential. Aria automatically blinds personal data under DPDP Act 2023.</span>
            <span className="hint-short">🔒 DPDP Act PII Masked</span>
          </div>
        </div>
      )}
    </>
  );
}
