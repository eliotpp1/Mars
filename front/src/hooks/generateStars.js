export const generateStars = (starsContainer) => {
  if (!starsContainer) return;

  const numberOfStars = 100;
  starsContainer.innerHTML = ""; // Réinitialiser les étoiles

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const size = Math.random() * 3 + 1; // Taille entre 1px et 4px
    const duration = Math.random() * 3 + 2; // Animation entre 2s et 5s

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${duration}s`;

    starsContainer.appendChild(star);
  }
};
