// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

// interface SubcategoryCardProps {
//   subcategoryTitle: string;
//   usersTaken?: number;
//   trending?: boolean;
//   isNew?: boolean;
//   color?: string;
//   onStartTest: (specificTopic?: string) => void;
// }

// export default function SubcategoryCard({
//   subcategoryTitle,
//   usersTaken,
//   trending = false,
//   isNew = false,
//   color = "bg-white",
//   onStartTest,
// }: SubcategoryCardProps) {
//   const [showSpecificTopic, setShowSpecificTopic] = useState(false);
//   const [specificTopic, setSpecificTopic] = useState("");

//   const handleCardClick = () => {
//     setShowSpecificTopic(!showSpecificTopic);
//   };

//   const handleStartTest = () => {
//     onStartTest(specificTopic.trim() || undefined);
//   };

//   return (
//     <Card className={`${color} border-2 hover:shadow-lg transition-all duration-300`}>
//       <CardContent 
//         className="p-4 cursor-pointer"
//         onClick={handleCardClick}
//       >
//         <div className="flex gap-2 mb-3">
//           {trending && (
//             <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-2 py-1 text-xs">
//               ⚡ Trending
//             </Badge>
//           )}
//           {isNew && (
//             <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
//               NEW
//             </Badge>
//           )}
//         </div>

//         <h3 className="font-semibold text-lg text-gray-900 text-center">
//           {subcategoryTitle}
//         </h3>

//         {showSpecificTopic && (
//           <div className="mt-4 space-y-2 animate-in fade-in duration-300">
//             <label className="text-sm font-medium text-gray-700">
//               Be more specific (optional):
//             </label>
//             <Input
//               placeholder="e.g., React, Vue, Angular..."
//               value={specificTopic}
//               onChange={(e) => setSpecificTopic(e.target.value)}
//               className="w-full"
//               onClick={(e) => e.stopPropagation()} 
//             />
//             <p className="text-xs text-gray-500">
//               This will help us customize your quiz experience
//             </p>
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100 mt-2">
//         <div className="flex items-center space-x-4 text-sm text-gray-600">
//           {usersTaken !== undefined && (
//             <div className="flex items-center space-x-1">
//               {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//               </svg> */}
//               <span>{usersTaken.toLocaleString()} took test</span>
//             </div>
//           )}
//         </div>

//         <Button 
//           onClick={handleStartTest}
//           className="bg-blue-600 hover:bg-blue-700"
//           size="sm"
//         >
//           Start Test
//           <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//           </svg>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TrendingUp, Sparkles, ArrowRight, Users } from "lucide-react";

interface SubcategoryCardProps {
  subcategoryTitle: string;
  subcategoryDescription: string;
  usersTaken?: number;
  trending?: boolean;
  isNew?: boolean;
  color?: string;
  onStartTest: () => void;
}

export default function SubcategoryCard({
  subcategoryTitle,
  subcategoryDescription,
  usersTaken,
  trending = false,
  isNew = false,
  color = "bg-white",
  onStartTest,
}: SubcategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStartTest = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartTest();
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <div 
            className={`${color} transition-all duration-500 ease-in-out ${
              isExpanded 
                ? 'w-4/5 pl-8 pr-6 py-6'  
                : 'w-full px-8 py-6'  
            }`}
            onClick={handleCardClick}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-2">
                {trending && (
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1.5">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {isNew && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 flex-1">
                {subcategoryTitle}
              </h3>
            </div>

            {usersTaken !== undefined && (
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Users className="h-4 w-4" />
                <span>{usersTaken.toLocaleString()} learners took this test</span>
              </div>
            )}

            <div className={`overflow-hidden transition-all duration-500 ${
              isExpanded 
                ? 'mt-4 pt-4 border-t border-slate-100 max-h-20 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <p className="text-slate-700 leading-relaxed text-sm">
                {subcategoryDescription}
              </p>
            </div>
          </div>

          <div 
            className={`flex items-center justify-center transition-all duration-500 ease-out ${
              isExpanded 
                ? 'w-1/5 opacity-100' 
                : 'w-0 opacity-0' 
            }`}
            onClick={handleStartTest}
          >
            <div className={`p-4 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-50 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}