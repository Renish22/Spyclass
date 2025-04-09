import React from 'react';

const Dashboard = () => {
  // Sample data for dashboard metrics
  const recentAlerts = [
    { id: 1, type: 'Cheating Alert', location: 'Exam Hall A', time: '10:23 AM', date: 'Today' },
    { id: 2, type: 'Low Attention', location: 'CSE-B Classroom', time: '9:45 AM', date: 'Today' },
    { id: 3, type: 'Absent Students', location: 'IT-A Classroom', time: '2:15 PM', date: 'Yesterday' },
  ];

  return (
    <div className="p-6 bg-background">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-muted-foreground">Total Students</h3>
            <span className="text-primary text-2xl font-bold">450</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Across 8 classrooms</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-muted-foreground">Today's Attendance</h3>
            <span className="text-primary text-2xl font-bold">85%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">382/450 students present</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-muted-foreground">Distraction Alerts</h3>
            <span className="text-primary text-2xl font-bold">23</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">12 more than yesterday</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-muted-foreground">Exam Cheating Alerts</h3>
            <span className="text-primary text-2xl font-bold">5</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">During today's exams</p>
        </div>
      </div>
      
      {/* Module Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* People Counting Module */}
        <div className="bg-card rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">People Counting</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b pb-2">
              <span>Current Occupancy:</span>
              <span className="font-medium">187 students</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Peak Time Today:</span>
              <span className="font-medium">11:30 AM (210 students)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Average Occupancy:</span>
              <span className="font-medium">165 students</span>
            </div>
            <div className="mt-4">
              <a href="/dashboard/analytics" className="text-primary hover:underline text-sm">View detailed analytics →</a>
            </div>
          </div>
        </div>
        
        {/* Attendance Module */}
        <div className="bg-card rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Attendance Tracking</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b pb-2">
              <span>Classes Tracked Today:</span>
              <span className="font-medium">8/8</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Average Attendance Rate:</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Recognition Success Rate:</span>
              <span className="font-medium">98.5%</span>
            </div>
            <div className="mt-4">
              <a href="/dashboard/users" className="text-primary hover:underline text-sm">View attendance details →</a>
            </div>
          </div>
        </div>
        
        {/* Student Monitoring Module */}
        <div className="bg-card rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Student Monitoring</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b pb-2">
              <span>Current Active Classes:</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Average Attention Rate:</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Distraction Events:</span>
              <span className="font-medium">23 today</span>
            </div>
            <div className="mt-4">
              <a href="/dashboard/reports" className="text-primary hover:underline text-sm">View monitoring details →</a>
            </div>
          </div>
        </div>
        
        {/* Exam Cheating Module */}
        <div className="bg-card rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Exam Cheating Detection</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b pb-2">
              <span>Exams Monitored Today:</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Alerts Generated:</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>False Positive Rate:</span>
              <span className="font-medium">1.2%</span>
            </div>
            <div className="mt-4">
              <a href="/dashboard/settings" className="text-primary hover:underline text-sm">View exam monitoring →</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
  