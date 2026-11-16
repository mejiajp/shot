import path from "path";
import fs from "fs/promises"; // REVISED: Promise-based filesystem
import { randomUUID } from "crypto"; // NEW: Unique image filenames

const IMAGE_DIRECTORY = path.resolve(__dirname, "../../assets/menu");

const saveProductImage = async (
  image: string,
  productName: string
): Promise<string> => {
  const matches = image.match(
    /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/]+=*)$/
  );

  if (!matches) {
    throw new Error("Invalid product image.");
  }

  const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
  const base64Data = matches[2];

  // NEW: UUID prevents filename collisions
  const imageName = `${productName.replace(
    /[^a-zA-Z0-9]/g,
    ""
  )}-${randomUUID()}.${extension}`;

  const imagePath = path.join(IMAGE_DIRECTORY, imageName);
  const imageBuffer = Buffer.from(base64Data, "base64");

  // REVISED: Ensure directory exists
  await fs.mkdir(IMAGE_DIRECTORY, { recursive: true });

  // REVISED: Wait until image is successfully saved
  await fs.writeFile(imagePath, imageBuffer);

  return imageName;
};

export default saveProductImage;
