import React, { useState, useEffect } from 'react';
import { Conversation } from '../../../types.ts';
import { fetchConversations } from '../../../services/api.ts';
import { useUser } from '../../../hooks/useUser.ts';
import ChatSkeleton from '../../skeletons/ChatSkeleton.tsx';
import EmptyState from '../../common/EmptyState.tsx';
import { MessageSquare } from 'lucide-react';
import { formatMessageTime, getOptimizedUrl } from '../../../utils/date.ts';

interface ConversationItemProps {
    conversation: Conversation;
    onClick: () => void;
    currentUserId: string;
}

const ConversationItem: React.FC<ConversationItemProps> = React.memo(({ conversation, onClick, currentUserId }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    return (
        <button onClick={onClick} className="w-full text-left flex items-center gap-4 p-4 hover:bg-neutral-900 rounded-xl transition-colors">
            <img src={getOptimizedUrl(conversation.otherUser.profilePics[0], { width: 56, height: 56 })} alt={conversation.otherUser.name} loading="lazy" className="w-14 h-14 rounded-full object-cover"/>
            <div className="flex-1 overflow-hidden">
                <h3 className="font-bold truncate">{conversation.otherUser.name}</h3>
                <p className="text-sm text-neutral-400 truncate">
                    {lastMessage ? `${lastMessage.senderId === currentUserId ? 'You: ' : ''}${lastMessage.text}` : "Say hello!"}
                </p>
            </div>
            <div className="text-xs text-neutral-500 self-start mt-1">
                {lastMessage ? formatMessageTime(lastMessage.created_at) : ''}
            </div>
        </button>
    );
});

const ChatListScreen: React.FC<{ onConversationSelect: (conversation: Conversation) => void; }> = ({ onConversationSelect }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchConversations(user.id)
        .then(setConversations)
        .catch(err => console.error("Failed to fetch conversations", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="p-4 md:p-6">
        {loading ? (
          <ChatSkeleton />
        ) : conversations.length > 0 && user?.id ? (
          <div className="space-y-2">
            {conversations.map(convo => (
              <ConversationItem 
                key={convo.id} 
                conversation={convo} 
                onClick={() => onConversationSelect(convo)} 
                currentUserId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
                icon={<MessageSquare className="w-16 h-16 text-neutral-600" />}
                title="No Chats Yet"
                message="When you match with someone, your conversation will appear here. Time to get swiping!"
            />
          </div>
        )}
    </div>
  );
};
export default ChatListScreen;