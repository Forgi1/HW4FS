import React, { useState } from 'react';
import './App.css';

function CatImageFetcher() {
  // Update the state to hold an object with image data
  const [catImage, setCatImage] = useState({
    url: '',
    id: '',
    width: 0,
    height: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);

  const toggleBan = (breedId) => {
    setBanList((currentBanList) =>
      currentBanList.includes(breedId)
        ? currentBanList.filter((id) => id !== breedId)
        : [...currentBanList, breedId]
    );
  };

  const fetchCatImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allBreedIds = ['beng', 'abys', 'aege', 'chau'];
      const filteredBreedIds = allBreedIds.filter((id) => !banList.includes(id));

      if (filteredBreedIds.length === 0) {
        setError("No breeds available to fetch. Please unban some breeds.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${filteredBreedIds.join(',')}`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      if (data[0]) {
        // Update state with new image data
        setCatImage({
          url: data[0].url,
          id: data[0].id,
          width: data[0].width,
          height: data[0].height
        });
      } else {
        setCatImage({
          url: '',
          id: '',
          width: 0,
          height: 0
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cat-fetcher">
      <h1>Cat Image Fetcher!</h1>
      {['beng', 'abys', 'aege', 'chau'].map((breed) => (
        <button key={breed} onClick={() => toggleBan(breed)} style={{ margin: '5px' }}>
          {banList.includes(breed) ? `Unban ${breed}` : `Ban ${breed}`}
        </button>
      ))}
      <button onClick={fetchCatImage} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch a Cat Image'}
      </button>
      {error && <p>Error: {error}</p>}
      {catImage.url && (
        <div>
          <img
            src={catImage.url}
            alt="A random cat"
            style={{ width: '900px', height: '700px', objectFit: 'cover' }}
          />
          <p>ID: {catImage.id}</p>
          <p>Width: {catImage.width}px</p>
          <p>Height: {catImage.height}px</p>
        </div>
      )}
    </div>
  );
}

export default CatImageFetcher;
