import React, { useState, useEffect } from 'react';
import { Plus, Bell, Trash2, Volume2 } from 'lucide-react';
import Calendar from './Calendar.jsx';

const API_URL = 'http://localhost:3000/api/v1';
const NOTIFICATION_SOUNDS = {
  default: '../assets/remainder.mp3',
  bell: '../assets/remainder.mp3',
  chime: '../assets/remainder.mp3',
};

function TasksPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    time: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedSound, setSelectedSound] = useState('default');
  const [audio] = useState(new Audio(NOTIFICATION_SOUNDS.default));

  useEffect(() => {
    fetchTasks();
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, [selectedDate]);

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_URL}/user/gettask?` + new URLSearchParams({
        date: selectedDate.toISOString().split('T')[0]
      }));
      
      const data = await response.json();
      console.log('Fetched tasks:', data); // Debugging log
      if (data && data.tasks) {
        setTasks(data.tasks); // Fix: Access tasks array correctly
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Prevent errors if fetch fails
    }
  }
  
  useEffect(() => {
    const intervals = [];

    tasks.forEach((task) => {
      const interval = setInterval(() => {
        const now = new Date();
        const taskTime = new Date();
        const [hours, minutes] = task.time.split(':');
        taskTime.setHours(parseInt(hours), parseInt(minutes), 0);

        if (now.getHours() === taskTime.getHours() && 
            now.getMinutes() === taskTime.getMinutes() && 
            now.getSeconds() === 0) {
          // Play notification sound
          audio.src = NOTIFICATION_SOUNDS[selectedSound];
          console.log(audio.src)
          audio.play();

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Reminder', {
              body: `Time for task: ${task.title}\n${task.description}`,
            });
          } else {
            alert(`Time for task: ${task.title}\n${task.description}`);
          }
        }
      }, 1000);

      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [tasks, selectedSound, audio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.time) return;

    const task = {
      ...newTask,
      date: selectedDate.toISOString().split('T')[0],
      userId: '123' // Temporary userId, should be replaced with actual auth
    };

    try {
      const response = await fetch(`${API_URL}/user/createtask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      await fetchTasks();
      setNewTask({
        title: '',
        time: '',
        description: '',
        date: selectedDate.toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/user/deletetask/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Memory</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Memory Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="block w-full px-4 py-3 rounded-lg bg-white/50 border-2 border-[#E066FF]/20 focus:border-[#E066FF] focus:ring focus:ring-[#E066FF]/20 transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter memory title"
                />
              </div>
              <div className="relative">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="block w-full px-4 py-3 rounded-lg bg-white/50 border-2 border-[#E066FF]/20 focus:border-[#E066FF] focus:ring focus:ring-[#E066FF]/20 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="block w-full px-4 py-3 rounded-lg bg-white/50 border-2 border-[#E066FF]/20 focus:border-[#E066FF] focus:ring focus:ring-[#E066FF]/20 transition-all duration-200 placeholder-gray-400"
                placeholder="Describe your memory..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Sound
              </label>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(NOTIFICATION_SOUNDS).map((sound) => (
                  <label key={sound} className="relative flex items-center p-4 rounded-lg bg-white/50 border-2 border-[#E066FF]/20 cursor-pointer hover:bg-white/70 transition-all duration-200">
                    <input
                      type="radio"
                      name="sound"
                      value={sound}
                      checked={selectedSound === sound}
                      onChange={(e) => setSelectedSound(e.target.value)}
                      className="form-radio h-4 w-4 text-[#E066FF] focus:ring-[#E066FF]"
                    />
                    <span className="ml-2 capitalize">{sound}</span>
                    <button
                      type="button"
                      onClick={() => {
                        audio.src = NOTIFICATION_SOUNDS[sound];
                        audio.play();
                      }}
                      className="ml-auto text-gray-400 hover:text-[#E066FF] transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] hover:from-[#D455FF] hover:to-[#796BFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E066FF] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Memory
            </button>
          </form>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Memories for {selectedDate.toLocaleDateString()}</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No memories recorded for this day</p>
            ) : (
              <div className="space-y-4">
                {tasks
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((task) => (
                    <div
                      key={task._id}
                      className="flex items-start justify-between p-6 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-[#E066FF] mr-3" />
                          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        </div>
                        <p className="mt-2 text-gray-600">{task.description}</p>
                        <p className="mt-2 text-sm font-medium text-[#8A7CFF]">{task.time}</p>
                      </div>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>
    </div>
  );
}

export default TasksPage;