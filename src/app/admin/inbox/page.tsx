"use client";

import { useEffect, useState } from "react";
import { mockMessages, InboxMessage } from "@/data/mockData";
import {
  deleteMessageAction,
  markMessageReadAction,
} from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

interface MessagesWithReadState extends InboxMessage {
  read?: boolean;
}

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<MessagesWithReadState[]>([]);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replySentStatus, setReplySentStatus] = useState<"IDLE" | "SENDING" | "SENT">("IDLE");

  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_inbox");
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        setMessages(mockMessages.map(m => ({ ...m, read: true })));
      }
    } else {
      // Initialize with mock messages, marking them as read by default
      const initial = mockMessages.map(m => ({ ...m, read: true }));
      setMessages(initial);
      localStorage.setItem("aaronnofrail_inbox", JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !selectedMsgId) {
      setSelectedMsgId(messages[0].id);
    }
  }, [messages, selectedMsgId]);

  const saveToStorage = (updated: MessagesWithReadState[]) => {
    localStorage.setItem("aaronnofrail_inbox", JSON.stringify(updated));
  };

  const handleSelectMessage = (id: string) => {
    setSelectedMsgId(id);
    // Mark as read immediately when clicked
    markMessageReadAction(id, true);
    const updated = messages.map((msg) => {
      if (msg.id === id) {
        return { ...msg, read: true };
      }
      return msg;
    });
    setMessages(updated);
    saveToStorage(updated);
    setReplyText("");
    setReplySentStatus("IDLE");
  };

  const handleToggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (checkedIds.length === messages.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(messages.map((m) => m.id));
    }
  };

  const handleMarkRead = () => {
    if (checkedIds.length === 0) return;
    checkedIds.forEach((id) => markMessageReadAction(id, true));
    const updated = messages.map((msg) => {
      if (checkedIds.includes(msg.id)) {
        return { ...msg, read: true };
      }
      return msg;
    });
    setMessages(updated);
    saveToStorage(updated);
    addActivityLog(`INBOX: Marked ${checkedIds.length} messages as read`, "info");
    setCheckedIds([]);
  };

  const handleDeleteMessages = () => {
    if (checkedIds.length === 0) return;
    if (!confirm(`CONFIRM_DELETION: Purge ${checkedIds.length} message(s)?`)) return;
    checkedIds.forEach((id) => deleteMessageAction(id));
    const updated = messages.filter((msg) => !checkedIds.includes(msg.id));
    setMessages(updated);
    saveToStorage(updated);
    addActivityLog(`INBOX: Bulk purged ${checkedIds.length} messages`, "error");
    setCheckedIds([]);
    if (selectedMsgId && checkedIds.includes(selectedMsgId)) {
      setSelectedMsgId(updated[0]?.id || null);
    }
  };

  const handleDeleteSingle = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    const deletedMsg = messages.find((m) => m.id === id);
    const senderName = deletedMsg ? deletedMsg.name : id;
    deleteMessageAction(id);
    const updated = messages.filter((msg) => msg.id !== id);
    setMessages(updated);
    saveToStorage(updated);
    addActivityLog(`INBOX: Purged message from '${senderName}'`, "error");
    if (selectedMsgId === id) {
      setSelectedMsgId(updated[0]?.id || null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySentStatus("SENDING");
    setTimeout(() => {
      setReplySentStatus("SENT");
      setReplyText("");
      addActivityLog(`INBOX: Replied to message from '${selectedMessage?.name}'`, "info");
      setTimeout(() => setReplySentStatus("IDLE"), 2500);
    }, 1500);
  };

  const selectedMessage = messages.find((msg) => msg.id === selectedMsgId);
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex-grow flex flex-col md:flex-row border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white h-[75vh] rounded-[2rem] overflow-hidden shadow-neo-lg font-mono">
      {/* Messages Table List */}
      <div className="w-full md:w-2/3 flex flex-col border-r-2 border-black dark:border-neutral-700 h-full overflow-hidden">
        {/* Inbox Toolbar */}
        <div className="p-4 border-b-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0 font-mono">
          <div className="flex gap-2">
            <button
              onClick={handleMarkRead}
              disabled={checkedIds.length === 0}
              className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white px-3 py-1.5 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-current transition-colors text-xs uppercase font-bold cursor-pointer shadow-neo-btn rounded-xl"
            >
              <span className="material-symbols-outlined text-sm font-bold">done_all</span>
              Mark Read
            </button>
            <button
              onClick={handleDeleteMessages}
              disabled={checkedIds.length === 0}
              className="border-2 border-red-500 bg-white dark:bg-neutral-900 text-red-500 px-3 py-1.5 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-red-500 transition-colors text-xs uppercase font-bold cursor-pointer shadow-neo-btn rounded-xl"
            >
              <span className="material-symbols-outlined text-sm font-bold">delete</span>
              Delete
            </button>
          </div>
          <div className="text-xs uppercase font-bold opacity-60">
            Showing {messages.length} Messages {unreadCount > 0 && `(${unreadCount} Unread)`}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 bg-neutral-100 dark:bg-neutral-800 border-b-2 border-black dark:border-neutral-700 px-4 py-2.5 font-mono text-xs font-black uppercase shrink-0">
          <div className="col-span-1 flex items-center">
            <input
              className="rounded border-2 border-black dark:border-neutral-700 cursor-pointer accent-black dark:accent-white w-4 h-4"
              type="checkbox"
              checked={messages.length > 0 && checkedIds.length === messages.length}
              onChange={handleToggleSelectAll}
            />
          </div>
          <div className="col-span-3">Date</div>
          <div className="col-span-3">Sender</div>
          <div className="col-span-5">Subject</div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar bg-white dark:bg-neutral-950">
          {messages.map((msg) => {
            const isSelected = selectedMsgId === msg.id;
            const isChecked = checkedIds.includes(msg.id);
            const isRead = !!msg.read;

            return (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg.id)}
                className={`grid grid-cols-12 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 font-mono text-xs cursor-pointer transition-colors ${isSelected
                    ? "bg-black dark:bg-white text-white dark:text-black font-bold"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40 bg-transparent"
                  }`}
              >
                <div
                  className="col-span-1 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    className={`rounded cursor-pointer accent-black dark:accent-white w-4 h-4 ${isSelected ? "border-white" : "border-neutral-300 dark:border-neutral-600 border-2"}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCheck(msg.id)}
                  />
                </div>
                <div className={`col-span-3 break-all flex items-center ${isSelected ? "text-neutral-300 dark:text-neutral-700" : "text-neutral-500"}`}>
                  {msg.receivedAt.split(" ")[0]}
                </div>
                <div className={`col-span-3 truncate font-bold pr-2 flex items-center gap-1`}>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0 animate-pulse" />
                  )}
                  <span className="truncate">{msg.name.split("@")[0]}</span>
                </div>
                <div className={`col-span-5 truncate ${isRead ? "opacity-60 italic font-normal" : "font-black"}`}>
                  {msg.subject || "(No Subject)"}
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="h-64 opacity-40 flex items-center justify-center font-mono text-sm">
              NO_MESSAGES_RECEIVED_YET
            </div>
          )}
        </div>
      </div>

      {/* Detailed Message View */}
      <div className="w-full md:w-1/3 flex flex-col bg-neutral-50 dark:bg-neutral-900 h-full overflow-hidden">
        {selectedMessage ? (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              <div className="border-b-2 border-black dark:border-neutral-700 pb-4">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Message Details
                </h2>
                <p className="font-mono text-[10px] opacity-50 break-all mt-1">
                  UID: {selectedMessage.id}
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="opacity-60 uppercase font-bold">FROM:</span>
                  <span className="col-span-2 font-black break-all">{selectedMessage.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="opacity-60 uppercase font-bold">EMAIL:</span>
                  <span className="col-span-2 underline break-all font-bold">{selectedMessage.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="opacity-60 uppercase font-bold">SUBJECT:</span>
                  <span className="col-span-2 break-words font-bold">{selectedMessage.subject || "(No Subject)"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <span className="opacity-60 uppercase font-bold">DATE:</span>
                  <span className="col-span-2 opacity-80 break-words">{selectedMessage.receivedAt}</span>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                <h3 className="text-xs font-black uppercase bg-black dark:bg-white text-white dark:text-black px-2.5 py-1 rounded w-fit">
                  Body Content
                </h3>
                <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-950 rounded-2xl min-h-[150px] text-xs leading-relaxed whitespace-pre-wrap break-words text-black dark:text-white">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4 font-mono">
                <h3 className="text-xs font-black uppercase">Send Reply</h3>
                {replySentStatus === "SENT" ? (
                  <div className="border-2 border-black dark:border-neutral-700 bg-green-500/10 dark:bg-green-500/20 p-4 text-xs text-green-600 dark:text-green-400 font-black rounded-2xl animate-pulse">
                    &gt; TRANSMISSION ENCRYPTED AND DISPATCHED [OK]
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type reply here..."
                      className="w-full border-2 border-black dark:border-neutral-700 p-3 text-xs bg-white dark:bg-neutral-950 text-black dark:text-white h-24 outline-none resize-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                      disabled={replySentStatus === "SENDING"}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={replySentStatus === "SENDING" || !replyText.trim()}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent py-2.5 text-xs font-black uppercase rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-45 shadow-neo-btn"
                      >
                        {replySentStatus === "SENDING" ? "ENCRYPTING..." : "DISPATCH REPLY"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSingle(selectedMessage.id)}
                        className="border-2 border-red-500 text-red-500 py-2.5 px-3.5 text-xs font-black uppercase rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer shadow-neo-btn"
                      >
                        PURGE
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-8 text-center font-mono text-xs opacity-50">
            NO_MESSAGE_SELECTED
          </div>
        )}
      </div>
    </div>
  );
}
