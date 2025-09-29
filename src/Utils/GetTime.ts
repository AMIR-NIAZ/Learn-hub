import { getVideoDurationInSeconds } from "get-video-duration";
import fs from "fs";

export default async function getDuration(filePath: string): Promise<number> {
  const duration = await getVideoDurationInSeconds(fs.createReadStream(filePath));
  return Math.floor(duration);
}