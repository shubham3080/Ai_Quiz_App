import CategoryClient from "./CategoryClient";

interface PageProps {
  params: {
    category: string;
  };
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  usersTaken?: number;
  trending?: boolean;
  isNew?: boolean;
  color?: string;
}

async function getInitialCategories(categoryTitle: string): Promise<Subcategory[]> {
  console.log("Server: Fetching initial categories for", categoryTitle);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // fake data
  return [
    { id: "1", name: "Frontend Development", description: "d1", usersTaken: 12500, trending: true, color: "bg-blue-50" },
    { id: "2", name: "Backend Development", description: "d2", usersTaken: 9800, trending: true, color: "bg-green-50" },
    { id: "3", name: "Mobile Development", description: "d3", usersTaken: 7600, color: "bg-indigo-50" },
    { id: "4", name: "DevOps", description: "d4", usersTaken: 8900, trending: true, color: "bg-yellow-50" },
    { id: "5", name: "AI & ML", description: "d5", usersTaken: 15600, trending: true, isNew: true, color: "bg-purple-50" },
    { id: "6", name: "Data Science", description: "d6", usersTaken: 13400, trending: true, color: "bg-teal-50" },
    { id: "7", name: "Cloud Computing", description: "d7", usersTaken: 11200, trending: true, color: "bg-orange-50" },
    { id: "8", name: "Cybersecurity", description: "d8", usersTaken: 8200, color: "bg-red-50" },
    { id: "9", name: "Blockchain", description: "d9", usersTaken: 5400, trending: true, isNew: true, color: "bg-gray-50" },
    { id: "10", name: "UI/UX Design", description: "d10", usersTaken: 6700, color: "bg-pink-50" },
  ];
}

export default async function CategoryPage({ params }: PageProps) {
  const categoryTitle = decodeURIComponent(params.category);
  
  const initialCategories = await getInitialCategories(categoryTitle);

  return (
    <CategoryClient 
      initialCategories={initialCategories}
      categoryTitle={categoryTitle}
    />
  );
}