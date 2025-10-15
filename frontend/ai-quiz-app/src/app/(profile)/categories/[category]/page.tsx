
'use client';

import { useState, useEffect, use, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SubcategoryCard from "../../../_components/SubCategoryCard";

interface Subcategory {
  id: string;
  name: string;
  description: string;
  usersTaken?: number;
  trending?: boolean;
  isNew?: boolean;
  color?: string;
}


async function fetchSubcategories(categoryTitle: string, existingSubcategories: string[] = []): Promise<Subcategory[]> {
  const res = await fetch("http://localhost:5000/subcategories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: categoryTitle,
      existingSubcategories
    }),
  });

  if (!res.ok) throw new Error('Failed to fetch subcategories');

  const result = await res.json();
  return result.response.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    usersTaken: item.usersTaken,
    trending: item.trending,
    isNew: item.isNew,
    color: item.color || "bg-white",
  }));
}

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryClient({ params }: PageProps) {
  const resParams = use(params);
  const categoryTitle = resParams.category;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });
  const handleSearch = async (query: string) => {
    if (query.length >= 1) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch("http://localhost:5000/subcategories/search", {
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
            setSubcategories(mappedSearchResults);
          }
        } catch (error) {
          console.log("Search failed:", error);
        }
      }, 500);
    } else if (query.length === 0) {
      setSubcategories([]);
      setIsLoading(true);
      await fetchSubcategories(categoryTitle);
      setIsLoading(false);
    }
  };
  const loadMoreSubCategories = async () => {
    setIsLoadingMore(true);
    setError(null);

    try {
      const existingNames = subcategories.map(sub => sub.name);
      const newCategories = await fetchSubcategories(categoryTitle, existingNames);

      if (newCategories.length === 0) {
        setHasMore(false);
      } else {
        setSubcategories(prev => [...prev, ...newCategories]);
      }
    } catch (err) {
      setError('Failed to load more categories');
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const loadInitialSubcategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSubcategories(categoryTitle);
        setSubcategories(data);
        setHasMore(data.length > 0);
      } catch (err) {
        setError('Failed to load subcategories');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSubcategories();
  }, [categoryTitle]);

  // useEffect(() => {
  //   if (inView && hasMore && !isLoadingMore) {
  //     loadMoreCategories();
  //   }
  // }, [inView, hasMore, isLoadingMore]);

    useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && searchQuery.length === 0) {
          loadMoreSubCategories();
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
  }, [isLoading, loadMoreSubCategories]);

  




  const handleStartTest = (subcategoryTitle: string) => {
    console.log("Starting test for:", subcategoryTitle);
    window.location.href = `/quiz?subcategory=${encodeURIComponent(subcategoryTitle)}`;
  };

  const decodedCategoryTitle = decodeURIComponent(categoryTitle).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/4">
            <div className="sticky top-8 space-y-8">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 pl-0 hover:bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>

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

          <div className="lg:w-3/4">
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
            <div className="space-y-6 max-w-4xl">
              {subcategories.map((subcategory,index) => (
                <SubcategoryCard
                  key={subcategory.id || index}
                  subcategoryTitle={subcategory.name}
                  subcategoryDescription={subcategory.description}
                  usersTaken={subcategory.usersTaken}
                  trending={subcategory.trending}
                  isNew={subcategory.isNew}
                  color={subcategory.color || "bg-white"}
                  onStartTest={() => handleStartTest(subcategory.name)}
                />
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Discovering more paths...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={loadMoreSubCategories} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {hasMore && !isLoading && !error && (
              <div ref={ref} className="h-20" />
            )}

            {!hasMore && subcategories.length > 0 && (
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