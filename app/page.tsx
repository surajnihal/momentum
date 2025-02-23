"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [content, setContent] = useState("");
  // const [isSignedIn_visible, setisSignedIn_visible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [goal, setGoal] = useState("");
  const [focusArea, setFocusArea] = useState("");

  async function fetchAIResponse() {
    if (!mood || !goal || !focusArea) return alert("Please select all options before proceeding!");

    setLoading(true);
    setAudioUrl(null); // Reset audio when new text is generated

    try {
      const res = await fetch("/api/motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, goal, focusArea }),
      });

      const data = await res.json();
      
      if (!data.content) {
        setContent("⚠️ Oops! Something went wrong. Please try again.");
      } else {
        const formattedContent = data.content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold formatting
          .replace(/\n/g, "<br>"); // Line breaks for readability

        setContent(formattedContent);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setContent("⚠️ Error loading response. Please try again.");
    }

    setLoading(false);
  }

  async function handleListen() {
    if (!content) return;
    
    setAudioLoading(true);
    const res = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    const blob = await res.blob();
    const speechUrl = URL.createObjectURL(blob); // Creates a playable audio link
    if (speechUrl) setAudioUrl(speechUrl);
    setAudioLoading(false);
  }

  function handleListenStop() {
    setAudioUrl(null)
  }

  return (
    <main className="bg-[radial-gradient(circle_at_50%_50%,#f9114d,#f77f4c,#fdf4d3)] min-h-screen text-center px-4 text-black">
      <div className="flex flex-col items-center justify-center">
      <div className="flex m-6 w-full justify-between items-center"> <h1 className="text-2xl font-bold">Momentum</h1>
      <UserButton /></div>
      
      {isSignedIn ? (
        <div  className="flex flex-col justify-center items-center">
          <div>
            <h2 className="text-2xl">hi {user?.firstName}, welcome to your safe space.</h2>
          </div>

          <div className="flex items-center gap-16">
          {/* Mood Selector */}
          <div className="mt-6">
            <label className="block text-lg font-medium">How are you feeling?</label>
            <select className="mt-2 p-2 border rounded" value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Select Mood</option>
              <option value="stressed">😞 Stressed</option>
              <option value="anxious">😰 Anxious</option>
              <option value="unmotivated">😴 Unmotivated</option>
              <option value="distracted">🤯 Distracted</option>
            </select>
          </div>

          {/* Goal Input */}
          <div className="mt-6">
            <label className="block text-lg font-medium">What's your goal today?</label>
            <input
              type="text"
              placeholder="I want to feel more confident..."
              className="mt-2 p-2 border rounded w-80"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          {/* Focus Area Selector */}
          <div className="mt-6">
            <label className="block text-lg font-medium">Choose a Focus Area</label>
            <select className="mt-2 p-2 border rounded" value={focusArea} onChange={(e) => setFocusArea(e.target.value)}>
              <option value="">Select Topic</option>
              <option value="gratitude">💖 Gratitude</option>
              <option value="self-care">🧘 Self-Care</option>
              <option value="productivity">🚀 Productivity</option>
              <option value="letting go">🌿 Letting Go</option>
            </select>
          </div>
          </div>

          <div className="flex items-center gap-6 justify-center mt-6">
          <button onClick={fetchAIResponse} className="btn btn-primary">Generate Guidance</button>

          {/* Listen Button */}
          {content && !audioLoading && ( !audioUrl ?
            (<button onClick={handleListen} className="btn btn-secondary">
               Hear Me Out
            </button>) :  (<button onClick={handleListenStop} className="btn btn-alternate">
            Stop
          </button>)
          )}
          {content && audioLoading && ( 
            (<button onClick={handleListen} className="btn btn-alternate btn-disabled" disabled>
              Loading...
            </button>)
          )}
          </div>
          {/* AI Response Display */}
          {loading ? (
            <p className="mt-4 text-gray-500">Loading...</p>
          ) : (
            <div className="mt-6 text-lg bg-gray-100/40 p-4 rounded-xl shadow-md text-left max-w-[800px] animate-fade-in flex items-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}


          {/* Audio Player */}
          {audioUrl && (
            <audio autoPlay hidden controls className="mt-4">
              <source src={audioUrl} type="audio/mpeg"/>
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen -mt-30 -ml-10">
          <a href="/sign-in" className="text-5xl text-[#fdf4d3]">Get Started</a>
        </div>  
      )}
      </div>
    </main>
  );
}

