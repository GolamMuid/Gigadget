// ? Create the store

import imagekit from "@/configs/imagekit";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // * Getting data from the form

    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextRequest.json({ error: "missing store info" }, { status: 400 });
    }
    // * Check if user have already registered a store

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // * if a store is already registered then send status of the user

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    // * check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "username already taken" },
        { status: 400 }
      );
    }

    // * Image upload to imagekit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    // * link store to user

    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "applied, waiting for approval" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// ? Check if the user have already registered a store. If yes, send the status of the store

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // * Check if user have already registered a store

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // * if a store is already registered then send status of the user

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
