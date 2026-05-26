import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:5000/students';

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', course: '' });
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    fetch(API)
      .then(res => res.json())
      .then(data => setStudents(data));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addStudent() {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Date.now(), ...form }),
    })
      .then(res => res.json())
      .then(() => { fetchStudents(); setForm({ name: '', course: '' }); });
  }

  function deleteStudent(id) {
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(() => fetchStudents());
  }

  function startEdit(student) {
    setEditId(student.id);
    setForm({ name: student.name, course: student.course });
  }

  function updateStudent() {
    fetch(`${API}/${editId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { fetchStudents(); setEditId(null); setForm({ name: '', course: '' }); });
  }

  function viewStudent(id) {
    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(data => setSelected(data));
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Student Management</h1>

      {/* Form */}
      <div style={{ marginBottom: '20px' }}>
        <h2>{editId ? 'Edit Student' : 'Add Student'}</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} style={{ marginLeft: '8px' }} />
        {editId ? (
          <button onClick={updateStudent} style={{ marginLeft: '8px' }}>Update</button>
        ) : (
          <button onClick={addStudent} style={{ marginLeft: '8px' }}>Add</button>
        )}
      </div>

      {/* Student list */}
      <h2>All Students</h2>
      <ul>
        {students.map(s => (
          <li key={s.id} style={{ marginBottom: '8px' }}>
            {s.name} - {s.course}
            <button onClick={() => viewStudent(s.id)} style={{ marginLeft: '8px' }}>View</button>
            <button onClick={() => startEdit(s)} style={{ marginLeft: '8px' }}>Edit</button>
            <button onClick={() => deleteStudent(s.id)} style={{ marginLeft: '8px' }}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Single student detail */}
      {selected && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Student Detail</h2>
          <p><strong>ID:</strong> {selected.id}</p>
          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Course:</strong> {selected.course}</p>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}