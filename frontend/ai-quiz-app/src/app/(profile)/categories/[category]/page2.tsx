
// import { useState, useEffect, use } from "react";
// import { useInView } from "react-intersection-observer";
// import { Button } from "../../../../components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import SubcategoryCard from "../../../_components/SubCategoryCard";

// interface Subcategory {
//   id: string;
//   name: string;
//   description: string;
//   usersTaken?: number;
//   trending?: boolean;
//   isNew?: boolean;
//   color?: string;
// }

// interface CategoryClientProps {
//   categoryTitle: string;
// }
// interface PageProps {
//   params: {
//     category: string;
//   };
// }

// async function fetchSubcategories(categoryTitle: string, existingSubcategories: string[] = []): Promise<Subcategory[]> {
//   const res = await fetch("http://localhost:5000/subcategories", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ 
//       category: categoryTitle,
//       existingSubcategories 
//     }),
//   });

//   if (!res.ok) throw new Error('Failed to fetch subcategories');
  
//   const result = await res.json();
//   return result.response.map((item: any) => ({
//     id: item.id,
//     name: item.name,
//     description: item.description,
//     usersTaken: item.usersTaken,
//     trending: item.trending,
//     isNew: item.isNew,
//     color: item.color || "bg-white",
//   }));
// }

// export default function CategoryClient({ params }: Promise<PageProps>) {
//     const resParams = use(params);
//   const categoryTitle = resParams.category;
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const { ref, inView } = useInView({ threshold: 0 });

//   useEffect(() => {
//     const loadInitialSubcategories = async () => {
//       try {
//         setIsLoading(true);
//         const data = await fetchSubcategories(categoryTitle);
//         setSubcategories(data);
//         setHasMore(data.length > 0);
//       } catch (err) {
//         setError('Failed to load subcategories');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadInitialSubcategories();
//   }, [categoryTitle]);

//   const loadMoreSubcategories = async () => {
//     if (!hasMore || isLoadingMore) return;
    
//     try {
//       setIsLoadingMore(true);
//       const existingNames = subcategories.map(sub => sub.name);
//       const newData = await fetchSubcategories(categoryTitle, existingNames);
      
//       if (newData.length === 0) {
//         setHasMore(false);
//       } else {
//         setSubcategories(prev => [...prev, ...newData]);
//       }
//     } catch (err) {
//       setError('Failed to load more subcategories');
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     if (inView && hasMore && !isLoadingMore) {
//       loadMoreSubcategories();
//     }
//   }, [inView, hasMore, isLoadingMore]);

//   const handleStartTest = (subcategoryTitle: string) => {
//     window.location.href = `/quiz?subcategory=${encodeURIComponent(subcategoryTitle)}`;
//   };

//   const decodedCategoryTitle = decodeURIComponent(categoryTitle).replace(/-/g, ' ');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-6 py-8">
//         <div className="flex flex-col lg:flex-row gap-12">
//           <div className="lg:w-1/4">
//             <div className="sticky top-8 space-y-6">
//               <Button 
//                 variant="ghost" 
//                 onClick={() => window.history.back()}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 pl-0"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Categories
//               </Button>

//               <div className="space-y-4">
//                 <h1 className="text-3xl font-bold text-gray-900 capitalize">
//                   {decodedCategoryTitle}
//                 </h1>
//                 <p className="text-gray-600">
//                   Explore subcategories and test your knowledge in specific areas.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Content */}
//           <div className="lg:w-3/4">
//             {isLoading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-2 text-gray-600">Loading subcategories...</span>
//               </div>
//             ) : error ? (
//               <div className="text-center py-8">
//                 <p className="text-red-600 mb-4">{error}</p>
//                 <Button onClick={() => window.location.reload()} variant="outline">
//                   Try Again
//                 </Button>
//               </div>
//             ) : subcategories.length > 0 ? (
//               <>
//                 <div className="space-y-4">
//                   {subcategories.map((subcategory) => (
//                     <SubcategoryCard
//                       key={subcategory.id}
//                       subcategoryTitle={subcategory.name}
//                       subcategoryDescription={subcategory.description}
//                       usersTaken={subcategory.usersTaken}
//                       trending={subcategory.trending}
//                       isNew={subcategory.isNew}
//                       color={subcategory.color}
//                       onStartTest={() => handleStartTest(subcategory.name)}
//                     />
//                   ))}
//                 </div>

//                 {isLoadingMore && (
//                   <div className="flex justify-center py-4">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                   </div>
//                 )}

//                 {hasMore && !isLoadingMore && <div ref={ref} className="h-10" />}

//                 {!hasMore && subcategories.length > 0 && (
//                   <div className="text-center py-8 text-gray-500">
//                     All subcategories loaded
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No subcategories found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }