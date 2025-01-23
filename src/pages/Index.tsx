import TaskBoard from "@/components/TaskBoard";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskBoard />
      </div>
    </div>
  );
};

export default Index;