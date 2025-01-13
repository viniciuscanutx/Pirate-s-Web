import React, { useState, useEffect } from "react";
import { ref, onValue, push } from "firebase/database";
import { db } from "@/config/firebaseConfig";
import { getAuth } from "firebase/auth";

const Comments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email || "Usuário Anônimo",
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!movieId) return;

    const commentsRef = ref(db, `comments/${movieId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedComments = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setComments(formattedComments);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [movieId]);

  const handleAddComment = () => {
    setError("");
    if (!user) {
      setError("Você precisa estar logado para comentar.");
      return;
    }

    if (!newComment.trim()) {
      setError("O comentário não pode estar vazio.");
      return;
    }

    const commentsRef = ref(db, `comments/${movieId}`);
    const commentData = {
      content: newComment,
      createdAt: new Date().toISOString(),
      author: user.name,
      email: user.email,
    };

    push(commentsRef, commentData);
    setNewComment("");
  };

  return (
    <div className="mt-32">
      <h3 className="text-2xl font-bold">Comentários</h3>
      <div className="mt-5">
        <textarea
          className="w-full p-3 mb-5 bg-black text-white rounded border border-gray-300 resize-none"
          rows="3"
          placeholder="Escreva seu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-stone-900 p-4 rounded">
                <p className="text-white">{comment.content}</p>
                <p className="text-sm text-gray-400 mt-2 mb-2">
                  Por {comment.author} em{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          )}
        </div>
        <button
          className="mt-5 bg-yellow-400 hover:bg-yellow-400/90 text-black px-4 py-2 rounded"
          onClick={handleAddComment}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Comments;
