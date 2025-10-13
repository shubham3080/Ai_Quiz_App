// "use client";

// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function home() {
//   const [token, setToken] = useState("");
//   const router = useRouter();
//   useEffect(() => {
//     const jwtToken = localStorage.getItem("token");
//     console.log("token from local storage", jwtToken);
//     if (jwtToken) {
//       setToken(jwtToken);
//     } else {
//       router.push("/login");
//     }
//   }, []);
//   const getUserName = () => {
//     try {
//       const decoded: {
//         id: string;
//         name: string;
//       } = jwtDecode(token);
//       return decoded.name;
//     } catch {
//       alert("invalid token.. please login again");
//       router.push("/login");
//     }
//   };
//   let userName: string | undefined = "";
//   if (token) {
//     userName = getUserName();
//     console.log("username", userName);
//   }
//   return <>{userName ? <h1> Hi {userName}</h1> : <></>}</>;
// }











"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryCardComponent from "../_components/CategoryCardComponent";

interface CategoryCardProps {
    categoryTitle: string;
    description?: string;
    trending?: boolean;
    color?: string;
    onArrowClick: () => void;
}

export default function Home() {
    const [userName, setUserName] = useState("");
    const [categories, setCategories] = useState<CategoryCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwtToken = localStorage.getItem("token");
                if (jwtToken) {
                    const decoded: { id: string; name: string } = jwtDecode(jwtToken);
                    setUserName(decoded.name);
                } else {
                    router.push("/login");
                    return;
                }

                setIsLoading(true);
                // const res = await fetch("http://localhost:5000/categories");
                // if (!res.ok) {
                //     throw new Error(`HTTP error! status: ${res.status}`);
                // }
                // const data = await res.json();

                const fakeCategories = [
                    {
                        name: "Information Technology",
                        description: "Master the digital world - from coding and cybersecurity to cloud computing and AI systems that power modern society.",
                        trending: true,
                        color: "bg-blue-50"
                    },
                    {
                        name: "Medical Science",
                        description: "Explore the human body, diseases, treatments, and medical breakthroughs that save lives and advance healthcare.",
                        trending: true,
                        color: "bg-green-50"
                    },
                    {
                        name: "Painting & Fine Arts",
                        description: "Discover artistic masterpieces, techniques, and the stories behind the world's most celebrated paintings and artists.",
                        trending: false,
                        color: "bg-purple-50"
                    },
                    {
                        name: "Music Theory & History",
                        description: "From classical symphonies to modern hits - understand musical composition, genres, and legendary musicians.",
                        trending: false,
                        color: "bg-red-50"
                    },
                    {
                        name: "World History",
                        description:"",
                        // description: "Journey through ancient civilizations, world wars, and pivotal moments that shaped human civilization across continents.",
                        trending: true,
                        color: "bg-orange-50"
                    },
                    {
                        name: "Environmental Science",
                        description: "Understand our planet's ecosystems, climate change, conservation efforts, and sustainable living practices.",
                        trending: true,
                        color: "bg-teal-50"
                    },
                    {
                        name: "Business & Economics",
                        description: "Learn about markets, entrepreneurship, economic theories, and business strategies that drive global economies.",
                        trending: false,
                        color: "bg-indigo-50"
                    },
                    {
                        name: "Psychology & Human Behavior",
                        description: "Explore the human mind, behavior patterns, cognitive processes, and what makes us think and act the way we do.",
                        trending: true,
                        color: "bg-pink-50"
                    },
                    {
                        name: "Culinary Arts",
                        description: "From cooking techniques to world cuisines - master the art and science behind delicious food and culinary traditions.",
                        trending: false,
                        color: "bg-yellow-50"
                    },
                    {
                        name: "Space & Astronomy",
                        description: "Reach for the stars! Learn about planets, galaxies, space exploration, and the mysteries of our universe.",
                        trending: true,
                        color: "bg-gray-50"
                    }
                ];
                const data=fakeCategories;

                const mappedCategories = data.map((item: any) => ({
                    categoryTitle: item.name || item.category || "Unknown Category",
                    description: item.description,
                    trending: item.trending || false,
                    color: item.color || "bg-white",
                    onArrowClick: () => console.log(`Clicked ${item.name}`)
                }));
                setCategories(mappedCategories);
            } catch (error) {
                console.log("Failed to fetch categories:", error);
                // setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Welcome, {userName}!
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading categories...</p>
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category, index) => (
                                <CategoryCardComponent
                                    key={index}
                                    {...category}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Can't retrieve categories
                            </h3>
                            <p className="text-gray-600">
                                There was an issue loading the categories. Please try again later.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}