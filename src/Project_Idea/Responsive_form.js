// src/components/ProjectForm.js

import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./AppContext";
import ideasData from './ideas.json';

function Responsive_form() {
    const { history, setHistory, bookmarks, setBookmarks } = useContext(AppContext);

    const [formData, setformData] = useState({
        domain: "",
        skillLevel: "",
        timeframe: "",
        constraints: "",
    });

    const [results, setResults] = useState({
      main: null,
      moreIdeas: null,
      similarIdeas: null,
    });
    const [lastInput, setLastInput] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save project to history and localStorage
    const saveToHistory = (data) => {
        const newEntry = { input: lastInput, result: data, date: new Date().toISOString() };
        setHistory([newEntry, ...history]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.domain || !formData.skillLevel || !formData.timeframe) {
            alert("Please fill in all required fields.");
            return;
        }
        setLastInput(formData);
        await fetchProjects(formData,"main");
    };

    // Fetch projects from backend
    const fetchProjects = async (input, type="main", variation = false) => {
        try {
            const body = variation ? { ...input, variation: true } : input;
            const response = await fetch("http://localhost:8000/generate-projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            setResults(prev => ({
              ...prev,
              [type]: data
            }));
            if (type === "main") saveToHistory(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert("Something went wrong.");
        }
    };

    const handleMoreIdeas = () => {
        setResults(prev => ({
            ...prev,
            moreIdeas: ideasData.moreIdeas
        }));
    };

    const handleSimilarIdeas = () => {
        setResults(prev => ({
            ...prev,
            similarIdeas: ideasData.similarIdeas
        }));
    };
    // Handle bookmark saving
    const handleBookmark = () => {
        if (results && lastInput) {
            const newBookmark = { input: lastInput, result: results, date: new Date().toISOString() };
            setBookmarks([newBookmark, ...bookmarks]);
            alert("Saved to bookmarks!");
        }
    };

    // Copy results to clipboard
    const copyToClipboard = () => {
        if (results.main && results.main.titles) {
            const text = results.main.titles.map((title, i) =>
                `${title}\n${results.main.summaries[i]}\nTools: ${results.main.tools[i]}`
            ).join("\n\n");
            navigator.clipboard.writeText(text)
                .then(() => alert("Copied to clipboard!"))
                .catch(err => console.error("Copy failed", err));
        }
    };

    return (
        <div className="container">
            <h1>Project Generator</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="domain"> Domain:*</label>
                    <input id="domain-style"
                           type="text"
                           name="domain"
                           value={formData.domain}
                           onChange={handleChange}
                    /><br/>
                <label htmlFor="skillset"> Skill Level:*</label>
                    <select
                        name="skillLevel"
                        value={formData.skillLevel}
                        onChange={handleChange}
                    >
                        <option value="">Select Skill Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select><br/>

                <label htmlFor="timeframe"> TimeFrame:*</label>
                    <select
                        name="timeframe"
                        value={formData.timeframe}
                        onChange={handleChange}
                    >
                        <option value="">Select Timeframe</option>
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select><br/>

                <label>Constraints (Optional: tools, platforms, etc)</label>
                <textarea
                    name="constraints"
                    value={formData.constraints}
                    onChange={handleChange}
                    placeholder="Enter any constraints here..."
                />
                <button type="submit">Generate Project</button>
                <button type="reset">Reset</button>
            </form>

            {/* Main Result */}
            {results.main && results.main.titles &&(
                <div className="mt-6 bg-gray-100 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Results:</h2>
                    {results.main.titles.map((title, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="font-bold">{title}</h3>
                            <p>{results.main.summaries[index]}</p>
                            <p><strong>Tools:</strong> {results.main.tools[index]}</p>
                        </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleMoreIdeas} className="bg-green-500 text-white px-3 py-1 rounded">More Ideas</button>
                        <button onClick={handleSimilarIdeas} className="bg-orange-500 text-white px-3 py-1 rounded">Similar Ideas</button>
                        <button onClick={handleBookmark} className="bg-yellow-500 text-white px-3 py-1 rounded">Bookmark</button>
                        <button onClick={copyToClipboard} className="bg-gray-500 text-white px-3 py-1 rounded">Copy</button>
                    </div>
                </div>
            )}

            {/* More Ideas */}
            {results.moreIdeas && results.moreIdeas.titles &&(
              <div className="mt-6 bg-blue-100 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">More Ideas:</h2>
                  <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear More Ideas?")) {
                      setResults(prev => ({ ...prev, moreIdeas: null }));
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm">Clear</button>
                  </div>
                {results.moreIdeas.titles.map((title, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{title}</h3>
                    <p>{results.moreIdeas.summaries[index]}</p>
                    <p><strong>Tools:</strong> {results.moreIdeas.tools[index]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Similar ideas */}
            {results.similarIdeas && results.similarIdeas.titles &&(
              <div className="mt-6 bg-green-100 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Similar Ideas:</h2>
                  <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear Similar Ideas?")) {
                      setResults(prev => ({ ...prev, similarIdeas: null }));
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm">Clear</button>
                </div>
                {results.similarIdeas.titles.map((title, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{title}</h3>
                    <p>{results.similarIdeas.summaries[index]}</p>
                    <p><strong>Tools:</strong> {results.similarIdeas.tools[index]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
                <div className="mt-6 bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">History</h3>
                    <button 
                    onClick={() => {
                    setHistory([]);
                    localStorage.removeItem("history");
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm">Clear History</button>
                  </div>
                  {history.map((entry, idx) => (
                    <div key={idx} className="mb-3 border-b pb-2">
                      <p><strong>Date:</strong> {entry.date ? new Date(entry.date).toLocaleString() : "Unknown"}</p>
                      <p><strong>Domain:</strong> {entry.input ? entry.input.domain : "Unknown"}</p>
                    </div>
                  ))}
               </div>
            )}

            {/* Bookmark */}
            {bookmarks.length > 0 && (
              <div className="mt-6 bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Bookmarks</h3>
                  <button
                  onClick={() => {
                    setBookmarks([]);
                    localStorage.removeItem("bookmarks");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm">Clear Bookmarks</button>
                </div>
                {bookmarks.map((entry, idx) => (
                  <div key={idx} className="mb-3 border-b pb-2">
                    <p><strong>Date:</strong> {entry.date ? new Date(entry.date).toLocaleString() : "Unknown"}</p>
                    <p><strong>Domain:</strong> {entry.input ? entry.input.domain : "Unknown"}</p>
                  </div>
                ))}
              </div>
            )}

        </div>
    );
}

export default Responsive_form;
