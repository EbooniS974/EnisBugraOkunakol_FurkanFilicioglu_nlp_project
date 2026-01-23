import React, { useState, useRef } from "react";

function AnalyzerDashboard() {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [whitepaperFile, setWhitepaperFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const codeInputRef = useRef();
  const whitepaperInputRef = useRef();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "code") setCodeFile(file);
      else setWhitepaperFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!codeFile || !whitepaperFile || !address || !name) {
      alert("Please fill all fields and upload both files.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("name", name);
      formData.append("sol_file", codeFile);
      formData.append("txt_file", whitepaperFile);

      const response = await fetch("http://localhost:8080/api/analyze_user_contract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const allFilesSelected = codeFile && whitepaperFile;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="w-full px-12 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Smart Contract Analyzer
              </h1>
              <p className="text-blue-300 mt-1">
                Advanced NLP-powered smart contract analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full h-full px-12 py-8 max-w-none">
        {/* Address & Name Inputs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 w-full">
          <div>
            <label className="block text-slate-300 mb-2">Contract Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x123..."
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Contract Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="UniswapV2Router02"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Upload Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 w-full">
          {/* Upload Contract */}
          <div
            onClick={() => codeInputRef.current.click()}
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-700/30 transition-all"
          >
            <div className="text-5xl mb-3">📝</div>
            <div className="text-white font-medium mb-2">
              Upload Solidity (.sol) File
            </div>
            {codeFile && (
              <div className="mt-3 text-green-400 text-sm">{codeFile.name}</div>
            )}
            <input
              type="file"
              ref={codeInputRef}
              className="hidden"
              accept=".sol"
              onChange={(e) => handleFileChange(e, "code")}
            />
          </div>

          {/* Upload Whitepaper */}
          <div
            onClick={() => whitepaperInputRef.current.click()}
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-slate-700/30 transition-all"
          >
            <div className="text-5xl mb-3">📄</div>
            <div className="text-white font-medium mb-2">
              Upload Whitepaper (.txt)
            </div>
            {whitepaperFile && (
              <div className="mt-3 text-green-400 text-sm">{whitepaperFile.name}</div>
            )}
            <input
              type="file"
              ref={whitepaperInputRef}
              className="hidden"
              accept=".txt"
              onChange={(e) => handleFileChange(e, "whitepaper")}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <button
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            allFilesSelected && address && name
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
          disabled={!allFilesSelected || !address || !name}
          onClick={handleAnalyze}
        >
          {analyzing ? "Analyzing..." : "Analyze Smart Contract 🚀"}
        </button>

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-slate-800/50 rounded-xl p-6 text-white border border-slate-700">
            <h2 className="text-xl font-semibold mb-3">📊 Analysis Result</h2>
            <pre className="text-sm bg-slate-900/50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-500/40">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyzerDashboard;