
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
//   const router = useRouter();
//   const sentinelRef = useRef<HTMLDivElement>(null);
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
//     console.log(data);
//     [...data].map((item: any) => console.log(item));
//     const mappedCategories = [...data].map((item: any) => ({
//       categoryTitle: item.name || item.category || "Unknown Category",
//       description: item.description,
//       trending: item.trending || false,
//       color: item.color || "bg-white",
//       onArrowClick: () => console.log(`Clicked ${item.name}`),
//     }));
//     setCategories((prev) => [...prev, ...mappedCategories]);
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       try {

//         setIsLoading(true);
//         await loadCategories();
//       } catch (error) {
//         console.log("Failed to fetch categories:", error);
//         // setCategories([]);
//       } finally {
//         setIsLoading(false);
//         console.log(categories);
//       }
//     };

//     fetchData();
//   }, [router]);

//   useEffect(() => {
//     console.log(categories);
//   }, [categories]);

//   useEffect(() => {
//     if (isLoading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isLoading) {
//           loadCategories();
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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4">

//           {isLoading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-gray-600">Loading categories...</p>
//             </div>
//           ) : categories.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {categories.map((category, index) => (
//                 <CategoryCardComponent key={index} {...category} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <div className="text-4xl mb-4">📚</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Can't retrieve categories
//               </h3>
//               <p className="text-gray-600">
//                 There was an issue loading the categories. Please try again
//                 later.
//               </p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           )}
//         </div>
//       </header>
//       <div ref={sentinelRef} className="h-10" />
//       {isLoading ? <></> : <p>loading more...</p>}
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CategoryCardComponent from "../../_components/CategoryCardComponent";

interface CategoryCardProps {
  categoryTitle: string;
  description?: string;
  trending?: boolean;
  color?: string;
  onArrowClick: () => void;
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = async (query: string) => {
    if (query.length >= 1) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch("http://localhost:5000/categories/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
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
            setCategories(mappedSearchResults);
          }
        } catch (error) {
          console.log("Search failed:", error);
        }
      }, 500);
    } else if (query.length === 0) {
      setCategories([]);
      setIsLoading(true);
      await loadCategories();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await loadCategories();
      } catch (error) {
        console.log("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && searchQuery.length === 0) {
          loadCategories();
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
  }, [isLoading, searchQuery]);

  const displayedCategories = searchQuery.length > 0 && searchQuery.length < 3
    ? categories.filter(cat =>
      cat.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : categories;

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
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
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
              {searchQuery ? `No results for "${searchQuery}"` : "No categories available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? "Try a different search term" : "There was an issue loading categories"}
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
      <div ref={sentinelRef} className="h-10" />
        {isLoading ? <></> : <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading more...</p>
          </div>}    
      </div>
  );
}