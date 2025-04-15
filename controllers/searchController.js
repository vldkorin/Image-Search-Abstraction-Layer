import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import SearchQuery from "../models/SearchQuery.js";

export const searchImages = async (req, res) => {
    const { q, page = 1 } = req.query;

    if(!q) {
        return res.status(400).json({ error: "No search query" });
    }

    await SearchQuery.create({ query: q });

    try {
        const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });
        const photos = await unsplash.search.getPhotos({ query: q, page, perPage: 10 });
    
        const images = photos.response?.results || [];
    
        let html = `<h1>Search results for "${q}"</h1><div>`;
        images.forEach(img => {
          html += `
            <div style="margin-bottom: 20px;">
              <img src="${img.urls.small}" alt="${img.alt_description || 'No description'}" />
              <p>${img.alt_description || 'No description'}</p>
              <a href="${img.links.html}" target="_blank">View on Unsplash</a>
            </div>
          `;
        });
        html += `</div><a href="/">Back</a>`;
        res.send(html);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
};
  
  export const getRecentSearches = async (req, res) => {
    try{
        const queries = await SearchQuery.find({}, 'query _id createdAt')
        .sort({createdAt: -1})
        .limit(10);
    
        let html = `<h1>Resent Searches</h1><div>`;
        queries.forEach(q => {
            html += `
              <div style="border: 1px solid black; border-radius: 10px; padding: 10px; margin: 10px">
                <p>Id: ${q._id}</p>
                <p>Search query: ${q.query}</p>
                <p>Id: ${q.createdAt}</p>
              </div>
            `;
        });
        html += `</div><a href="/">Back</a>`;
    
        res.send(html);
    } catch(e) {
        res.status(500).json({error: "Failed to fetch"});
    }
};