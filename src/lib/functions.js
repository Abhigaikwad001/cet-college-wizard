// Utility functions for MHT-CET College Predictor

// Form input handlers
export const handleScoreChange = (e) => {
  const value = e.target.value;
  // Only allow numbers between 0-200
  if (value === "" || (Number(value) >= 0 && Number(value) <= 200)) {
    return value;
  }
  return null;
};

export const handleCategoryChange = (value) => {
  return value;
};

export const handleBranchChange = (value) => {
  return value;
};

// College prediction with dummy data
export const handlePredictCollege = (score, setResults) => {
  const colleges = [
    { name: "COEP Pune", branch: "Computer Engineering", cutoff: 98, location: "Pune" },
    { name: "VJTI Mumbai", branch: "Electronics", cutoff: 96, location: "Mumbai" },
    { name: "SPPU Pune", branch: "Mechanical", cutoff: 92, location: "Pune" },
    { name: "Walchand Sangli", branch: "Civil", cutoff: 90, location: "Sangli" },
    { name: "Government College of Engineering, Aurangabad", branch: "IT", cutoff: 85, location: "Aurangabad" },
  ];

  // Filter colleges where user's score is greater than or equal to cutoff
  const eligibleColleges = colleges.filter(college => Number(score) >= college.cutoff);
  
  // Sort by cutoff in descending order (highest cutoff first)
  const sortedColleges = eligibleColleges.sort((a, b) => b.cutoff - a.cutoff);
  
  setResults(sortedColleges);
  return sortedColleges;
};

// Form reset handler
export const handleResetForm = (setScore, setCategory, setBranch, setResults) => {
  setScore("");
  setCategory("");
  setBranch("");
  setResults([]);
};

// Sort results handler
export const handleSortResults = (option, results, setResults) => {
  let sortedResults = [...results];
  
  switch (option) {
    case "cutoff":
      sortedResults.sort((a, b) => b.cutoff - a.cutoff);
      break;
    case "name":
      sortedResults.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "location":
      sortedResults.sort((a, b) => a.location.localeCompare(b.location));
      break;
    default:
      break;
  }
  
  setResults(sortedResults);
};

// Search college handler
export const handleSearchCollege = (query, results, setFilteredResults) => {
  if (!query.trim()) {
    setFilteredResults(results);
    return;
  }
  
  const filtered = results.filter(college => 
    college.name.toLowerCase().includes(query.toLowerCase())
  );
  
  setFilteredResults(filtered);
};

// Save favorite handler
export const handleSaveFavorite = (college, favorites, setFavorites) => {
  const isAlreadyFavorite = favorites.some(fav => fav.name === college.name);
  
  if (!isAlreadyFavorite) {
    const updatedFavorites = [...favorites, college];
    setFavorites(updatedFavorites);
    // Save to localStorage
    localStorage.setItem("cetFavorites", JSON.stringify(updatedFavorites));
    return true; // Successfully added
  }
  
  return false; // Already exists
};

// Remove favorite handler
export const handleRemoveFavorite = (college, favorites, setFavorites) => {
  const updatedFavorites = favorites.filter(fav => fav.name !== college.name);
  setFavorites(updatedFavorites);
  // Update localStorage
  localStorage.setItem("cetFavorites", JSON.stringify(updatedFavorites));
};

// Dark mode toggle handler
export const handleDarkModeToggle = (isDark, setIsDark) => {
  const newDarkMode = !isDark;
  setIsDark(newDarkMode);
  // Save preference to localStorage
  localStorage.setItem("cetDarkMode", JSON.stringify(newDarkMode));
  
  // Apply to document
  if (newDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Team info modal handler
export const handleTeamInfo = (setShowModal) => {
  setShowModal(true);
};

// Load favorites from localStorage
export const loadFavorites = () => {
  try {
    const saved = localStorage.getItem("cetFavorites");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

// Load dark mode preference from localStorage
export const loadDarkMode = () => {
  try {
    const saved = localStorage.getItem("cetDarkMode");
    return saved ? JSON.parse(saved) : false;
  } catch (error) {
    console.error("Error loading dark mode preference:", error);
    return false;
  }
};