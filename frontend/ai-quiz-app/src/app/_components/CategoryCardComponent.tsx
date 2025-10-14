


// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Badge } from "../../components/ui/badge";

// interface CategoryCardProps {
//   categoryTitle: string;
//   description?: string;
//   trending?: boolean;
//   color?: string;
//   onArrowClick: () => void;
// }

// export default function CategoryCardComponent({
//   categoryTitle,
//   description,
//   trending = false,
//   color = "bg-white",
//   onArrowClick,
// }: CategoryCardProps) {
//   return (
//     <Card className={`${color} min-h-[160px] flex flex-col justify-between`}>
//       <CardContent className={`p-4 flex-1 flex flex-col ${!description ? 'justify-center' : ''}`}>
//         <h3 className={`font-semibold text-lg ${!description ? 'text-center' : 'mb-2'}`}>
//           {categoryTitle}
//         </h3>
//         {description && (
//           <p className="text-sm text-muted-foreground text-center">
//             {description}
//           </p>
//         )}
//       </CardContent>

//       <CardFooter className="p-4 pt-0 flex justify-between items-center">
//         <div>
//           {trending && (
//             <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm px-3 py-1">
//               ⚡ Trending
//             </Badge>
//           )}
//         </div>
//         <Button size="sm" onClick={onArrowClick}>
//           →
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }




import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";
import SubcategoryModal from "../_components/SubCategoryCardsModal";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  categoryTitle: string;
  description?: string;
  trending?: boolean;
  color?: string;
}

export default function CategoryCardComponent({
  categoryTitle,
  description,
  trending = false,
  color = "bg-white",
}: CategoryCardProps) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleArrowClick = () => {
    // setIsModalOpen(true);

    const slug = categoryTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    router.push(`/categories/${slug}`);
  };

  return (
    <>
      <Card className={`${color} min-h-[160px] flex flex-col justify-between`}>
        <CardContent className={`p-4 flex-1 flex flex-col ${!description ? 'justify-center' : ''}`}>
          <h3 className={`font-semibold text-lg ${!description ? 'text-center' : 'mb-2'}`}>
            {categoryTitle}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground text-center">
              {description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            {trending && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm px-3 py-1">
                ⚡ Trending
              </Badge>
            )}
          </div>
          <Button size="sm" onClick={handleArrowClick}>
            →
          </Button>
        </CardFooter>
      </Card>

      {/* <SubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryTitle={categoryTitle}
      /> */}
    </>
  );
}