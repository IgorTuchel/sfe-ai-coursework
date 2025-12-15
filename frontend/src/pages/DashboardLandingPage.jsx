import { useContext, useEffect, useState } from "react";
import { LuShare, LuShare2 } from "react-icons/lu";
import {
  getCharacters,
  getCharactersAdmin,
} from "../services/getCharactersService";
import CharacterCard from "../components/CharacterCard";
import { makeChat } from "../services/makeChatService";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DashboardLandingPage() {
  const [characters, setCharacters] = useState([]);
  const { user } = useContext(AuthContext);
  const [initialLoading, setInitialLoading] = useState(characters.length === 0);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCharacters() {
      const data =
        user.role === "admin"
          ? await getCharactersAdmin()
          : await getCharacters();
      if (data.success) {
        setCharacters(data.data);
      }
      setInitialLoading(false);
    }
    fetchCharacters();
  }, [setCharacters]);

  const handleChat = async (characterID) => {
    const res = await makeChat(characterID);
    if (res.success) {
      navigate(`/dashboard/chat/${res.data.id}`);
    }
  };

  return (
    <section className="flex flex-col h-full items-center w-full bg-base mt-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        Talk To <span className="text-primary">Historical Legends</span>
      </h1>
      <p className="mb-6 text-sm">
        Choose a character below and start a conversation!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full px-4 max-w-6xl overflow-y-scroll pb-8">
        {user.role === "admin" && (
          <a
            href="/dashboard/characters/create"
            className="card bg-base-600 h-40 shadow-md rounded-2xl overflow-hidden border-2 border-dashed border-base-500/50 hover:shadow-lg transition-all hover:border-primary/60 flex flex-col items-center justify-center gap-2 hover:bg-base-500/50 hover:shadow-primary/20">
            <LuShare2 className="w-10 h-10 text-primary opacity-80" />
            <span className="text-primary font-bold">Create New Character</span>
          </a>
        )}
        {initialLoading ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onChat={handleChat}
              isAdmin={user.role === "admin"}
            />
          ))
        )}
      </div>
    </section>
  );
}
