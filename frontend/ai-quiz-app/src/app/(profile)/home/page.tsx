/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import CategoryCardComponent from "../../_components/CategoryCardComponent";

// interface CategoryCardProps {
//   categoryTitle: string;
//   description?: string;
//   trending?: boolean;
//   color?: string;
//   onArrowClick: () => void;
// }

// export default function Home() {
//   const [categories, setCategories] = useState<CategoryCardProps[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const router = useRouter();
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const loadCategories = async () => {
//     const categoriesTitles = categories.map((item) => item.categoryTitle);
//     const res = await fetch("http://localhost:5000/categories", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ categoriesTitles }),
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     const result = await res.json();
//     const data = await result.response;
//     const mappedCategories = [...data].map((item: any) => ({
//       categoryTitle: item.name || item.category || "Unknown Category",
//       description: item.description,
//       trending: item.trending || false,
//       color: item.color || "bg-white",
//       onArrowClick: () => console.log(`Clicked ${item.name}`),
//     }));
//     setCategories((prev) => [...prev, ...mappedCategories]);
//   };
//   const loadMoreCategories = async () => {
//     if (isLoadingMore) return;
//     console.log("Loading more categories...");
//     setIsLoadingMore(true);
//     try {
//       await loadCategories();
//     } catch (error) {
//       console.log("Failed to load more categories:", error);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   const handleSearch = async (query: string) => {
//     if (query.length >= 1) {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }

//       searchTimeoutRef.current = setTimeout(async () => {
//         try {
//           setIsSearching(true);
//           const res = await fetch("http://localhost:5000/categoriesBySearch", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ search: query }),
//           });

//           if (res.ok) {
//             const result = await res.json();
//             const searchData = await result.response;
//             const mappedSearchResults = searchData.map((item: any) => ({
//               categoryTitle: item.name || item.category || "Unknown Category",
//               description: item.description,
//               trending: item.trending || false,
//               color: item.color || "bg-white",
//               onArrowClick: () => console.log(`Clicked ${item.name}`),
//             }));
//             setCategories(mappedSearchResults);
//           }
//         } catch (error) {
//           console.log("Search failed:", error);
//         }
//         finally {
//           setIsSearching(false);
//         }
//       }, 500);
//     } else if (query.length === 0) {
//       setCategories([]);
//       setIsLoading(true);
//       await loadCategories();
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         await loadCategories();
//       } catch (error) {
//         console.log("Failed to fetch categories:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   useEffect(() => {
//     if (isLoading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isLoading && searchQuery.length === 0) {
//           loadMoreCategories();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (sentinelRef.current) {
//       observer.observe(sentinelRef.current);
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, [isLoading, loadCategories]);

//   const displayedCategories = searchQuery.length > 0 && searchQuery.length < 3
//     ? categories.filter(cat =>
//       cat.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     : categories;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Explore Categories
//               </h1>
//             </div>

//             <div className="w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   handleSearch(e.target.value);
//                 }}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {(isLoading || isSearching) ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-2 text-gray-600">Loading categories...</p>
//           </div>
//         ) : displayedCategories.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {displayedCategories.map((category, index) => (
//               <CategoryCardComponent key={index} {...category} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <div className="text-4xl mb-4">🔍</div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               {searchQuery ? `No results for "${searchQuery}"` : "No categories available"}
//             </h3>
//             <p className="text-gray-600">
//               {searchQuery ? "Try a different search term" : "There was an issue loading categories"}
//             </p>
//             {searchQuery && (
//               <button
//                 onClick={() => {
//                   setSearchQuery("");
//                   setCategories([]);
//                   setIsLoading(true);
//                   loadCategories().finally(() => setIsLoading(false));
//                 }}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Clear Search
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* {searchQuery.length === 0 && <div ref={sentinelRef} className="h-10" />}
//       {isLoading && searchQuery.length === 0 && <p className="text-center">loading more...</p>} */}
//       {isLoadingMore && (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Loading more...</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CategoryCardComponent from "../../_components/CategoryCardComponent";
import { MagicSearchLoader } from "@/app/_lib/MagicSearchLoader";

interface CategoryCardProps {
  categoryTitle: string;
  description?: string;
  trending?: boolean;
  color?: string;
  onArrowClick?: () => void;
}

const fakeCategories = [
  {
    categoryTitle: "Information Technology",
    description:
      "Master the digital world - from coding and cybersecurity to cloud computing and AI systems that power modern society.",
    trending: true,
    color: "bg-blue-50",
  },
  {
    categoryTitle: "Medical Science",
    description:
      "Explore the human body, diseases, treatments, and medical breakthroughs that save lives and advance healthcare.",
    trending: true,
    color: "bg-green-50",
  },
  {
    categoryTitle: "Painting & Fine Arts",
    description:
      "Discover artistic masterpieces, techniques, and the stories behind the world's most celebrated paintings and artists.",
    trending: false,
    color: "bg-purple-50",
  },
  {
    categoryTitle: "Music Theory & History",
    description:
      "From classical symphonies to modern hits - understand musical composition, genres, and legendary musicians.",
    trending: false,
    color: "bg-red-50",
  },
  {
    categoryTitle: "World History",
    description:
      "Journey through ancient civilizations, world wars, and pivotal moments that shaped human civilization across continents.",
    trending: true,
    color: "bg-orange-50",
  },
  {
    categoryTitle: "Environmental Science",
    description:
      "Understand our planet's ecosystems, climate change, conservation efforts, and sustainable living practices.",
    trending: true,
    color: "bg-teal-50",
  },
  {
    categoryTitle: "Business & Economics",
    description:
      "Learn about markets, entrepreneurship, economic theories, and business strategies that drive global economies.",
    trending: false,
    color: "bg-indigo-50",
  },
  {
    categoryTitle: "Psychology & Human Behavior",
    description:
      "Explore the human mind, behavior patterns, cognitive processes, and what makes us think and act the way we do.",
    trending: true,
    color: "bg-pink-50",
  },
  {
    categoryTitle: "Culinary Arts",
    description:
      "From cooking techniques to world cuisines - master the art and science behind delicious food and culinary traditions.",
    trending: false,
    color: "bg-yellow-50",
  },
  {
    categoryTitle: "Space & Astronomy",
    description:
      "Reach for the stars! Learn about planets, galaxies, space exploration, and the mysteries of our universe.",
    trending: true,
    color: "bg-gray-50",
  },
  {
    categoryTitle: "Literature & Poetry",
    description:
      "Dive into classic novels, modern fiction, poetic forms, and the literary movements that shaped cultures and inspired generations.",
    trending: true,
    color: "bg-amber-50",
  },
  {
    categoryTitle: "Architecture & Design",
    description:
      "Explore iconic buildings, design principles, urban planning, and the evolution of architectural styles from ancient to contemporary.",
    trending: false,
    color: "bg-cyan-50",
  },
  {
    categoryTitle: "Philosophy & Ethics",
    description:
      "Question reality, morality, knowledge, and existence through the ideas of great thinkers and timeless philosophical debates.",
    trending: true,
    color: "bg-violet-50",
  },
  {
    categoryTitle: "Sports & Athletics",
    description:
      "From Olympic legends to team strategies — understand the science, history, and culture behind the world’s most popular sports.",
    trending: true,
    color: "bg-rose-50",
  },
  {
    categoryTitle: "Languages & Linguistics",
    description:
      "Unlock the secrets of human communication — from grammar and phonetics to language evolution and multilingual fluency.",
    trending: false,
    color: "bg-emerald-50",
  },
];

export default function Home() {
  const [categories, setCategories] =
    useState<CategoryCardProps[]>(fakeCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // const cache = useRef<Record<string, any[]>>({});

  const loadCategories = async () => {
    const categoriesTitles = categories.map((item) => item.categoryTitle);
    const res = await fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoriesTitles }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    const data = await result.response;
    const mappedCategories = [...data].map((item: any) => ({
      categoryTitle: item.name || item.category || "Unknown Category",
      description: item.description,
      trending: item.trending || false,
      color: item.color || "bg-white",
      onArrowClick: () => console.log(`Clicked ${item.name}`),
    }));

    setCategories((prev) => [...prev, ...mappedCategories]);
  };
  const loadMoreCategories = async () => {
    if (isLoadingMore) return;
    console.log("Loading more categories...");
    setIsLoadingMore(true);
    try {
      await loadCategories();
    } catch (error) {
      console.log("Failed to load more categories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length >= 1) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        // if (cache.current[searchQuery]) {
        //   setCategories(cache.current[searchQuery]);
        //   setIsLoadingMore(false);
        //   return;
        // }

        try {
          setIsSearching(true);
          setShowDisclaimer(false);
          setIsLoading(true);
          const res = await fetch("http://localhost:5000/categoriesBySearch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ search: query }),
          });

          if (res.ok) {
            const result = await res.json();
            const searchData = await result.response;
            const mappedSearchResults = searchData.map((item: any) => ({
              categoryTitle: item.name || item.category || "Unknown Category",
              description: item.description,
              trending: item.trending || false,
              color: item.color || "bg-white",
              onArrowClick: () => console.log(`Clicked ${item.name}`),
            }));
            // cache.current[searchQuery] = mappedSearchResults;
            setCategories(mappedSearchResults);
          }
        } catch (error) {
          console.log("Search failed:", error);
        } finally {
          setIsSearching(false);
          setIsLoading(false);
        }
      }, 500);
    } else if (query.length === 0) {
      setCategories([]);
      setIsLoading(true);
      await loadCategories();
      setIsLoading(false);
    }
  };

  // useEffect(() => {}, [router]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          searchQuery.length === 0
        ) {
          loadMoreCategories();
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading, loadMoreCategories]);

  const displayedCategories =
    searchQuery.length > 0 && searchQuery.length < 3
      ? categories.filter((cat) =>
          cat.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : categories;

  const handleLoadLatest = () => {
    setShowDisclaimer(false);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setCategories([]);
        await loadCategories();
      } catch (error) {
        console.log("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Explore Categories
              </h1>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {showDisclaimer && (
          <div className="flex items-start gap-2 text-gray-400 text-sm mb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="py-2">
              This content was loaded in the past. For latest content
            </span>
            <button
              onClick={handleLoadLatest}
              className="ml-5 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:opacity-60 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              Load Latest
            </button>
          </div>
        )}
        {isLoading || isSearching ? (
          <MagicSearchLoader />
        ) : displayedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCategories.map((category, index) => (
              <CategoryCardComponent key={index} {...category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No categories available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try a different search term"
                : "There was an issue loading categories"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategories([]);
                  setIsLoading(true);
                  loadCategories().finally(() => setIsLoading(false));
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
      {/* {searchQuery.length === 0 && <div ref={sentinelRef} className="h-10" />}
      {isLoading && searchQuery.length === 0 && <p className="text-center">loading more...</p>} */}
      {/* {isLoadingMore && (
        // <div className="text-center py-8">
        //   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        //   <p className="mt-2 text-gray-600">Loading more...</p>
        // </div>
      // )}*/}
      {searchQuery === "" ? (
        <div ref={sentinelRef} className="h-10">
          {isLoading ? <></> : <MagicSearchLoader text="Loading More.."/>}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
