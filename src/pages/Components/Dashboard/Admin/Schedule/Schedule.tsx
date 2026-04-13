import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  HiOutlineLocationMarker,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";
import { HiOutlineClock } from "react-icons/hi2";
import api from "../../../../../api/axiosInstance";

interface Schedule {
  id: number;
  course_id: number;
  course_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
  class_code: string;
  color_theme?: string;
}

interface CourseOption {
  id: number;
  name: string;
  code: string;
}

const ManageSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [myCourses, setMyCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"Day" | "Week">("Week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    course_id: "",
    room_number: "",
    class_code: "",
  });

  // State for interaction
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fixed Slots Logic for CRUD
  const timeSlots = [
    { start: "09:00", end: "10:00", label: "Slot 1" },
    { start: "10:00", end: "11:00", label: "Slot 2" },
    { start: "11:00", end: "13:00", label: "BREAK", isBreak: true }, // 11-1 Break
    { start: "13:00", end: "14:00", label: "Slot 3" },
    { start: "14:00", end: "15:00", label: "BREAK", isBreak: true }, // 2-3 Break
    { start: "15:00", end: "16:00", label: "Slot 4" },
    { start: "16:00", end: "17:00", label: "Slot 5" },
  ];

  // Logic to calculate the week headers based on selectedDate
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    startOfWeek.setDate(diff);

    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        name: d.toLocaleDateString("en-US", { weekday: "long" }),
        short: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate().toString().padStart(2, "0"),
        fullDate: d,
      };
    });
  };

  const currentWeek = getWeekDays(selectedDate);

  useEffect(() => {
    let isMounted = true;
    const fetchRegistryData = async () => {
      try {
        setLoading(true);
        // Fetches data based on the teacher's profile and current date context [cite: 37, 50]
        const endpoint =
          viewMode === "Day"
            ? `/api/admin/schedule/day/${selectedDate.toISOString()}`
            : `/api/admin/schedule/week?baseDate=${selectedDate.toISOString()}`;

        const response = await api.get(endpoint);
        if (isMounted) setSchedules(response.data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        if (isMounted) toast.error("Failed to synchronize schedule registry.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRegistryData();
    return () => {
      isMounted = false;
    };
  }, [viewMode, selectedDate]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Remove this session from the registry?")) {
      try {
        await api.delete(`/api/admin/schedule/${id}`);
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        toast.success("Registry entry removed.");
      } catch (error) {
        console.error("Deletion error:", error);
        toast.error("Deletion failed.");
      }
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
    );
    setSelectedDate(newDate);
  };

  // Fetch courses assigned to the logged-in teacher
  const fetchMyCourses = async () => {
    try {
      const response = await api.get("/api/admin/courses");
      // Check if data is nested in .data.data or just .data
      const courseData = response.data.data || response.data;
      setMyCourses(Array.isArray(courseData) ? courseData : []);
    } catch (error) {
      console.error("Course Fetch Error:", error);
      toast.error("Could not load your assigned curriculum.");
    }
  };
  // Trigger fetch when the modal opens
  const openAddModal = (slot: { start: string; end: string }) => {
    fetchMyCourses();
    setActiveSlot(slot);
    setIsModalOpen(true);
  };
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_time: activeSlot?.start,
        end_time: activeSlot?.end,
        day_of_week: selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
        }),
      };

      await api.post("/api/admin/schedule", payload);
      toast.success("New instructional slot registered!");
      setIsModalOpen(false);
      // Refresh data
      setSelectedDate(new Date(selectedDate));
    } catch (err) {
      console.error("Add session error:", err);
      toast.error("Failed to register slot (You Cannot Create Sunday Sessions).");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-bold text-slate-400">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 space-y-6 bg-[#f8faff] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Timetable
        </h1>
        <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          {(["Day", "Week"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                viewMode === mode
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN TIMETABLE GRID / DAY SLOTS */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          {viewMode === "Week" ? (
            <>
              <div className="grid grid-cols-6 border-b border-slate-100">
                {currentWeek.map((d) => (
                  <div
                    key={d.name}
                    className={`p-4 text-center border-r border-slate-50 last:border-r-0 ${selectedDate.getDate() === d.fullDate.getDate() ? "bg-indigo-50/50" : ""}`}
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {d.short}
                    </p>
                    <p className="text-xl font-black mt-1 text-slate-800">
                      {d.date}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-6 min-h-[600px] relative">
                {currentWeek.map((d) => (
                  <div
                    key={d.name}
                    className="border-r border-slate-50 last:border-r-0 relative p-2 space-y-3 bg-slate-50/10"
                  >
                    {schedules
                      .filter((s) => s.day_of_week === d.name)
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-white border-l-4 border-indigo-500 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group"
                        >
                          <p className="text-[8px] font-black text-slate-400">
                            {slot.start_time.slice(0, 5)}
                          </p>
                          <h4 className="text-[11px] font-black text-slate-800 mt-1 truncate">
                            {slot.course_name}
                          </h4>
                          <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">
                            {slot.class_code}
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
                Agenda for {selectedDate.toDateString()}
              </h3>
              <div className="space-y-3">
                {timeSlots.map((slot, index) => {
                  const session = schedules.find((s) =>
                    s.start_time.startsWith(slot.start),
                  );
                  if (slot.isBreak)
                    return (
                      <div
                        key={index}
                        className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center"
                      >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                          <HiOutlineClock /> BREAK: {slot.start} - {slot.end}
                        </span>
                      </div>
                    );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all group"
                    >
                      <div className="text-[10px] font-black text-slate-400 w-12">
                        {slot.start}
                      </div>
                      {session ? (
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <p className="font-black text-slate-800 text-sm">
                              {session.course_name}
                            </p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase">
                              {session.class_code}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      ) : (
                        // Updated "Add New Session" button in your timeSlots map:
                        <button
                          onClick={() => openAddModal(slot)}
                          className="flex-1 text-left text-[10px] font-black text-slate-300 hover:text-indigo-500 uppercase tracking-widest flex items-center gap-2"
                        >
                          <HiOutlinePlus /> Add New Session
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBARS: CALENDAR & NEXT CLASS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {selectedDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <HiOutlineChevronLeft />
                </button>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                <span
                  key={day}
                  className="text-[9px] font-black text-slate-300 uppercase"
                >
                  {day}
                </span>
              ))}
              {[...Array(31)].map((_, i) => (
                <span
                  key={i}
                  onClick={() => handleDateClick(i + 1)}
                  className={`text-[10px] font-bold p-2 rounded-lg cursor-pointer transition-all ${selectedDate.getDate() === i + 1 ? "bg-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 space-y-6">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Next class
            </h3>
            <div className="flex items-start gap-4">
              <div className="text-teal-500 font-black text-lg border-l-4 border-teal-500 pl-4">
                12G
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-slate-800 tracking-tight truncate">
                  Trigonometry
                </h4>
                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-widest">
                  <HiOutlineLocationMarker /> Room 312
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  03:00 - 04:00 PM
                </p>
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button className="flex-1 bg-white border-2 border-slate-100 hover:border-indigo-600 text-indigo-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                Call the roll
              </button>
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100">
                View report
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                Initialize Slot
              </h3>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                {selectedDate.toDateString()} • {activeSlot?.start}
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* COURSE SELECTION DROPDOWN */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Select Curriculum
                </label>
                <select
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 appearance-none"
                  onChange={(e) =>
                    setFormData({ ...formData, course_id: e.target.value })
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a course...
                  </option>

                  {myCourses.length > 0 ? (
                    myCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No courses assigned
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                    Room / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 302"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) =>
                      setFormData({ ...formData, room_number: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                    Class Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12G"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) =>
                      setFormData({ ...formData, class_code: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchedule;
