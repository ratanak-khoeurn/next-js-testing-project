import connect from "@/lip/db";
import User from "@/lip/moodals/user";
import Category from "@/lip/moodals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lip/moodals/blog";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
      const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category Id" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog Id" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        {
          status: 404,
        }
      );
    }
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in the database" }),
        {
          status: 404,
        }
      );
    }
    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error fetching blog" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing blog Id",
        }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        {
          status: 404,
        }
      );
    }
    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "Blog updated successfully",
        blog: updateBlog,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error updating blog" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog Id" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in the database" }),
        {
          status: 404,
        }
      );
    }
    await Blog.findByIdAndDelete(blogId);
    return new NextResponse(
      JSON.stringify({ message: "Blog deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error deleting blog" + error.message, {
      status: 500,
    });
  }
};
