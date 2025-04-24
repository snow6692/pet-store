
"use server";

import { getAllCategories } from "@/actions/category.action";
import { getPaginationProduct } from "@/actions/product.action";
import { getMyOrders } from "@/actions/order.action";
import { getPaginatedPosts } from "@/actions/post.action";
import { getUsersCount } from "@/actions/user.action";
import { ordersType } from "@/lib/types/order.types";
import { PostsType } from "@/lib/types/post.types";
import { category } from "@prisma/client";
import ProductStockChart from "@/components/dashboard/ProductStockChart";
import OverviewCard from "@/components/dashboard/OverviewCard";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import RecentPosts from "@/components/dashboard/RecentPosts";

// Interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface DashboardData {
  categories: category[];
  products: Product[];
  orders: ordersType;
  posts: PostsType;
  users: number;
  totalCategories: number;
  totalProducts: number;
  totalOrders: number;
  totalPosts: number;
}

// Main DashboardPage Component
export default async function DashboardPage() {
  try {
    // Fetch all data server-side
    const [categoriesData, productsData, ordersData, postsData, usersData] =
      await Promise.all([
        getAllCategories({ page: 1, limit: 10 }),
        getPaginationProduct({ page: 1, limit: 10 }),
        getMyOrders({ page: 1, limit: 10, isAdmin: true }),
        getPaginatedPosts({ page: 1, limit: 10 }),
        getUsersCount(),
      ]);

    const data: DashboardData = {
      categories: categoriesData.categories,
      products: productsData.products,
      orders: ordersData.myOrders,
      posts: postsData.posts,
      users: usersData,
      totalCategories: categoriesData.total,
      totalProducts: productsData.total,
      totalOrders: ordersData.total || 0,
      totalPosts: postsData.posts.length,
    };

    // Prepare data for charts
    const orderStatusData = [
      {
        name: "Pending",
        count:
          data.orders?.filter((order) => order.status === "PENDING").length ||
          0,
      },
      {
        name: "On Way",
        count:
          data.orders?.filter((order) => order.status === "ON_WAY").length || 0,
      },
      {
        name: "Canceled",
        count:
          data.orders?.filter((order) => order.status === "CANCELED").length ||
          0,
      },
      {
        name: "Delivered",
        count:
          data.orders?.filter((order) => order.status === "DELIVERED").length ||
          0,
      },
    ];

    const productStockData = data.products.map((product) => ({
      name: product.name,
      stock: product.quantity,
    }));

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">
            Dashboard Overview
          </h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard
              title="Total Posts"
              count={data.totalPosts}
              isLoading={false}
              icon="FileText"
            />
            <OverviewCard
              title="Total Products"
              count={data.totalProducts}
              isLoading={false}
              icon="Package"
            />
            <OverviewCard
              title="Total Orders"
              count={data.totalOrders}
              isLoading={false}
              icon="ShoppingCart"
            />
            <OverviewCard
              title="Total Categories"
              count={data.totalCategories}
              isLoading={false}
              icon="Folder"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatusChart data={orderStatusData} />
            <ProductStockChart data={productStockData} />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentPosts posts={data.posts} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p className="text-red-500">
          Failed to load dashboard. Please try again later.
        </p>
      </div>
    );
  }
}
