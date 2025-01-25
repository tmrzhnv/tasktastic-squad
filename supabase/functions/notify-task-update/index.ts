import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  taskId: string;
  type: "ASSIGNMENT" | "STATUS_CHANGE";
  newStatus?: string;
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId, type, newStatus } = await req.json() as NotificationRequest;

    // Fetch task details including assignee profile
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq("id", taskId)
      .single();

    if (taskError) throw taskError;
    if (!task || !task.profile) {
      throw new Error("Task or assignee not found");
    }

    // Check if user has email notifications enabled
    const { data: preferences, error: prefError } = await supabase
      .from("notification_preferences")
      .select("email_notifications")
      .eq("user_id", task.user_id)
      .single();

    if (prefError) throw prefError;
    if (!preferences?.email_notifications) {
      return new Response(
        JSON.stringify({ message: "Email notifications disabled for user" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Prepare email content based on notification type
    let subject = "";
    let content = "";

    if (type === "ASSIGNMENT") {
      subject = "New Task Assignment";
      content = `
        <h2>You have been assigned a new task</h2>
        <p><strong>Task Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
      `;
    } else if (type === "STATUS_CHANGE") {
      subject = "Task Status Updated";
      content = `
        <h2>A task's status has been updated</h2>
        <p><strong>Task Description:</strong> ${task.description}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${new Date(task.deadline).toLocaleDateString()}</p>
      `;
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Task Manager <onboarding@resend.dev>",
        to: [task.profile.email],
        subject,
        html: content,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in notify-task-update function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);