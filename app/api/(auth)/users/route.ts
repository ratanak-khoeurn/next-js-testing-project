import connect from "@/lip/db";
import User from "@/lip/moodals/user";
import exp from "constants";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse("Error creating user" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid username" }), {
        status: 400,
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
      );
      if (!updatedUser) {
        return new NextResponse(JSON.stringify({ message: "User not found in the database" }), {
          status: 404,
        });
      }
      return new NextResponse(
        JSON.stringify({ message: "User updated successfully", user: updatedUser }),
        { status: 200 }
      );
  } catch (error: any) {
    return new NextResponse("Error updating user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId  = searchParams.get("userId");
        await connect();
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "please put userId! " }), {
                status: 400,
            });
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid username" }), {
                status: 400,
            });
        }
        const deletedUser = await User.findByIdAndDelete({ _id: new ObjectId(userId) });
        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }
        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully", user: deletedUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error deleting user" + error.message, {
            status: 500,
        });
    }
};
