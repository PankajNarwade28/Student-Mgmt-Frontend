import  { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../../api/axiosInstance";
import { HiOutlinePlusSm, HiOutlineTrash } from "react-icons/hi";

interface Course {
  id: number;
  name: string;
}

const CreateQuizModal = ({
  onClose, 
}: {
  onClose: () => void; 
}) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(30);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");

  const [questions, setQuestions] = useState([
    {
      question_text: "",
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  ]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/api/quiz/teacher");
        setCourses(res.data.data); 
        console.log("Courses for quiz creation:", res.data.data);
      } catch {
        toast.error("Failed to load courses");
      }
    };

    loadCourses();
  }, []);
  // Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ]);
  };

  // Add Option
  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  // Update Question
  const updateQuestion = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].question_text = value;
    setQuestions(updated);
  };

  // Update Option
  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // Select Correct Option
  const selectCorrect = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      is_correct: i === oIndex,
    }));
    setQuestions(updated);
  };

  // 🔥 Submit with validation
  const handleSubmit = async () => {
    if (!title || !selectedCourse) {
      toast.error("Title & Course required");
      return;
    }

    for (const q of questions) {
      if (!q.question_text) {
        toast.error("All questions must have text");
        return;
      }

      const hasCorrect = q.options.some((o) => o.is_correct);
      if (!hasCorrect) {
        toast.error("Each question must have a correct option");
        return;
      }
    }

    try {
      const payload = {
        title,
        description: "",
        course_id: selectedCourse,
        time_limit_minutes: time,
        questions,
      };

      await api.post("/api/quiz/full-create", payload); 
      toast.success("Quiz created ✅");  
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Creation failed ❌");
    }
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length === 1) return; 
    const updated = questions.filter((_, i) => i !== qIndex);
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return; 
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updated);
  };
  return (
  <div className="fixed inset-0 bg-[#0f1717]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-white/20">
      
      {/* Header - Stays fixed */}
      <div className="p-8 pb-4 flex justify-between items-center bg-[#f8fafb]">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00796b]">System Module</span>
          <h2 className="text-2xl font-black text-[#0f1717]">Build Assessment <span className="text-[#00796b]">.</span></h2>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
          <span className="text-xl">✕</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        
        {/* Meta Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Title</label>
            <input
              type="text"
              placeholder="e.g. Unit IV: Angular JS"
              className="w-full bg-[#f8fafb] border-2 border-transparent focus:border-[#00796b] focus:bg-white p-4 rounded-2xl text-sm font-semibold outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Duration (min)</label>
            <input
              type="number"
              placeholder="30"
              className="w-full bg-[#f8fafb] border-2 border-transparent focus:border-[#00796b] focus:bg-white p-4 rounded-2xl text-sm font-semibold outline-none transition-all"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
        </section>

        <section className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Course Mapping</label>
          <select
            className="w-full bg-[#f8fafb] border-2 border-transparent focus:border-[#00796b] focus:bg-white p-4 rounded-2xl text-sm font-semibold outline-none transition-all appearance-none cursor-pointer"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">Select Target Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </section>

        <hr className="border-gray-100" />

        {/* Dynamic Questions Pool */}
        <div className="space-y-10">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-[#f8fafb] rounded-[2.5rem] p-8 border border-gray-100 space-y-6 relative group">
              
              {/* Remove Question Button (Top Right) */}
              {questions.length > 1 && (
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute -top-3 -right-3 bg-white text-red-400 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Remove Question"
                >
                  <HiOutlineTrash size={18} />
                </button>
              )}

              <div className="flex items-center gap-4">
                <span className="bg-[#0f1717] text-white text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-lg shadow-lg">
                  {String(qIndex + 1).padStart(2, '0')}
                </span>
                <input
                  type="text"
                  placeholder="Enter Question Text..."
                  className="flex-1 bg-transparent border-b-2 border-gray-200 focus:border-[#00796b] py-2 text-sm font-bold outline-none transition-all"
                  value={q.question_text}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                />
              </div>

              {/* Options Section */}
              <div className="grid gap-3 pl-12">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex gap-3 items-center group/option">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      className="w-4 h-4 accent-[#00796b]"
                      checked={opt.is_correct}
                      onChange={() => selectCorrect(qIndex, oIndex)}
                    />
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 bg-white p-3 rounded-xl border border-gray-100 text-xs font-semibold focus:border-[#00796b] outline-none shadow-sm"
                      value={opt.text}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    />
                    
                    {/* Remove Option Button */}
                    {q.options.length > 2 && (
                      <button 
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addOption(qIndex)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00796b] hover:opacity-70 mt-2"
                >
                  <HiOutlinePlusSm size={16} /> Add Choice
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addQuestion} 
          className="w-full py-6 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#00796b] hover:text-[#00796b] hover:bg-[#00796b]/5 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
        >
          Append New Question Module
        </button>
      </div>

      {/* Footer - Stays fixed */}
      <div className="p-8 bg-white border-t border-gray-100 flex justify-end gap-4">
        <button onClick={onClose} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
          Discard Changes
        </button>
        <button
          onClick={handleSubmit}
          className="px-10 py-4 bg-[#00796b] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#004d40] shadow-xl shadow-[#00796b]/20 transition-all active:scale-95"
        >
          Confirm & Publish
        </button>
      </div>
    </div>
  </div>
);
};

export default CreateQuizModal;
