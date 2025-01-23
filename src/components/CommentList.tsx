import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profile?: Database['public']['Tables']['profiles']['Row'];
};

interface CommentListProps {
  taskId: string;
}

const CommentList = ({ taskId }: CommentListProps) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
  });

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (!comments?.length) {
    return <div className="text-gray-500">No comments yet</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-gray-900">
              {comment.profile?.name || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </div>
          </div>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;