import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [downloadMode, setDownloadmode] = useState("");
  console.log("which mode the user is using", downloadMode);

  return (
    <>
     <section className="text-center bg-cyan-400">
      <div className="p-12"> {/* Changed h1 to div since ul shouldn't be inside h1 */}
        <ul className="flex">
          
          {/* YouTube Tab */}
          <li className="pt-8 pl-8 pr-8 w-1/2 cursor-pointer">
            <button 
              onClick={() => setDownloadmode("youtube")} 
              className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg transition-colors duration-200
                ${downloadMode === "youtube" 
                  ? "bg-sky-600 text-white font-semibold"  // Active / Pressed state (darker sky blue)
                  : "bg-sky-200 text-black hover:bg-sky-300" // Normal state + Hover effect
                }`}
            >
              Youtube
            </button>
          </li>

          {/* Instagram Tab */}
          <li className="pt-8 pl-8 pr-8 w-1/2 cursor-pointer">
            <button 
              onClick={() => setDownloadmode("instagram")} 
              className={`w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg transition-colors duration-200
                ${downloadMode === "instagram" 
                  ? "bg-pink-600 text-white font-semibold" // Active / Pressed state (darker pink)
                  : "bg-pink-300 text-black hover:bg-pink-400" // Normal state + Hover effect
                }`}
            >
              Instagram
            </button>
          </li>

        </ul>
      </div>
     </section>
    </>
  )
}

export default App
