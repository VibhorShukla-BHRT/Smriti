import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

function Calendar({ selectedDate, onSelect }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        className="!font-sans"
        classNames={{
          day_selected: "bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] text-white hover:from-[#D455FF] hover:to-[#796BFF]",
          day_today: "font-bold text-[#E066FF]",
        }}
        footer={
          <p className="mt-4 text-sm text-gray-500">
            Selected date: {format(selectedDate, 'PPP')}
          </p>
        }
      />
    </div>
  );
}

export default Calendar;