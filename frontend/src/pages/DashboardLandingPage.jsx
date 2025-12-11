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

export default function DashboardLandingPage() {
  const [characters, setCharacters] = useState([]);
  const { user } = useContext(AuthContext);

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
      console.log(data.data);
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
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onChat={handleChat}
            isAdmin={user.role === "admin"}
          />
        ))}
      </div>
    </section>
  );
}
