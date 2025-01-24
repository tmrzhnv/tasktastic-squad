import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profile?: Database['public']['Tables']['profiles']['Row'];
};

interface CommentListProps {
  taskId: string;
}

const CommentList = ({ taskId }: CommentListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      console.log('Deleting comment:', commentId);
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete comment error:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. You can only delete your own comments.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

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
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {comment.profile?.name || 'Unknown User'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteComment(comment.id)}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;