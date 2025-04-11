import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoPath } = await req.json();

    const configPath = '/usr/local/mirasys/config/people_count_temp.json';

    // Extract base name from path
    const videoFileName = path.basename(videoPath); // e.g., 5.mov

    // Read and parse the config JSON
    const jsonData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    if (
      jsonData &&
      jsonData.data &&
      jsonData.data.cameras &&
      jsonData.data.cameras.length > 0
    ) {
      // Update rtsp_url and camera_name
      jsonData.data.cameras[0].rtsp_url = videoPath;
      jsonData.data.cameras[0].camera_name = videoFileName;

      // Save the updated JSON
      fs.writeFileSync(configPath, JSON.stringify(jsonData, null, 2));

      // Restart systemd service
      exec('sudo systemctl restart mirasys-file.service', (error, stdout, stderr) => {
        if (error) console.error(`Service restart error: ${error.message}`);
        if (stderr) console.error(`Service stderr: ${stderr}`);
        if (stdout) console.log(`Service stdout: ${stdout}`);
      });

      return NextResponse.json(
        { message: 'Video path and camera name updated. Service restarted.' },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: 'Invalid JSON structure' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
