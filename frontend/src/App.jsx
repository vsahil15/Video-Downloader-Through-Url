import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [downloadMode, setDownloadmode] = useState("");
  console.log("which mode the user is using",downloadMode);

  return (
    <>
     <section class="text-center bg-cyan-400">
      <h1 class="p-12">
        <ul class="flex ">
          <li class="pt-8 pl-8 pr-8  w-1/2 cursor-pointer ... "><button onClick={() => setDownloadmode("youtube") } class="bg-sky-200  w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg">youtube</button></li>
          <li class="pt-8 pl-8 pr-8  w-1/2 cursor-pointer ... "><button onClick={() => setDownloadmode("instagram")} class="bg-pink-300 w-42 h-10 text-lg font-sans font-normal px-4 py-2 rounded-t-lg">instagram</button></li>
        </ul>
      </h1>
     </section>
    </>
  )
}

export default App
