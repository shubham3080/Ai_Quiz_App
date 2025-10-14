// 'use client';

// import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer";
// import SubcategoryCard from "../../_components/SubCategoryCard";
// import { Button } from "../../../components/ui/button";

// interface Subcategory {
//   id: string;
//   name: string;
//   usersTaken?: number;
//   trending?: boolean;
//   isNew?: boolean;
//   color?: string;
// }

// interface CategoryClientProps {
//   initialCategories: Subcategory[];
//   categoryTitle: string;
// }

// async function fetchMoreCategories(categoryTitle: string): Promise<Subcategory[]> {
//   console.log("Client: Fetching more categories for", categoryTitle);
  
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   return [
//     { id: "11", name: "Game Development", usersTaken: 4500, color: "bg-blue-100" },
//     { id: "12", name: "AR/VR Development", usersTaken: 3200, isNew: true, color: "bg-green-100" },
//     { id: "13", name: "IoT Programming", usersTaken: 2800, color: "bg-purple-100" },
//     { id: "14", name: "Quantum Computing", usersTaken: 2100, isNew: true, color: "bg-red-100" },
//     { id: "15", name: "Robotics", usersTaken: 3900, color: "bg-orange-100" },
//   ];
// }

// export default function CategoryClient({ initialCategories, categoryTitle }: CategoryClientProps) {
//   const [categories, setCategories] = useState<Subcategory[]>(initialCategories);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const { ref, inView } = useInView({
//     threshold: 0,
//     rootMargin: '50px',
//   });

//   useEffect(() => {
//     if (inView && hasMore && !isLoading) {
//       loadMoreCategories();
//     }
//   }, [inView, hasMore, isLoading]);

//   const loadMoreCategories = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const newCategories = await fetchMoreCategories(categoryTitle);
      
//       if (newCategories.length === 0) {
//         setHasMore(false);
//       } else {
//         // Add new categories to existing list
//         setCategories(prev => [...prev, ...newCategories]);
        
//         // For demo, stop after loading 15 items. Remove this in real app
//         if (categories.length + newCategories.length >= 15) {
//           setHasMore(false);
//         }
//       }
//     } catch (err) {
//       setError('Failed to load more categories');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRetry = () => {
//     loadMoreCategories();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-1/4">
//             <div className="sticky top-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                 {categoryTitle}
//               </h1>
//               <p className="text-gray-600 mb-4">
//                 Explore all subcategories
//               </p>
//               <Button 
//                 variant="outline" 
//                 onClick={() => window.history.back()}
//                 className="w-full"
//               >
//                 ← Back to Categories
//               </Button>
//             </div>
//           </div>

//           <div className="lg:w-3/4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {categories.map((category) => (
//                 <SubcategoryCard
//                   key={category.id}
//                   subcategoryTitle={category.name}
//                   usersTaken={category.usersTaken}
//                   trending={category.trending}
//                   isNew={category.isNew}
//                   color={category.color || "bg-white"}
//                   onStartTest={(specificTopic) => {
//                     console.log("Starting test:", category.name, specificTopic);
//                     window.location.href = `/quiz?subcategory=${category.name}&topic=${specificTopic}`;
//                   }}
//                 />
//               ))}
//             </div>

//             {isLoading && (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-2 text-gray-600">Loading more...</span>
//               </div>
//             )}

//             {error && (
//               <div className="text-center py-8">
//                 <p className="text-red-600 mb-4">{error}</p>
//                 <Button onClick={handleRetry} variant="outline">
//                   Try Again
//                 </Button>
//               </div>
//             )}

//             {hasMore && !isLoading && !error && (
//               <div ref={ref} className="h-10" />
//             )}

//             {!hasMore && categories.length > 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">All categories loaded</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// app/categories/[category]/CategoryClient.tsx
'use client';

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SubcategoryCard from "../../_components/SubCategoryCard";

interface Subcategory {
  id: string;
  name: string;
  description: string;
  usersTaken?: number;
  trending?: boolean;
  isNew?: boolean;
  color?: string;
}

interface CategoryClientProps {
  initialCategories: Subcategory[];
  categoryTitle: string;
}

// Mock function to fetch more categories
async function fetchMoreCategories(categoryTitle: string): Promise<Subcategory[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { 
      id: "11", 
      name: "Game Development", 
      description: "Learn game development fundamentals, game engines, and create interactive gaming experiences.",
      usersTaken: 4500,
      trending: true, 
      color: "bg-white" 
    },
    { 
      id: "12", 
      name: "AR/VR Development", 
      description: "Build immersive augmented and virtual reality applications for various platforms and devices.",
      usersTaken: 3200,
      isNew: true, 
      color: "bg-white" 
    },
  ];
}

export default function CategoryClient({ initialCategories, categoryTitle }: CategoryClientProps) {
  const [categories, setCategories] = useState<Subcategory[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreCategories();
    }
  }, [inView, hasMore, isLoading]);

  const loadMoreCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCategories = await fetchMoreCategories(categoryTitle);
      
      if (newCategories.length === 0) {
        setHasMore(false);
      } else {
        setCategories(prev => [...prev, ...newCategories]);
        if (categories.length + newCategories.length >= 8) {
          setHasMore(false);
        }
      }
    } catch (err) {
      setError('Failed to load more categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = (subcategoryTitle: string) => {
    console.log("Starting test for:", subcategoryTitle);
    window.location.href = `/quiz?subcategory=${encodeURIComponent(subcategoryTitle)}`;
  };

  // Decode URL parameters to get the original title
  const decodedCategoryTitle = decodeURIComponent(categoryTitle).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8 space-y-8">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 pl-0 hover:bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>

              {/* Category Title & Description */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2 capitalize">
                    {decodedCategoryTitle}
                  </h1>
                  <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-slate-700 text-base leading-relaxed">
                    Explore specialized learning paths in {decodedCategoryTitle.toLowerCase()}. 
                    Each subcategory represents a focused domain where you can test your expertise 
                    through comprehensive assessments.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Click on any subcategory to learn more and begin your assessment journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Single Column Cards */}
          <div className="lg:w-3/4">
            <div className="space-y-6 max-w-4xl">
              {categories.map((category) => (
                <SubcategoryCard
                  key={category.id}
                  subcategoryTitle={category.name}
                  subcategoryDescription={category.description}
                  usersTaken={category.usersTaken}
                  trending={category.trending}
                  isNew={category.isNew}
                  color={category.color || "bg-white"}
                  onStartTest={() => handleStartTest(category.name)}
                />
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Discovering more paths...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={loadMoreCategories} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            {hasMore && !isLoading && !error && (
              <div ref={ref} className="h-20" />
            )}

            {/* End of List */}
            {!hasMore && categories.length > 0 && (
              <div className="text-center py-12">
                <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">All Paths Explored</h3>
                  <p className="text-slate-600 text-sm">
                    You've discovered all available learning paths
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}