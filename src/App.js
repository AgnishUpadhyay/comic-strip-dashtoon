import React, { useState } from 'react';
import './App.css';
import query from './api';
import { storage } from './firebase';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

function App() {
  const [isCreating, setIsCreating] = useState(false);
  const [comicInputs, setComicInputs] = useState(new Array(10).fill(''));
  const [comicImages, setComicImages] = useState(new Array(10).fill(null));
  const [currentInput, setCurrentInput] = useState('');

  const handleInputChange = (event, index) => {
    const newInputs = [...comicInputs];
    newInputs[index] = event.target.value;
    setComicInputs(newInputs);
  };

  const handleStartCreating = () => {
    setIsCreating(true);
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
        const result = await query({ inputs: queryInput });
        results.push(URL.createObjectURL(result));
      }
      setComicImages(results);
    } catch (error) {
      console.error('Error calling the API:', error);
    }
  };
  

  const generateAndSharePDF = async () => {
    try {
      // Assuming your images are stored in the `comicImages` state
      const imageUrls = comicImages.filter(Boolean);
  
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
  
      // Iterate through image URLs and add each image to the PDF
      for (const url of imageUrls) {
        const imageBytes = await fetch(url).then((response) => response.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes);
        const page = pdfDoc.addPage();
        page.drawImage(image, {
          x: 50,
          y: 500,
          width: 400,
          height: 200,
        });
      }
  
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  
      // Provide a way for the user to download or share the PDF
      saveAs(pdfBlob, 'comic-strip.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <div className="navbar">
          <h1>Comic Strip Generator</h1>
          <a href="https://www.linkedin.com/in/agnish123/" target="_blank" rel="noopener noreferrer">
            About Me
          </a>
        </div>
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
              <button type="submit" className="generate-button">Generate Comic</button>
              <button type="button" onClick={generateAndSharePDF} className="share-button">
              Share Comic as PDF
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
              Unleash the creative mind inside you. Give an idea to the tool and wait for the magic to happen.
            </p>
            <button onClick={handleStartCreating}>Generate Panels</button>
          </div>
        )}
      </header>
    </div>
  );
}


export default App;