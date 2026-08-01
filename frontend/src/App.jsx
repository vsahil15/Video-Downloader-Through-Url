import { useState } from 'react';
import API from './api/axios.js';
import './App.css';

function App() {
  const [downloadMode, setDownloadmode] = useState("youtube");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  // --- EMPTY VARIABLES FOR COMPILER ONLY (Add your own logic here) ---
  const [isLoading,setIsLoading] = useState(false); 
  const handleDownloadSubmit = async(e) => {
    e.preventDefault();
    setError("");
    if(!urlInput){
      setError("Please paste a valid URL before fetching")
      return;
    }
    setIsLoading(true);
    try{
      const response= await API.post(`/api/v1/${downloadMode}`,{
        url: urlInput,
        mode: downloadMode
      },
       { responseType: 'blob' } 
    );
     const blob = new Blob([response.data], { type: 'video/mp4' });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // 3. Declaratively trigger a click download event hidden in the background
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${downloadMode}-video.mp4`); // Set file layout name
      document.body.appendChild(link);
      link.click();
      
      // 4. Cleanup memory pointers
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      setUrlInput(""); // Reset input text bar layout
      alert("Download completed and saved to your device!");
    }catch(err){
      console.log(err.message);
    }
   }; 
  // -------------------------------------------------------------------

  console.log("which mode the user is using", downloadMode);

  return (
    <>
     {/* Main wrapper with visible text colors to prevent global CSS blockages */}
     <div className="w-full min-h-screen p-6 text-black">
       <section className="text-center max-w-2xl mx-auto">
        <div className="p-4">
          <ul className="flex">
            
            {/* YouTube Tab */}
            <li className="p-8 w-1/2 cursor-pointer">
              <button 
                type="button"
                onClick={() => setDownloadmode("youtube")} 
                className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-xl transition-colors duration-200
                  ${downloadMode === "youtube" 
                    ? "bg-sky-600 text-white font-semibold"  
                    : "bg-sky-200 text-black hover:bg-sky-300" 
                  }`}
              >
                Youtube
              </button>
            </li>

            {/* Instagram Tab */}
            <li className="p-8 w-1/2 cursor-pointer">
              <button 
                type="button"
                onClick={() => setDownloadmode("instagram")} 
                className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-xl transition-colors duration-200
                  ${downloadMode === "instagram" 
                    ? "bg-pink-600 text-white font-semibold" 
                    : "bg-pink-300 text-black hover:bg-pink-400" 
                  }`}
              >
                Instagram
              </button>
            </li>

          </ul>
        </div>

        {/* Form elements styled explicitly with text and background visibility rules */}
        <div className={`p-6 rounded-2xl text-left transition-all duration-300 bg-sky-50 border-2
   ${downloadMode === "youtube" 
     ? "border-sky-500 [box-shadow:0_10px_30px_-10px_rgba(14,165,233,0.3)]" 
     : "border-pink-500 [box-shadow:0_10px_30px_-10px_rgba(236,72,153,0.3)]"}`}>
           <form onSubmit={handleDownloadSubmit} className="space-y-4 ">
                <label htmlFor="urlinput" className="block font-medium text-gray-700 capitalize">
                  Paste your {downloadMode || 'video'} link here:
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="urlinput"
                    type="url"
                    placeholder={
                      downloadMode === "youtube"
                      ? "https://youtube.com..."
                      : downloadMode === "instagram"
                      ? "https://instagram.com..."
                      : "Paste link here..."
                    }
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black disabled:bg-gray-100"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading} 
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm disabled:bg-purple-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Downloading..." : "Download"}
                  </button>
                </div>

            {error && (
            <p className="text-sm text-red-600 font-medium mt-1">
            ⚠️ {error}
            </p>
             )}        
            </form>
         </div>
      </section>
     </div>
   </>
  )
}

export default App
