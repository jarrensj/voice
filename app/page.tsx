'use client'

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAudioPath(null);

    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok && data.audioUrl) {
        setAudioPath(data.audioUrl);
      } else {
        alert(data.error || `Failed to generate audio (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Generate Audio from Text</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          required
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Audio"}
        </button>
      </form>
      {audioPath && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Generated Audio</h2>
          <audio controls className="w-full">
            <source src={audioPath} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
}
