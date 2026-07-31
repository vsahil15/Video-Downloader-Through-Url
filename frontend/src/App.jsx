import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [downloadMode, setDownloadmode] = useState("youtube");
  const [urlInput, setUrlInput] = useState("");

  // --- EMPTY VARIABLES FOR COMPILER ONLY (Add your own logic here) ---
  const isLoading = false; 
  const handleDownloadSubmit = (e) => { e.preventDefault(); }; 
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
            <li className="pt-8 pl-8 pr-8 w-1/2 cursor-pointer">
              <button 
                type="button"
                onClick={() => setDownloadmode("youtube")} 
                className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg transition-colors duration-200
                  ${downloadMode === "youtube" 
                    ? "bg-sky-600 text-white font-semibold"  
                    : "bg-sky-200 text-black hover:bg-sky-300" 
                  }`}
              >
                Youtube
              </button>
            </li>

            {/* Instagram Tab */}
            <li className="pt-8 pl-8 pr-8 w-1/2 cursor-pointer">
              <button 
                type="button"
                onClick={() => setDownloadmode("instagram")} 
                className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg transition-colors duration-200
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
        <div className="bg-white p-6 rounded-b-lg shadow-md border border-gray-200 text-left">
           <form onSubmit={handleDownloadSubmit} className="space-y-4">
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
                    {isLoading ? "Fetching..." : "Fetch"}
                  </button>
                </div>
            </form>
         </div>
      </section>
     </div>
   </>
  )
}

export default App
