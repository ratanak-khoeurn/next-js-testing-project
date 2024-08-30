import connect from "@/lip/db";
import User from "@/lip/moodals/user";
import Category from "@/lip/moodals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ messag: "Invalid user ID" }), {
        status: 400,
      });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ messag: "Invalid or missing category ID" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ messag: "User not found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ messag: "Category not found" }),
        { status: 404 }
      );
    }
    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "category is updated",
        category: updateCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category" + error.message, {
      status: 400,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ messag: "Invalid user ID" }), {
        status: 400,
      });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ messag: "Invalid or missing category ID" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ messag: "User not found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ messag: "Category not found" }),
        { status: 404 }
      );
    }
    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(
      JSON.stringify({ message: "category is deleted" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting category" + error.message, {
      status: 400,
    });
  }
};
