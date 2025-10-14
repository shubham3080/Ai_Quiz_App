import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface CategoryCardProps {
    categoryTitle: string;
    description?: string;
    trending?: boolean;
    color?: string;
    onArrowClick: () => void;
}

export default function CategoryCardComponent({
    categoryTitle,
    description,
    trending = false,
    color = "bg-white",
    onArrowClick,
}: CategoryCardProps) {
    return (
        <Card className={`${color} min-h-[160px] flex flex-col justify-between`}>
            <CardContent className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2">{categoryTitle}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div>
                    {trending && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm px-3 py-1.5">
                        ⚡ Trending
                    </Badge>}
                </div>
                <Button size="sm" onClick={onArrowClick}>
                    →
                </Button>
            </CardFooter>
        </Card>
    );
}