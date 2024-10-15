// const dislikeRecipe = async (req, res) => {
//     // Destructure recipeId and userId from req.body
//     const { recipeId, userId } = req.body;
  
//     console.log("Recipe ID:", recipeId, "User ID:", userId);
  
//     try {
//       // Find the recipe by its ID
//       const recipe = await RecipeModel.findById(recipeId);
//       console.log(recipe); // Logging the recipe to check its details
  
//       if (!recipe) {
//         // If no recipe is found, return a 404 error
//         return res.status(404).json({ message: "Recipe not found" });
//       }
  
//       // Check if the user has already disliked the recipe
//       if (recipe.dislikedBy.includes(userId)) {
//         // If the user has already disliked the recipe, remove them from dislikedBy
//         recipe.dislikedBy.pull(userId); // Remove the user from dislikedBy
//         console.log("User removed dislike from the recipe:", recipeId);
//       } else {
//         // If the user has liked the recipe, remove them from likedBy
//         if (recipe.likedBy.includes(userId)) {
//           recipe.likedBy.pull(userId); // Remove the user from likedBy
//         }
  
//         // Add the user to dislikedBy
//         recipe.dislikedBy.push(userId);
//         console.log("User disliked the recipe:", recipeId);
//       }
  
//       // Save the updated recipe
//       await recipe.save();
  
//       // Return a success message
//       return res
//         .status(200)
//         .json({
//           message: "Recipe disliked/undisliked successfully",
//           data: recipe,
//         });
//     } catch (error) {
//       // Log the error and return an appropriate message
//       console.error(error);
//       return res
//         .status(500)
//         .json({
//           message: `Error disliking/undisliking recipe: ${error.message}`,
//         });
//     }
//   };
  
// const likeRecipe = async (req, res) => {
//     // Destructure recipeId and userId from req.body
//     const { recipeId, userId } = req.body;
  
//     console.log("Recipe ID:", recipeId, "User ID:", userId);
  
//     try {
//       // Find the recipe by its ID
//       const recipe = await RecipeModel.findById(recipeId);
//       console.log(recipe); // Logging the recipe to check its details
  
//       if (!recipe) {
//         // If no recipe is found, return a 404 error
//         return res.status(404).json({ message: "Recipe not found" });
//       }
  
//       // Check if the user has already liked the recipe
//       if (recipe.likedBy.includes(userId)) {
//         // If the user has already liked the recipe, remove them from likedBy
//         recipe.likedBy.pull(userId); // Remove the user from likedBy
//         console.log("User unliked the recipe:", recipeId);
//       } else {
//         // If the user has disliked the recipe, remove them from dislikedBy
//         if (recipe.dislikedBy.includes(userId)) {
//           recipe.dislikedBy.pull(userId); // Remove the user from dislikedBy
//         }
  
//         // Add the user to likedBy
//         recipe.likedBy.push(userId);
//         console.log("User liked the recipe:", recipeId);
//       }
  
//       // Save the updated recipe
//       await recipe.save();
  
//       // Return a success message
//       return res
//         .status(200)
//         .json({ message: "Recipe liked/unliked successfully", data: recipe });
//     } catch (error) {
//       // Log the error and return an appropriate message
//       console.error(error);
//       return res
//         .status(500)
//         .json({ message: `Error liking/unliking recipe: ${error.message}` });
//     }
//   };
  