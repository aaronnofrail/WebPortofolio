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
    <div className="flex-grow flex flex-col md:flex-row border border-primary bg-surface h-[80vh] overflow-hidden -m-6 md:-m-8">
      {/* Messages Table List */}
      <div className="w-full md:w-2/3 flex flex-col border-r border-primary h-full overflow-hidden">
        {/* Inbox Toolbar */}
        <div className="p-4 border-b border-primary bg-surface-container-low flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0 font-code">
          <div className="flex gap-2">
            <button
              onClick={handleMarkRead}
              disabled={checkedIds.length === 0}
              className="border border-primary px-3 py-1.5 flex items-center gap-2 hover:bg-primary hover:text-on-primary disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-primary transition-colors text-code uppercase font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark Read
            </button>
            <button
              onClick={handleDeleteMessages}
              disabled={checkedIds.length === 0}
              className="border border-primary px-3 py-1.5 flex items-center gap-2 hover:bg-error hover:text-on-error disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-primary transition-colors text-code uppercase font-bold text-error cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </div>
          <div className="text-code text-on-surface-variant uppercase">
            Showing {messages.length} Messages {unreadCount > 0 && `(${unreadCount} Unread)`}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 bg-surface-container-highest border-b border-primary px-4 py-2 font-code text-code font-bold uppercase shrink-0">
          <div className="col-span-1 flex items-center">
            <input
              className="rounded-none border-primary"
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
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {messages.map((msg) => {
            const isSelected = selectedMsgId === msg.id;
            const isChecked = checkedIds.includes(msg.id);
            const isRead = !!msg.read;

            return (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg.id)}
                className={`grid grid-cols-12 border-b border-primary px-4 py-4 font-code text-code cursor-pointer transition-colors ${isSelected
                    ? "bg-primary text-on-primary"
                    : "hover:bg-surface-container-high bg-surface"
                  }`}
              >
                <div
                  className="col-span-1 flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    className={`rounded-none ${isSelected ? "border-white" : "border-primary"}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCheck(msg.id)}
                  />
                </div>
                <div className={`col-span-3 break-all flex items-center ${isSelected ? "text-on-primary" : "text-secondary"}`}>
                  {msg.receivedAt.split(" ")[0]}
                </div>
                <div className={`col-span-3 truncate font-bold pr-2 flex items-center gap-1`}>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-error inline-block shrink-0 animate-pulse" />
                  )}
                  <span className="truncate">{msg.name.split("@")[0]}</span>
                </div>
                <div className={`col-span-5 truncate ${isRead ? "italic" : "font-bold"}`}>
                  {msg.subject || "(No Subject)"}
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="h-64 border-b border-primary/20 opacity-40 flex items-center justify-center font-code text-body-md text-secondary">
              NO_MESSAGES_RECIEVED_YET
            </div>
          )}
        </div>
      </div>

      {/* Detailed Message View */}
      <div className="w-full md:w-1/3 flex flex-col bg-surface-container-low h-full overflow-hidden">
        {selectedMessage ? (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              <div className="border-b border-primary pb-4">
                <h2 className="font-headline-md text-headline-md font-bold text-primary uppercase">
                  Message Details
                </h2>
                <p className="font-code text-code text-on-surface-variant break-all">
                  UID: {selectedMessage.id}
                </p>
              </div>

              <div className="space-y-4 font-code text-code">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-on-surface-variant">FROM:</span>
                  <span className="col-span-2 font-bold break-all">{selectedMessage.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-on-surface-variant">EMAIL:</span>
                  <span className="col-span-2 underline break-all">{selectedMessage.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-on-surface-variant">SUBJECT:</span>
                  <span className="col-span-2 break-words">{selectedMessage.subject || "(No Subject)"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-primary/20 pb-4">
                  <span className="text-on-surface-variant">TIMESTAMP:</span>
                  <span className="col-span-2 opacity-60 break-words">{selectedMessage.receivedAt}</span>
                </div>
              </div>

              <div className="space-y-4 font-code">
                <h3 className="text-code font-bold uppercase bg-primary text-on-primary px-2 py-1 w-fit">
                  Body Content
                </h3>
                <div className="p-4 border border-primary bg-white min-h-[150px] text-code leading-relaxed whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-primary/10 space-y-4 font-code">
                <h3 className="text-code font-bold uppercase">REPLY</h3>
                {replySentStatus === "SENT" ? (
                  <div className="border border-primary bg-secondary-container p-4 text-code text-primary font-bold animate-pulse">
                    &gt; TRANSMISSION ENCRYPTED AND DISPATCHED [OK]
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type reply here..."
                      className="w-full border border-primary p-2 text-code bg-white h-24 outline-none resize-none"
                      disabled={replySentStatus === "SENDING"}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={replySentStatus === "SENDING" || !replyText.trim()}
                        className="flex-1 bg-primary text-on-primary border border-primary py-2 text-code font-bold uppercase hover:bg-surface hover:text-primary transition-all cursor-pointer disabled:opacity-45"
                      >
                        {replySentStatus === "SENDING" ? "ENCRYPTING..." : "DISPATCH REPLY"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSingle(selectedMessage.id)}
                        className="border border-error text-error py-2 px-3 text-code font-bold uppercase hover:bg-error hover:text-on-error transition-all cursor-pointer"
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
          <div className="flex-grow flex items-center justify-center p-8 text-center font-code text-secondary opacity-60">
            NO_MESSAGE_SELECTED
          </div>
        )}
      </div>
    </div>
  );
}
