
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

// Membuat promise dari exec untuk penggunaan async/await
const execPromise = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url, platform = 'youtube', format = 'mp4' } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let downloadCommand;
        const filePath = path.join(process.cwd(), 'downloads');

        // Menentukan perintah untuk download berdasarkan platform
        if (platform === 'youtube') {
            downloadCommand = \`yt-dlp -f \${format === 'mp3' ? 'bestaudio' : 'best'} -o "\${filePath}/%(title)s.%(ext)s" \${url}\`;
        } else if (platform === 'tiktok') {
            // TikTok download dapat memerlukan API atau scraping tool
            // Sesuaikan dengan metode download TikTok
            downloadCommand = \`yt-dlp -o "\${filePath}/%(title)s.%(ext)s" \${url}\`;
        } else {
            return res.status(400).json({ error: 'Platform not supported' });
        }

        // Menjalankan perintah untuk mengunduh video
        const { stdout, stderr } = await execPromise(downloadCommand);

        if (stderr) {
            return res.status(500).json({ error: stderr });
        }

        return res.status(200).json({ message: 'Download successful', filename: stdout });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
