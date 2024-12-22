
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [format, setFormat] = useState('mp4');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponse(null); // Reset response before submitting
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&platform=${platform}&format=${format}`);
    const data = await res.json();

    if (res.ok) {
      setResponse({ success: true, message: data.message, filename: data.filename });
    } else {
      setResponse({ success: false, error: data.error });
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '8px' }}>
        <h2 className="text-center">Download TikTok & YouTube Videos</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="url">Video URL:</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter video URL"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="platform">Platform:</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
            >
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="format">Format:</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
            >
              <option value="mp4">MP4</option>
              <option value="mp3">MP3</option>
            </select>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0d6efd', border: 'none', borderRadius: '5px' }}>
            Download
          </button>
        </form>

        {response && (
          <div style={{ marginTop: '20px' }}>
            {response.success ? (
              <div style={{ color: 'green' }}>
                <p>{response.message}</p>
                <p>Filename: {response.filename}</p>
              </div>
            ) : (
              <div style={{ color: 'red' }}>
                <p>Error: {response.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
