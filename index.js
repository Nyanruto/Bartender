import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/generator', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/random.php`);
    const drink = response.data.drinks[0];

    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
      } else {
        break;
      }
    }

    const cocktail = {
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      ingredients: ingredients
    };

    res.render('index', { cocktail: cocktail, error: null });
  } catch (error) {
    const errorMessage = "Oops! We couldn't fetch a cocktail. Please try again.";
    res.render('index', { cocktail: null, error: errorMessage });
  }
});

app.post('/search', async (req, res) => {
  const searchTerm = req.body.cocktailName;
  const searchUrl = `${API_URL}/search.php?s=${searchTerm}`;

  try {
    const response = await axios.get(searchUrl);
    
    if (response.data.drinks) {
      const drink = response.data.drinks[0];
      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
          ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
        } else {
          break;
        }
      }
      const cocktail = {
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: ingredients
      };
      
      res.render('index', { cocktail: cocktail, error: null });
    } else {
      const errorMessage = `Sorry, we couldn't find any cocktails named "${searchTerm}".`;
      res.render('index', { cocktail: null, error: errorMessage });
    }
  } catch (error) {
    const errorMessage = "Oops! Something went wrong with the search.";
    res.render('index', { cocktail: null, error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000`);
});
