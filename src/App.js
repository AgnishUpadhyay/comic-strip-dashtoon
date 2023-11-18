import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import './App.css';
import jsPDF from 'jspdf';

function App() {
  const [isCreating, setIsCreating] = useState(false);
  const [comicInputs, setComicInputs] = useState(new Array(10).fill(''));
  const [comicImages, setComicImages] = useState(new Array(10).fill(null));

  const handleInputChange = (event, index) => {
    const newInputs = [...comicInputs];
    newInputs[index] = event.target.value;
    setComicInputs(newInputs);
  };

  const handleStartCreating = () => {
    setIsCreating(true);
  };

  const placeholderImageUrl = 'https://placekitten.com/512/512';

  const generateAndSharePDF = async () => {
    try {
      const imageUrls = comicImages.filter(Boolean);
      const pdf = new jsPDF({ unit: 'px', format: 'letter' }); // Set the format to 'letter' or adjust as needed
      const totalPanels = imageUrls.length;
      const panelsPerPage = 1;
      const panelWidth = pdf.internal.pageSize.getWidth() - 20; // Adjust the margin as needed
      const panelHeight = pdf.internal.pageSize.getHeight() - 20; // Adjust the margin as needed
      const margin = 10;
  
      for (let i = 0; i < totalPanels; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrls[i];
  
        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Add image to PDF
            const pageNumber = i;
            const x = margin;
            const y = margin;
  
            try {
              //pdf.addImage(img, 'JPEG', x, y + pageNumber * panelHeight, panelWidth, panelHeight);
              pdf.addImage(img, 'JPEG', x, y, panelWidth, panelHeight);
              if (i < totalPanels - 1) {
                pdf.addPage(); // Add a new page for each panel
              }
              resolve();
            } catch (error) {
              console.error('Error adding image to PDF:', error);
              reject(error);
            }
          };
  
          img.onerror = (error) => {
            console.error('Error loading image:', error);
            reject(error);
          };
        });
      }
  
      pdf.save('comic-strip.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newInputs = comicInputs.map((input) => input + ' comic strip');
      const results = [];

      for (let i = 0; i < newInputs.length; i++) {
        let queryInput = newInputs[i];

        if (i === 0) {
          queryInput += ' cover page';
        } else {
          const previousWords = comicInputs[i - 1]
            .split(' ')
            .filter((word) => word.length > 0)
            .sort((a, b) => b.length - a.length)
            .slice(0, 5);
          queryInput += ' ' + previousWords.join(' ');
        }
        const result = { data: placeholderImageUrl };
        results.push(result.data);
      }

      setComicImages(results);
    } catch (error) {
      console.error('Error calling the API:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isCreating ? (
          <>
            <h2>Enter detailed captions for panels</h2>
            <form onSubmit={handleSubmit}>
              <div className="panels">
                {comicInputs.map((input, index) => (
                  <div key={index} className="panel">
                    <label>
                      Panel {index + 1}:
                      <input
                        type="text"
                        value={input}
                        onChange={(event) => handleInputChange(event, index)}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <button type="submit" className="generate-button">
                Generate Comic
              </button>
              <button type="button" onClick={generateAndSharePDF} className="share-button">
                Share Comic
              </button>
            </form>
            <div className="image-holders">
              {comicImages.map((image, index) => (
                <div key={index} className="image-holder">
                  {image && <img src={image} alt={`Generated Comic - Panel ${index + 1}`} />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="intro-page">
            <h1>Welcome to the Comic Strip Generator!</h1>
            <p>
              Unleash the creative mind inside you. Give an idea to the tool and wait for the magic
              to happen.
            </p>
            <button onClick={handleStartCreating}>Generate Panels</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
