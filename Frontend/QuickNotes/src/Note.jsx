

const Note = ({ note, onDelete, onEdit }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note._id)}>Delete</button>
      <button onClick={() => onEdit(note)}>Edit</button>
    </div>
  );
};