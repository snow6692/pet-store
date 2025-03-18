import DashboardCard from "@/components/cards/DashboardCard";
import Link from "next/link";

type CardLink = {
  title: string;
  content: string;
  link: string;
};

const cardLinks: CardLink[] = [
  {
    title: "See All Categories",
    content: "Go to categories",
    link: "/dashboard/categories/1",
  },
  {
    title: "Add New Category",
    content: "Create a new category",
    link: "/dashboard/categories/new",
  },
];
async function CategoryPage() {
  return (
    <div className="w-3/4 mx-auto">
      <div className="grid grid-cols-3 gap-10">
        {cardLinks.map((card) => (
          <Link key={card.link} href={card.link}>
            <DashboardCard cardContent={card.content} cardTitle={card.title} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
