import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2 } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (data) setNotes(data);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;

    const { error } = await supabase.from('notes').insert([{ title, content }]);
    
    if (!error) {
      setTitle('');
      setContent('');
      fetchNotes();
    }
  }

  async function deleteNote(id: string) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) fetchNotes();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Notes</h1>
        
        <form onSubmit={addNote} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-4 p-2 border rounded h-24"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} /> Add Note
          </button>
        </form>

        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;