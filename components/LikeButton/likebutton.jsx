import React, { useState, useEffect } from "react";
import { ref, set, remove, onValue } from "firebase/database";
import { db } from "@/config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ movieId }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!movieId || !user) return;

    const likesRef = ref(db, `like/${movieId}/${user.uid}`);
    const unsubscribe = onValue(likesRef, (snapshot) => {
      setLiked(snapshot.exists());
    });

    return () => unsubscribe();
  }, [movieId, user]);

  const handleLike = () => {
    if (!user) {
      alert("Você precisa estar logado para curtir o filme!"); 
      return;
    }

    const likesRef = ref(db, `like/${movieId}/${user.uid}`);

    if (liked) {
      remove(likesRef);
    } else {
      set(likesRef, true);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-5 py-2 rounded-md transition ${
        liked ? "bg-red-600 text-white" : "bg-white text-black"
      }`}
    >
      <FaHeart /> 
    </button>
  );
};

export default LikeButton;
