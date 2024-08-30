import connect from "@/lip/db";
import User from "@/lip/moodals/user";
import Category from "@/lip/moodals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
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
          status: 400,
        }
      );
    }
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      "An error occurred while fetching user data" + error.message,
      {
        status: 500,
      }
    );
  }
};
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
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
          status: 400,
        }
      );
    }
    const newCategory = await new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();
    return new NextResponse(JSON.stringify(newCategory), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(
      "An error occurred while fetching user data" + error.message,
      {
        status: 500,
      }
    );
  }
};
