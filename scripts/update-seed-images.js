const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, '..', 'src', 'lib', 'seedDestinations.ts');

rl.question('Please enter your Unsplash Access Key: ', async (apiKey) => {
  if (!apiKey.trim()) {
    console.error('Error: Unsplash Access Key is required.');
    rl.close();
    process.exit(1);
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to match the standard destination blocks in seedDestinations.ts
    // Matches: id: "...", name: "...", country: "...", image: "..."
    const regex = /(id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*image:\s*")([^"]+)(")/g;
    
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        prefix: match[1],
        id: match[2],
        name: match[3],
        country: match[4],
        oldUrl: match[5],
        suffix: match[6],
        index: match.index
      });
    }

    if (matches.length === 0) {
      console.log('No destinations found to update.');
      rl.close();
      process.exit(0);
    }

    console.log(`Found ${matches.length} destinations. Updating images sequentially...`);

    let updatedContent = content;

    for (let i = 0; i < matches.length; i++) {
      const dest = matches[i];
      const query = `${dest.name} ${dest.country} landmark`;
      console.log(`[${i + 1}/${matches.length}] Fetching image for: "${dest.name}, ${dest.country}"...`);
      
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5&content_filter=high`,
          {
            headers: {
              Authorization: `Client-ID ${apiKey.trim()}`
            }
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.error(`  X Failed to fetch: Unsplash API returned status ${response.status}. Details: ${errText}`);
          continue;
        }

        const data = await response.json();
        const photo = data.results?.[0];

        if (photo && photo.id) {
          const newUrl = `https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=1200&q=80`;
          
          // Re-build the target content with the new URL
          const targetToReplace = dest.prefix + dest.oldUrl + dest.suffix;
          const replacement = dest.prefix + newUrl + dest.suffix;
          
          updatedContent = updatedContent.replace(targetToReplace, replacement);
          console.log(`  ✓ Updated to: ${newUrl}`);
        } else {
          console.warn(`  ! No search results found on Unsplash for "${query}".`);
        }
      } catch (err) {
        console.error(`  X Network error fetching image for ${dest.name}:`, err.message);
      }

      // 500ms delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log('\nSUCCESS: src/lib/seedDestinations.ts has been updated with high-quality landmark images!');

  } catch (err) {
    console.error('An unexpected error occurred:', err);
  } finally {
    rl.close();
  }
});
