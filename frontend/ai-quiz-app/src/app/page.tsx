// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Quizo</h1>
//         <div className="space-y-4">

//           <Link
//             href="/login"
//             className="block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Login
//           </Link>
//           <Link
//             href="/register"
//             className="block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


import FlipAuthCard from "./_components/FlipAuthCard";
import QuizoraLogo from "../../public/QuizoraLogo.png";
import Image from 'next/image';
import MouseParticles from "./_lib/MouseParticles"


export default function Home() {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/space-bg.gif')] bg-cover bg-center opacity-80"></div>
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="space.mp4" type="video/mp4" />
      </video>

      <div className="w-[50%] h-[77vh] bg-transparent rounded-xl flex relative z-10">
        <MouseParticles />

        <div className="flex-1 flex items-center justify-center h-full">

          <div className="flex-1 flex items-center justify-center h-full bg-red-500/0">
            <Image
              src={QuizoraLogo}
              alt="Quizora"
              className="h-[90%] w-auto object-contain max-w-full"
              priority
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-r-xl relative">
          <div className="absolute left-[-8%] top-1/2 -translate-y-1/2">
            <FlipAuthCard />
          </div>
        </div>

      </div>
    </div>
  );
}
